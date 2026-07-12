import { Wordlettuce } from '$lib/Wordlettuce/Wordlettuce.svelte';
import type { Reroute, Transport } from '@sveltejs/kit';

export const transport: Transport = {
  WordlettuceGame: {
    encode: (value: Wordlettuce) => {
      if (!(value instanceof Wordlettuce)) {
        return false;
      }
      return [value.gameNum, value.currentGuess, ...value.guesses];
    },
    decode: ([gameNum, currentGuess, ...guesses]) => new Wordlettuce({ gameNum, guesses, currentGuess }),
  },
};

export const reroute: Reroute = ({ url }) => {
  return url.pathname;
};
