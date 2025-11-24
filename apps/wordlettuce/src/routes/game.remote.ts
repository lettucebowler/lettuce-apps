import { form, getRequestEvent, query } from '$app/server';
import { error as svelteError } from '@sveltejs/kit';
import * as v from 'valibot';

import { GuessLetter } from '$lib/game-schemas';
import * as apiWordlettuce from '$lib/api-wordlettuce.server';
import { getGameStateFromCookie, saveGameStateToCookie } from '$lib/game.server';
import { ActionFormInput, WordFormInput } from './game.schemas';
import { WordlettuceGame } from '$lib/wordlettuce-game.svelte';
import { HTTPError } from 'ky';
import { delay } from '$lib/util';

export const getGameState = query(async () => {
  return getGameStateFromCookie();
});

export const letter = form(
  v.object({
    key: GuessLetter,
  }),
  async ({ key }) => {
    const game = new WordlettuceGame(getGameStateFromCookie());
    game.doLetter(key);
    saveGameStateToCookie(game);

    await getGameState().refresh();

    return {
      success: false,
      invalid: false,
    };
  },
);

export const action = form(ActionFormInput, async (input) => {
  const game = new WordlettuceGame(getGameStateFromCookie());
  if (input.letter) {
    game.doLetter(input.letter);
    saveGameStateToCookie(game);
    await getGameState().refresh();
    return {
      success: false,
      invalid: false,
    };
  } else if (input.undo) {
    game.doUndo();
    saveGameStateToCookie(game);
    await getGameState().refresh();
    return {
      success: false,
      invalid: false,
    };
  } else if (input.word) {
    const event = getRequestEvent();
    if (game.success) {
      return {
        success: true,
        invalid: false,
      };
    }
    const { success, invalid } = game.doWord(input.word);
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
      const [inserts, error] = await apiWordlettuce.saveGame({
        answers: game.answers.join(''),
        userID: event.locals.session.userID,
        gameNum: game.gameNum,
      });
      if (error) {
        svelteError(500, error.message);
      }
      if (
        inserts.gameNum !== game.gameNum ||
        inserts.answers !== game.answers.join('') ||
        inserts.attempts !== game.answers.length ||
        inserts.userID !== event.locals.session.userID
      ) {
        svelteError(500, 'Insertion mismatch');
      }
      return {
        success: true,
        invalid: false,
      };
    }
  }
});

export const undo = form(async () => {
  const game = new WordlettuceGame(getGameStateFromCookie());
  game.doUndo();
  saveGameStateToCookie(game);

  await getGameState().refresh();

  return {
    success: false,
    invalid: false,
  };
});

export const word = form(WordFormInput, async ({ word }) => {
  const game = new WordlettuceGame(getGameStateFromCookie());

  const event = getRequestEvent();
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
    const [inserts, error] = await apiWordlettuce.saveGame({
      answers: game.answers.join(''),
      userID: event.locals.session.userID,
      gameNum: game.gameNum,
    });
    if (error) {
      svelteError(500, error.message);
    }
    if (
      inserts.gameNum !== game.gameNum ||
      inserts.answers !== game.answers.join('') ||
      inserts.attempts !== game.answers.length ||
      inserts.userID !== event.locals.session.userID
    ) {
      svelteError(500, 'Insertion mismatch');
    }
    return {
      success: true,
      invalid: false,
    };
  }
});
