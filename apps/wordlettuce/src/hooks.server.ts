import { sequence } from '@sveltejs/kit/hooks';
import { type Handle, type RequestEvent } from '@sveltejs/kit';
import { STATE_COOKIE_NAME_V2 } from '$lib/app-constants';
import { WordlettuceGame } from '$lib/wordlettuce-game.svelte';
import { getGameNum } from '$lib/words';

async function createGetGameState(event: RequestEvent) {
  const stateString = event.cookies.get(STATE_COOKIE_NAME_V2) || '';
  const requestClone = event.request.clone();
  let currentGameNum = getGameNum();
  if (requestClone.method === 'GET') {
    const searchParams = new URL(requestClone.url).searchParams;
    if (searchParams.has('gameNum') && Number(searchParams.get('gameNum'))) {
      currentGameNum = Number(searchParams.get('gameNum'));
    }
  }
  if (requestClone.method === 'POST') {
    const formData = await requestClone.formData();
    if (Number(formData.get('gameNum'))) {
      currentGameNum = Number(formData.get('gameNum'));
    }
  }
  return {
    getGameStateV3: () => {
      return WordlettuceGame.fromStateString({
        state: stateString,
        currentGameNum: currentGameNum,
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

import { clearTokens, createAuthClient } from '$lib/auth.server';
import { subjects } from '@lettuce-apps-packages/auth';

const authHandler: Handle = async ({ event, resolve }) => {
  const authClient = createAuthClient(event);
  const access_token = event.cookies.get('access_token');
  if (access_token && event.url.pathname !== '/auth' && event.url.pathname !== '/callback') {
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
  }

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
