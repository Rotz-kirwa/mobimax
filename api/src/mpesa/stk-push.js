export const runtime = 'nodejs';

const REQUIRED_ENV_VARS = [
  'MPESA_CONSUMER_KEY',
  'MPESA_CONSUMER_SECRET',
  'MPESA_SHORTCODE',
  'MPESA_PASSKEY',
];

// ── In-memory rate limiter (resets on cold start; good enough for serverless) ──
// Max 10 STK push requests per IP per 60-second window.
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    console.warn(JSON.stringify({ type: 'rate_limit_exceeded', ip, count: entry.count, ts: new Date().toISOString() }));
    return true;
  }

  entry.count += 1;
  return false;
}

// Safaricom numbers: 07XX or 01XX (after normalisation 2547XX or 2541XX)
const SAFARICOM_REGEX = /^254[17]\d{8}$/;

const BASE_URLS = {
  sandbox: 'https://sandbox.safaricom.co.ke',
  live: 'https://api.safaricom.co.ke',
};

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

function getMissingEnvVars() {
  return REQUIRED_ENV_VARS.filter((key) => !process.env[key]?.trim());
}

function formatKenyanPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');

  if (digits.startsWith('254') && digits.length === 12) {
    return digits;
  }

  if (digits.startsWith('0') && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }

  if (digits.length === 9) {
    return `254${digits}`;
  }

  return null;
}

function buildTimestamp() {
  const now = new Date();
  const parts = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ];

  return parts.join('');
}

function resolveCallbackUrl(request) {
  if (process.env.MPESA_CALLBACK_URL?.trim()) {
    return process.env.MPESA_CALLBACK_URL.trim();
  }

  const origin = new URL(request.url).origin;

  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    throw new Error(
      'Set MPESA_CALLBACK_URL to a public HTTPS URL before triggering an STK push from local development.'
    );
  }

  return `${origin}/api/mpesa/callback`;
}

async function getAccessToken(baseUrl) {
  const consumerKey = process.env.MPESA_CONSUMER_KEY.trim();
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET.trim();
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.access_token) {
    throw new Error(
      result.errorMessage ||
        result.error_description ||
        'Unable to authenticate with Safaricom Daraja.'
    );
  }

  return result.access_token;
}

export function GET() {
  const missing = getMissingEnvVars();

  return json({
    ok: missing.length === 0,
    message:
      missing.length === 0
        ? 'M-Pesa STK push endpoint is configured.'
        : 'M-Pesa STK push endpoint is missing environment variables.',
    missing,
  });
}

export async function POST(request) {
  // ── Rate limiting ────────────────────────────────────────────────────────
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '0.0.0.0';

  if (isRateLimited(ip)) {
    return json(
      { ok: false, message: 'Too many requests. Please wait a moment before trying again.' },
      429
    );
  }

  // ── Env check ────────────────────────────────────────────────────────────
  const missing = getMissingEnvVars();

  if (missing.length > 0) {
    return json(
      { ok: false, message: 'M-Pesa checkout is not configured yet.', missing },
      500
    );
  }

  // ── Parse body ───────────────────────────────────────────────────────────
  let payload;

  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: 'Invalid checkout payload — expected JSON.' }, 400);
  }

  const items = Array.isArray(payload?.items) ? payload.items : [];
  const amount = Math.round(Number(payload?.amount));
  const customer = payload?.customer || {};

  // ── Field validation ─────────────────────────────────────────────────────
  if (!items.length) {
    return json({ ok: false, message: 'Your cart is empty.' }, 400);
  }

  if (!Number.isFinite(amount) || amount < 1) {
    return json({ ok: false, message: 'Checkout total must be at least KSh 1.' }, 400);
  }

  const phoneNumber = formatKenyanPhone(customer.phone);

  if (!phoneNumber) {
    return json(
      { ok: false, message: 'Enter a valid Safaricom number in 07..., 01..., or 254... format.' },
      400
    );
  }

  // Ensure only Safaricom lines (07XX / 01XX) are accepted — other networks
  // cannot receive M-Pesa STK prompts.
  if (!SAFARICOM_REGEX.test(phoneNumber)) {
    return json(
      { ok: false, message: 'Only Safaricom lines (07XX or 01XX) can receive an M-Pesa STK push.' },
      400
    );
  }

  try {
    const mpesaEnvironment = process.env.MPESA_ENV === 'live' ? 'live' : 'sandbox';
    const baseUrl = BASE_URLS[mpesaEnvironment];
    const callbackUrl = resolveCallbackUrl(request);
    const timestamp = buildTimestamp();
    const shortcode = process.env.MPESA_SHORTCODE.trim();
    const passkey = process.env.MPESA_PASSKEY.trim();
    const partyB = process.env.MPESA_PARTY_B?.trim() || shortcode;
    const transactionType =
      process.env.MPESA_TRANSACTION_TYPE?.trim() || 'CustomerPayBillOnline';
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
    const orderReference = `MBX-${Date.now().toString().slice(-8)}`;
    const accountReference = process.env.MPESA_ACCOUNT_REFERENCE?.trim() || orderReference;
    const token = await getAccessToken(baseUrl);

    const stkResponse = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: transactionType,
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: partyB,
        PhoneNumber: phoneNumber,
        CallBackURL: callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: `Mobiplus order ${orderReference}`,
      }),
    });

    const result = await stkResponse.json().catch(() => ({}));

    if (!stkResponse.ok || result.ResponseCode !== '0') {
      return json(
        {
          ok: false,
          message:
            result.errorMessage ||
            result.ResponseDescription ||
            'Safaricom rejected the STK push request.',
          details: result,
        },
        502
      );
    }

    return json({
      ok: true,
      message: result.ResponseDescription || 'STK push sent successfully.',
      customerMessage:
        result.CustomerMessage || 'STK push sent. Check your phone and enter your M-Pesa PIN.',
      merchantRequestId: result.MerchantRequestID || '',
      checkoutRequestId: result.CheckoutRequestID || '',
      reference: orderReference,
      callbackUrl,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        message: error.message || 'Unable to start the M-Pesa STK push right now.',
      },
      500
    );
  }
}
