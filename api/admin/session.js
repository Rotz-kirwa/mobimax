import { getSessionFromRequest, json } from './_auth.js';

export const runtime = 'nodejs';

export function GET(request) {
  const session = getSessionFromRequest(request);

  if (!session) {
    return json({
      ok: true,
      authenticated: false,
    });
  }

  return json({
    ok: true,
    authenticated: true,
    username: session.username,
  });
}
