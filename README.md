# Mobiplus Storefront

Premium electronics storefront built with React, Vite, Tailwind CSS, and Zustand.

## Local development

```bash
npm install
npm run dev
```

## Checkout and M-Pesa STK push

The checkout page now supports a real details -> payment flow and posts M-Pesa requests to the server-side endpoint at `/api/mpesa/stk-push`.

### Required environment variables

Copy `.env.example` and fill in your Daraja credentials:

```bash
cp .env.example .env
```

Required values:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `MPESA_ENV`
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`

Optional values:

- `MPESA_TRANSACTION_TYPE`
- `MPESA_PARTY_B`
- `MPESA_ACCOUNT_REFERENCE`
- `MPESA_CALLBACK_URL`

### Callback behavior

If `MPESA_CALLBACK_URL` is not set, the STK endpoint will automatically use the deployed origin and send callbacks to:

```text
/api/mpesa/callback
```

When testing from local development, use a public HTTPS callback URL or run the project from a deployed environment. A plain `localhost` callback will not work with Safaricom.

### Deployment note

The frontend is a Vite app, and the M-Pesa handlers live in `api/mpesa/*.js` as Vercel Functions. Deploying on Vercel is the simplest way to run the storefront and the STK endpoint together.

## Admin dashboard

The project now includes a protected admin dashboard at `/admin` with:

- admin login via server-side session cookie
- product management with image uploads, pricing, stock, merchandising flags, and thumbnail selection
- category and brand management
- order and payment status visibility
- inventory and revenue overview cards

In local development, the default admin credentials come from `.env.example`. Change them before using the app in any shared environment.
