import * as v from 'valibot';
import { isAllowedGuess } from '$lib/words';
import { GuessLetter } from '$lib/game-schemas';

export const AllowedGuess = v.pipe(
  v.string(),
  v.check((s) => isAllowedGuess({ guess: s }), `Invalid word`),
);

export const ActionFormInput = v.union([
  v.object({
    letter: GuessLetter,
    undo: v.optional(v.string()),
    word: v.optional(v.string()),
  }),
  v.object({
    letter: v.optional(GuessLetter),
    undo: v.string(),
    word: v.optional(v.string()),
  }),
  v.object({
    letter: v.optional(GuessLetter),
    undo: v.optional(v.string()),
    word: AllowedGuess,
  }),
]);
