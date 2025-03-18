import { WordlettuceGame } from '$lib/wordlettuce-game.svelte';
import type { Reroute, Transport } from '@sveltejs/kit';

export const transport: Transport = {
  WordlettuceGame: {
    encode: (value: WordlettuceGame) => {
      if (!(value instanceof WordlettuceGame)) {
        return false;
      }
      return [value.gameNum, value.currentGuess, ...value.guesses];
    },
    decode: ([gameNum, currentGuess, ...guesses]) => new WordlettuceGame({ gameNum, guesses, currentGuess }),
  },
};

export const reroute: Reroute = ({ url }) => {
  return url.pathname;
};
