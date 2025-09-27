import { form, getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { GuessLetter } from './game-schemas';
import * as apiWordlettuce from './api-wordlettuce.server';
import { getGameStateFromCookie, saveGameStateToCookie } from './game.server';

export const getGameState = query(async () => {
  return getGameStateFromCookie();
});

export const getRankings = query(async () => {
  return apiWordlettuce.getRankings();
});

export const letter = form(
  v.object({
    key: GuessLetter,
  }),
  async ({ key }) => {
    const game = getGameStateFromCookie();
    game.doLetter(key);
    saveGameStateToCookie(game);

    await getGameState().refresh();

    return {
      success: false,
      invalid: false,
    };
  },
);

export const undo = form(async () => {
  const game = getGameStateFromCookie();
  game.doUndo();
  saveGameStateToCookie(game);

  await getGameState().refresh();

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
  saveGameStateToCookie(game);
  await getGameState().refresh();
  if (game.success && event.locals.session) {
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
