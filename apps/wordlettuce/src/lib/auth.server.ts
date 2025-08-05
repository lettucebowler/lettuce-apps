import type { RequestEvent } from '@sveltejs/kit';
import { createAuthClient } from '@lettuce-apps-packages/auth';
import { dev } from '$app/environment';
import { AUTH_HOST } from '$env/static/private';
import type { URL, RequestInfo, CfProperties, RequestInit } from '@cloudflare/workers-types';
import { getRequestEvent } from '$app/server';

import { subjects } from '@lettuce-apps-packages/auth';

function _createAuthClient() {
  const event = getRequestEvent();
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

export async function getSession() {
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
