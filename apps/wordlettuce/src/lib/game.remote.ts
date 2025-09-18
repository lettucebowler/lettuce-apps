import { form, getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { STATE_COOKIE_NAME_V2, STATE_COOKIE_SETTINGS } from './app-constants';
import { GuessLetter } from './game-schemas';
import { createApiWordlettuceServerClient } from './api-wordlettuce.server';
import { getGameStateFromCookie } from './game.server';

export const getGameState = query(async () => {
  return getGameStateFromCookie();
});

export const letter = form(
  v.object({
    key: GuessLetter,
  }),
  async ({ key }) => {
    const game = getGameStateFromCookie();
    const event = getRequestEvent();

    game.doLetter(key);
    event.cookies.set(STATE_COOKIE_NAME_V2, game.toStateString(), STATE_COOKIE_SETTINGS);

    return {
      success: false,
      invalid: false,
    };
  },
);

export const undo = form(async () => {
  const game = getGameStateFromCookie();
  game.doUndo();

  const event = getRequestEvent();
  event.cookies.set(STATE_COOKIE_NAME_V2, game.toStateString(), STATE_COOKIE_SETTINGS);

  return {
    success: false,
    invalid: false,
  };
});

export const word = form(async () => {
  const event = getRequestEvent();
  const game = getGameStateFromCookie();

  if (game.success) {
    return {
      success: true,
      invalid: false,
    };
  }
  game.doSumbit();
  if (game.invalid) {
    return {
      success: false,
      invalid: true,
    };
  }
  event.cookies.set(STATE_COOKIE_NAME_V2, game.toStateString(), STATE_COOKIE_SETTINGS);
  if (game.success && event.locals.session) {
    const apiWordlettuce = createApiWordlettuceServerClient(event);
    const inserts = await apiWordlettuce.saveGame({
      answers: game.answers.join(''),
      userID: event.locals.session.userID,
      gameNum: game.gameNum,
    });
    if (!inserts.length) {
      error(500, { message: 'Error saving to database' });
    }
    return {
      success: true,
      invalid: false,
    };
  } else {
    return {
      success: false,
      invalid: false,
    };
  }
});
