import { WordlettuceGame } from '$lib/wordlettuce-game.svelte';
import type { Transport } from '@sveltejs/kit';

export const transport: Transport = {
  WordlettuceGame: {
    encode: (value: WordlettuceGame) => {
      if (!(value instanceof WordlettuceGame)) {
        return false;
      }
      console.log('value', value);
      console.log('encode');
      return [value.gameNum, value.currentGuess, ...value.guesses];
    },
    decode: ([gameNum, currentGuess, ...guesses]) => new WordlettuceGame({ gameNum, guesses, currentGuess }),
  },
};
