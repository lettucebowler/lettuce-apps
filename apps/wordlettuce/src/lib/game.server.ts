import { getRequestEvent } from '$app/server';
import { STATE_COOKIE_NAME_V2, STATE_COOKIE_SETTINGS } from './app-constants';
import { WordlettuceGame } from './wordlettuce-game.svelte';

export function getGameStateFromCookie() {
  try {
    const event = getRequestEvent();
    const stateString = event.cookies.get(STATE_COOKIE_NAME_V2);
    if (!stateString) {
      return new WordlettuceGame();
    }
    return WordlettuceGame.decode(stateString);
  } catch (e) {
    return new WordlettuceGame();
  }
}

export function saveGameStateToCookie(game: WordlettuceGame) {
  const event = getRequestEvent();
  event.cookies.set(STATE_COOKIE_NAME_V2, game.encoded, STATE_COOKIE_SETTINGS);
}
