import { getRequestEvent } from '$app/server';
import { STATE_COOKIE_NAME_V2, STATE_COOKIE_SETTINGS } from './app-constants';
import { WordlettuceGame } from './wordlettuce-game.svelte';
import { getGameNum } from './words';

export function getGameStateFromCookie() {
  try {
    const event = getRequestEvent();
    const stateString = event.cookies.get(STATE_COOKIE_NAME_V2);
    if (!stateString) {
      return new WordlettuceGame();
    }
    const decoded = WordlettuceGame.decode(stateString);
    if (decoded.gameNum !== getGameNum()) {
      return new WordlettuceGame();
    }
    return decoded;
  } catch (e: unknown) {
    return new WordlettuceGame();
  }
}

export function saveGameStateToCookie(game: WordlettuceGame) {
  const event = getRequestEvent();
  event.cookies.set(STATE_COOKIE_NAME_V2, game.encoded, STATE_COOKIE_SETTINGS);
}
