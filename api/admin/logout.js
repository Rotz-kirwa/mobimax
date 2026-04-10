import { buildLogoutCookie, json } from './_auth.js';

export const runtime = 'nodejs';

export function POST() {
  return json(
    {
      ok: true,
    },
    200,
    {
      'Set-Cookie': buildLogoutCookie(),
    }
  );
}
