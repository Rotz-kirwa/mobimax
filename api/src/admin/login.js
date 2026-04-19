import {
  buildSessionCookie,
  createSessionToken,
  getAdminCredentials,
  json,
} from './_auth.js';

export const runtime = 'nodejs';

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const username = String(body?.username || '').trim();
  const password = String(body?.password || '');
  const adminCredentials = getAdminCredentials();

  if (!username || !password) {
    return json(
      {
        ok: false,
        message: 'Enter both username and password.',
      },
      400
    );
  }

  if (username !== adminCredentials.username || password !== adminCredentials.password) {
    return json(
      {
        ok: false,
        message: 'Incorrect admin credentials.',
      },
      401
    );
  }

  const token = createSessionToken(username);

  return json(
    {
      ok: true,
      username,
    },
    200,
    {
      'Set-Cookie': buildSessionCookie(token),
    }
  );
}
