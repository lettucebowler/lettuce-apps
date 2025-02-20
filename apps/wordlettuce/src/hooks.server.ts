import { sequence } from '@sveltejs/kit/hooks';
import { type Handle, type RequestEvent } from '@sveltejs/kit';
import { STATE_COOKIE_NAME_V2 } from '$lib/app-constants';
import { WordlettuceGame } from '$lib/wordlettuce-game.svelte';

async function createGetGameState(event: RequestEvent) {
  const stateString = event.cookies.get(STATE_COOKIE_NAME_V2) || '';
  return {
    getGameStateV3: () => {
      return WordlettuceGame.fromStateString({
        state: stateString,
      });
    },
  };
}

const gameStateHandler: Handle = async ({ event, resolve }) => {
  const { getGameStateV3 } = await createGetGameState(event);
  event.locals.getGameStateV3 = getGameStateV3;
  return resolve(event);
};

const fetchHandler: Handle = ({ event, resolve }) => {
  return resolve(event, {
    filterSerializedResponseHeaders: (name) => name === 'content-type',
  });
};

import { clearTokens, createAuthClient, setTokens } from '$lib/auth.server';
import { subjects } from '@lettuce-apps-packages/auth';

const authHandler: Handle = async ({ event, resolve }) => {
  const authClient = createAuthClient(event);
  const access_token = event.cookies.get('access_token') || '';
  const refresh_token = event.cookies.get('refresh_token');
  if (!access_token && !refresh_token) {
    clearTokens(event);
    return resolve(event);
  }
  if (event.url.pathname === '/auth' || event.url.pathname === '/callback') {
    return resolve(event);
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
  if (!verified.err) {
    event.locals.session = verified.subject.properties;
  } else {
    clearTokens(event);
  }
  const after = performance.now();
  console.log('verify', after - before);

  return await resolve(event);
};

const timingsHandler: Handle = async ({ event, resolve }) => {
  const before = performance.now();
  const result = await resolve(event);
  const after = performance.now();
  console.log(event.request.method, new URL(event.request.url).pathname, after - before);
  return result;
};

export const handle = sequence(timingsHandler, gameStateHandler, authHandler, fetchHandler);
