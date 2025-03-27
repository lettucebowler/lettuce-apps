import { fail } from '@sveltejs/kit';
import { STATE_COOKIE_NAME_V2, STATE_COOKIE_SETTINGS } from '$lib/app-constants.js';
import { createApiWordlettuceServerClient } from '$lib/api-wordlettuce.server.js';
import * as v from 'valibot';
import { GuessLetter } from '$lib/game-schemas.js';
import type { WordlettuceGame } from '$lib/wordlettuce-game.svelte.js';
// import { createWordLettuceDao } from "$lib/dao/wordlettuce.server.js";

export const trailingSlash = 'never';

export async function load(event) {
  const game = event.locals.getGameStateV3();
  event.cookies.set(STATE_COOKIE_NAME_V2, game.toStateString(), STATE_COOKIE_SETTINGS);
  return {
    game: game as WordlettuceGame,
  };
}

export const actions: import('./$types').Actions = {
  letter: async (event) => {
    const game = event.locals.getGameStateV3();
    const key = (await event.request.formData()).get('key');
    const parseResult = v.safeParse(GuessLetter, key);

    if (!parseResult.success) {
      return fail(400, {
        success: false,
        invalid: true,
      });
    }

    game.doLetter(parseResult.output);

    event.cookies.set(STATE_COOKIE_NAME_V2, game.toStateString(), STATE_COOKIE_SETTINGS);

    return {
      success: false,
      invalid: false,
    };
  },
  undo: async (event) => {
    const game = event.locals.getGameStateV3();
    game.doUndo();

    event.cookies.set(STATE_COOKIE_NAME_V2, game.toStateString(), STATE_COOKIE_SETTINGS);

    return {
      success: false,
      invalid: false,
    };
  },
  word: async (event) => {
    const game = event.locals.getGameStateV3();
    if (game.success) {
      return {
        success: true,
        invalid: false,
      };
    }
    const data = await event.request.formData();
    const guess = data
      .getAll('guess')
      .map((letter) => letter.toString().toLowerCase())
      .slice(0, 5);
    guess.forEach((letter) => {
      const parseResult = v.safeParse(GuessLetter, letter);
      if (parseResult.success) {
        game.doLetter(parseResult.output);
      }
    });
    const { error } = game.doSumbit();
    if (error) {
      return fail(400, {
        success: false,
        invalid: true,
      });
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
        fail(500, { message: 'Error saving to database' });
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
  },
};
