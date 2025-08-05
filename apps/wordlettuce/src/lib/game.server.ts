import { getRequestEvent } from '$app/server';
import { STATE_COOKIE_NAME_V2, STATE_COOKIE_SETTINGS } from './app-constants';
import { WordlettuceGame } from './wordlettuce-game.svelte';

export function getGameStateFromCookie() {
  const event = getRequestEvent();
  const stateString = event.cookies.get(STATE_COOKIE_NAME_V2) || '';
  return WordlettuceGame.fromStateString({
    state: stateString,
  });
}

export function saveGameStateToCookie(game: WordlettuceGame) {
  const event = getRequestEvent();
  event.cookies.set(STATE_COOKIE_NAME_V2, game.toStateString(), STATE_COOKIE_SETTINGS);
}
