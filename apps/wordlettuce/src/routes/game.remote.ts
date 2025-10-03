import { form, getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { GuessLetter } from '$lib/game-schemas';
import * as apiWordlettuce from '$lib/api-wordlettuce.server';
import { getGameStateFromCookie, saveGameStateToCookie } from '$lib/game.server';
import { WordFormInput } from './game.schemas';

export const getGameState = query(async () => {
  return getGameStateFromCookie();
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

export const word = form(WordFormInput, async ({ word }) => {
  const event = getRequestEvent();
  const game = getGameStateFromCookie();

  if (game.success) {
    return {
      success: true,
      invalid: false,
    };
  }
  const { success, invalid } = game.doWord(word);
  if (invalid) {
    return {
      success: false,
      invalid: true,
    };
  }
  saveGameStateToCookie(game);
  await getGameState().refresh();
  if (!success) {
    return {
      invalid: false,
      success: false,
    };
  }
  if (event.locals.session) {
    const inserts = await apiWordlettuce.saveGame({
      answers: game.answers.join(''),
      userID: event.locals.session.userID,
      gameNum: game.gameNum,
    });
    if (!inserts.length) {
      error(500, { message: 'Error saving to database' });
    }
  }
  return {
    success: true,
    invalid: false,
  };
});
