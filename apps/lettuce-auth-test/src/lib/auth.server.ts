import type { RequestEvent } from '@sveltejs/kit';
import { createAuthClient } from '@lettuce-apps-packages/auth';

import { AUTH_HOST } from '$env/static/private';
import { dev } from '$app/environment';

function _createAuthClient(event: RequestEvent) {
  return createAuthClient({
    clientID: 'lettuce-auth-test',
    issuer: AUTH_HOST,
    fetch: event.fetch,
    storage: event.platform?.env?.lettuce_auth_signing_keys,
  });
}

export { _createAuthClient as createAuthClient };

export async function getSigninUrl(event: RequestEvent) {
  const authClient = _createAuthClient(event);
  const { url } = await authClient.authorize(`${event.url.origin}/callback`, 'code');
  return url;
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

export function clearTokens(event: RequestEvent) {
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
