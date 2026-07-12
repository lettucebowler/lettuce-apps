import { getRequestEvent } from '$app/server';
import { STATE_COOKIE_NAME_V2, STATE_COOKIE_SETTINGS } from '../app-constants';
import { Wordlettuce } from '$lib/Wordlettuce/Wordlettuce.svelte';
import { getGameNum } from '$lib/Wordlettuce/utils';

export function getGameStateFromCookie() {
  try {
    const event = getRequestEvent();
    const stateString = event.cookies.get(STATE_COOKIE_NAME_V2);
    if (!stateString) {
      return new Wordlettuce();
    }
    const decoded = Wordlettuce.decode(stateString);
    if (decoded.gameNum !== getGameNum()) {
      return new Wordlettuce();
    }
    return decoded;
  } catch (e: unknown) {
    return new Wordlettuce();
  }
}

export function saveGameStateToCookie(game: Wordlettuce) {
  const event = getRequestEvent();
  event.cookies.set(STATE_COOKIE_NAME_V2, game.encoded, STATE_COOKIE_SETTINGS);
}
