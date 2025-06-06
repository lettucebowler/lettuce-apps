import type { RequestEvent } from '@sveltejs/kit';
import { createAuthClient } from '@lettuce-apps-packages/auth';
import { dev } from '$app/environment';

import { AUTH_HOST } from '$env/static/private';
import type { URL, RequestInfo, CfProperties, RequestInit } from '@cloudflare/workers-types';
import { getRequestEvent } from '$app/server';

function _createAuthClient(e: RequestEvent | undefined) {
  const event = e ?? getRequestEvent();
  return createAuthClient({
    clientID: 'lettuce-auth-test',
    issuer: AUTH_HOST,
    fetch:
      dev || !event.platform?.env
        ? event.fetch
        : (((a: URL | RequestInfo<unknown, CfProperties<unknown>>, b: RequestInit<CfProperties<unknown>> | undefined) =>
            event.platform!.env!.lettuce_auth!.fetch(a, b)) as unknown as typeof fetch),
    storage: event.platform?.env?.lettuce_auth_signing_keys,
  });
}

export { _createAuthClient as createAuthClient };

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
