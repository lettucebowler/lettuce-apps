import * as v from 'valibot';
import { GuessLetter, AllowedGuess } from '$lib/Wordlettuce/schemas';

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
