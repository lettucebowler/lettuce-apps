import { form, getRequestEvent, query } from '$app/server';
import { error as svelteError } from '@sveltejs/kit';

import * as apiWordlettuce from '$lib/api-wordlettuce.server';
import { getGameStateFromCookie, saveGameStateToCookie } from '$lib/game.server';
import { ActionFormInput } from './game.schemas';

export const getGameState = query(async () => {
  return getGameStateFromCookie();
});

export const action = form(ActionFormInput, async (input) => {
  const game = getGameStateFromCookie();
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
      const gameNumMatch = inserts.gameNum == game.gameNum;
      const answersMatch = game.answers.join('').endsWith(inserts.answers);
      const attemptsMatch = inserts.attempts == game.answers.length;
      const userIDMatch = inserts.userID == event.locals.session.userID;
      if (!gameNumMatch || !answersMatch || !attemptsMatch || !userIDMatch) {
        svelteError(500, 'Insertion mismatch');
      }
      return {
        success: true,
        invalid: false,
      };
    }
  }
});
