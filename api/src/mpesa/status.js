export const runtime = 'nodejs';

const BASE_URLS = {
  sandbox: 'https://sandbox.safaricom.co.ke',
  live: 'https://api.safaricom.co.ke',
};

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function buildTimestamp() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('');
}

async function getAccessToken(baseUrl) {
  const credentials = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY.trim()}:${process.env.MPESA_CONSUMER_SECRET.trim()}`
  ).toString('base64');

  const response = await fetch(
    `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${credentials}` } }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.access_token) {
    throw new Error(result.errorMessage || 'Unable to authenticate with Safaricom Daraja.');
  }

  return result.access_token;
}

// GET /api/mpesa/status?checkoutRequestId=ws_CO_...
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const checkoutRequestId = searchParams.get('checkoutRequestId')?.trim();

  if (!checkoutRequestId) {
    return json({ ok: false, message: 'Missing checkoutRequestId query parameter.' }, 400);
  }

  const missingEnv = ['MPESA_CONSUMER_KEY', 'MPESA_CONSUMER_SECRET', 'MPESA_SHORTCODE', 'MPESA_PASSKEY'].filter(
    (key) => !process.env[key]?.trim()
  );

  if (missingEnv.length > 0) {
    return json({ ok: false, message: 'M-Pesa not configured on the server.', missing: missingEnv }, 500);
  }

  try {
    const mpesaEnvironment = process.env.MPESA_ENV === 'live' ? 'live' : 'sandbox';
    const baseUrl = BASE_URLS[mpesaEnvironment];
    const shortcode = process.env.MPESA_SHORTCODE.trim();
    const passkey = process.env.MPESA_PASSKEY.trim();
    const timestamp = buildTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
    const token = await getAccessToken(baseUrl);

    const queryResponse = await fetch(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    });

    const result = await queryResponse.json().catch(() => ({}));

    // Daraja returns ResultCode as a string or number depending on environment.
    // ResultCode "0"  → payment completed successfully
    // ResultCode null → still processing (pending)
    // Any other code  → failed (1032 = cancelled, 1037 = timeout, etc.)
    const resultCode = result.ResultCode != null ? String(result.ResultCode) : null;

    return json({
      ok: true,
      resultCode: resultCode ?? 'pending',
      resultDesc: result.ResultDesc || 'Payment in progress.',
      merchantRequestId: result.MerchantRequestID || null,
      checkoutRequestId: result.CheckoutRequestID || null,
    });
  } catch (error) {
    // On network error keep polling — return 'pending' so the frontend continues
    console.error(JSON.stringify({ type: 'mpesa_status_error', message: error.message }));
    return json({ ok: true, resultCode: 'pending', resultDesc: 'Checking status…' });
  }
}
