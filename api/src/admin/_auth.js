import { createHmac, timingSafeEqual } from 'node:crypto';

export const runtime = 'nodejs';

const SESSION_COOKIE_NAME = 'mobimax_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 8;

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || 'mobimax-local-dev-secret';
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME?.trim() || 'admin@mobimax.local',
    password: process.env.ADMIN_PASSWORD?.trim() || 'Mobimax123!',
  };
}

function signPayload(payload) {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

export function createSessionToken(username) {
  const payload = JSON.stringify({
    username,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const encoded = base64UrlEncode(payload);
  const signature = signPayload(encoded);
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || !token.includes('.')) {
    return null;
  }

  const [encoded, signature] = token.split('.');
  const expected = signPayload(encoded);

  try {
    const valid = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

    if (!valid) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encoded));

    if (!payload?.exp || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function parseCookies(request) {
  const cookieHeader = request.headers.get('cookie') || '';

  return cookieHeader.split(';').reduce((cookies, part) => {
    const [key, ...rest] = part.trim().split('=');

    if (!key) {
      return cookies;
    }

    cookies[key] = rest.join('=');
    return cookies;
  }, {});
}

export function getSessionFromRequest(request) {
  const cookies = parseCookies(request);
  return verifySessionToken(cookies[SESSION_COOKIE_NAME]);
}

export function buildSessionCookie(token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_MAX_AGE}${secure}`;
}

export function buildLogoutCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

export function json(body, status = 200, headers = {}) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}
