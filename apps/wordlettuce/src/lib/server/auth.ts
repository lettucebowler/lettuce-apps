import { getRequestEvent } from '$app/server';
import type { RequestEvent } from '@sveltejs/kit';
import { createAuthClient } from '@lettuce-apps-packages/auth';
import { dev } from '$app/env';
import { subjects } from '@lettuce-apps-packages/auth';
import { AUTH_HOST } from '$app/env/private';
import type { Session } from '#lib/types.js';
import { env } from 'cloudflare:workers';

export async function getSession(): Promise<Session> {
  const event = getRequestEvent();
  if (!event.locals.session) {
    return {
      authenticated: false as const,
    };
  }
  const user = event.locals.session;
  return {
    authenticated: true as const,
    user,
  };
}

function _createAuthClient() {
  const event = getRequestEvent();
  const storage = {
    get: (key: string) =>
      env.lettuce_auth_signing_keys.get(key, {
        type: 'json',
        cacheTtl: 3600,
      }),
    put: (key: string, value: string) => env.lettuce_auth_signing_keys.put(key, value),
  };
  return createAuthClient({
    clientID: 'lettuce-auth-test',
    issuer: AUTH_HOST,
    fetch:
      dev || !env.lettuce_auth ? event.fetch : (a, b) => (env.lettuce_auth!.fetch as unknown as typeof fetch)(a, b),
    storage,
  });
}

export { _createAuthClient as createAuthClient };

export async function verifySession() {
  const event = getRequestEvent();
  const authClient = _createAuthClient();
  const access_token = event.cookies.get('access_token') || '';
  const refresh_token = event.cookies.get('refresh_token');
  if (!access_token && !refresh_token) {
    clearTokens();
    return null;
  }
  if (!access_token && refresh_token) {
    const result = await authClient.refresh(refresh_token);
    if (!result.err) {
      if (result.tokens) {
        setTokens(event, result.tokens.access, result.tokens.refresh);
      }
    }
  }
  const before = performance.now();
  const verified = await authClient.verify(subjects, event.cookies.get('access_token')!, {
    refresh: event.cookies.get('refresh_token') || undefined,
  });
  if (verified.err) {
    clearTokens();
    return null;
  }
  const after = performance.now();
  console.log('verify', after - before);
  return verified.subject.properties;
}

export function setTokens(event: RequestEvent, access: string, refresh: string) {
  event.cookies.set('refresh_token', refresh, {
    domain: dev ? undefined : '.lettucebowler.net',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 34560000,
  });
  event.cookies.set('access_token', access, {
    domain: dev ? undefined : '.lettucebowler.net',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 34560000,
  });
}

export function clearTokens() {
  const event = getRequestEvent();
  event.cookies.set('refresh_token', '', {
    domain: dev ? undefined : '.lettucebowler.net',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  event.cookies.set('access_token', '', {
    domain: dev ? undefined : '.lettucebowler.net',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
