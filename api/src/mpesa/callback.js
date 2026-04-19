export const runtime = 'nodejs';

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export function GET() {
  return json({
    ok: true,
    message: 'M-Pesa callback endpoint is live.',
  });
}

export async function POST(request) {
  const payload = await request.json().catch(() => null);
  const callback = payload?.Body?.stkCallback;

  console.log(
    JSON.stringify({
      type: 'mpesa_callback',
      merchantRequestId: callback?.MerchantRequestID || null,
      checkoutRequestId: callback?.CheckoutRequestID || null,
      resultCode: callback?.ResultCode ?? null,
      resultDesc: callback?.ResultDesc || null,
    })
  );

  return json({
    ResultCode: 0,
    ResultDesc: 'Accepted',
  });
}
