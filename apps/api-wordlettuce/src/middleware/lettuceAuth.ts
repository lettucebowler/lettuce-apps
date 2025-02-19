import { Context, Next } from 'hono';
import { ApiWordlettuceHono } from '../util/env';
import { HTTPException } from 'hono/http-exception';
import { createAuthClient, subjects } from 'lettuce-auth-common';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

export function requireAuth() {
  return async (c: Context<ApiWordlettuceHono>, next: Next) => {
    const session = c.get('jwtPayload');
    if (!session) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }
    await next();
  };
}

const ACCESS_TOKEN_COOKIE_NAME = 'access_token';
const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

export function lettuceAuth() {
  return async (c: Context<ApiWordlettuceHono>, next: Next) => {
    const { verify } = createAuthClient({
      issuer: 'https://auth.lettucebowler.net',
      clientID: 'api-wordlettuce',
      fetch: (a, b) => c.env.lettuce_auth.fetch(a, b),
      storage: c.env.lettuce_auth_signing_keys,
    });
    const access_token = getCookie(c, ACCESS_TOKEN_COOKIE_NAME);
    if (!access_token) {
      return next();
    }
    const refresh_token = getCookie(c, REFRESH_TOKEN_COOKIE_NAME);
    const verified = await verify(subjects, access_token, { refresh: refresh_token });
    if (verified.err) {
      deleteCookie(c, ACCESS_TOKEN_COOKIE_NAME);
      deleteCookie(c, REFRESH_TOKEN_COOKIE_NAME);
      return next();
    }
    if (verified.tokens) {
      setCookie(c, ACCESS_TOKEN_COOKIE_NAME, verified.tokens.access, {
        domain: new URL(c.req.url).origin.includes('http://localhost') ? undefined : '.lettucebowler.net',
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 34560000,
      });
      setCookie(c, REFRESH_TOKEN_COOKIE_NAME, verified.tokens.refresh, {
        domain: new URL(c.req.url).origin.includes('http://localhost') ? undefined : '.lettucebowler.net',
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 34560000,
      });
    }
    c.set('jwtPayload', verified.subject.properties);
    await next();
  };
}
