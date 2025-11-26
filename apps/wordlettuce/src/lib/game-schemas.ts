import * as v from 'valibot';

export const GameHotKey = v.picklist(['enter', 'backspace']);

export type GameHotKey = v.InferOutput<typeof GameHotKey>;

export const GuessLetter = v.picklist([
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
]);

export type GuessLetter = v.InferOutput<typeof GuessLetter>;

export const GameKey = v.union([GuessLetter]);

export type GuessKey = v.InferOutput<typeof GameKey>;

export const LETTER_STATUS_EXACT = 'x';
export const LETTER_STATUS_CONTAINS = 'c';
export const LETTER_STATUS_INCORRECT = 'i';
export const LETTER_STATUS_NONE = 'n';

const LETTER_STATUSES = [
  LETTER_STATUS_EXACT,
  LETTER_STATUS_CONTAINS,
  LETTER_STATUS_INCORRECT,
  LETTER_STATUS_NONE,
] as const;

export const LetterStatus = v.picklist(LETTER_STATUSES);

export type LetterStatus = v.InferOutput<typeof LetterStatus>;
