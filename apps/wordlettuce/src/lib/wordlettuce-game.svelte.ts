import { successAnswer } from '$lib/app-constants';
import { isAllowedGuess, getGameWord, getGameNum } from '$lib/words';
import { GuessLetter } from '$lib/game-schemas';
import * as v from 'valibot';

export type WordlettuceGameInit = {
  gameNum?: number;
  currentGuess?: string;
  guesses?: Array<string>;
};

export const WordlettuceGameStateFromString = v.pipe(
  v.pipe(
    v.string(),
    v.base64(),
    v.transform((value) => {
      const decoded = atob(value);
      const [gameNum, guesses, currentGuess] = decoded.split(';');
      return {
        gameNum,
        guesses,
        currentGuess,
      };
    }),
    v.object({
      gameNum: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
      guesses: v.pipe(
        v.string(),
        v.transform((value) => value.split(',')),
        v.array(
          v.pipe(
            v.string(),
            v.check((value) => !value || isAllowedGuess({ guess: value })),
          ),
        ),
        v.transform((v) => v.filter(Boolean)),
      ),
      currentGuess: v.pipe(v.string(), v.maxLength(5)),
    }),
  ),
);

export type WordlettuceGameState = v.InferOutput<typeof WordlettuceGameStateFromString>;

export class WordlettuceGame {
  #gameNum: number = $state(1);
  #guesses: Array<string> = $state([]);
  #currentGuess: string = $state('');
  #answers: Array<string> = $state([]);
  #invalid: boolean = $state(false);

  constructor({ gameNum = getGameNum(), guesses = [], currentGuess = '' }: WordlettuceGameInit = {}) {
    this.#currentGuess = currentGuess;
    this.#gameNum = gameNum;
    this.#guesses = guesses;
    this.#answers = checkWords({ answer: getGameWord(gameNum), guesses });
  }

  static decode(state: string) {
    const gameState = v.parse(WordlettuceGameStateFromString, state);
    return new WordlettuceGame(gameState);
  }

  static encode(state: WordlettuceGameState) {
    const stateString = `${state.gameNum};${state.guesses.join(',')};${state.currentGuess}`;
    return btoa(stateString);
  }

  doLetter(letter: GuessLetter) {
    if (this.success || this.#currentGuess.length >= 5) {
      return;
    }
    this.#currentGuess += letter;
  }

  doUndo() {
    if (!this.#currentGuess.length) {
      return;
    }
    this.#currentGuess = this.#currentGuess.slice(0, -1);
  }

  doWord(word: string): WordlettuceGameSubmitResult {
    if (this.success) {
      return {
        success: true,
        invalid: false,
      };
    }
    this.#currentGuess = word;
    const invalid = !isAllowedGuess({ guess: this.#currentGuess });
    if (invalid) {
      return {
        invalid: true,
        success: false,
      };
    }
    this.#invalid = invalid;
    this.#guesses.push(this.#currentGuess);
    this.#currentGuess = '';
    this.#answers = checkWords({ guesses: this.#guesses, answer: getGameWord(this.gameNum) });
    const success = this.#answers.at(-1) === successAnswer;
    return {
      invalid: false,
      success,
    };
  }

  get gameNum() {
    return this.#gameNum;
  }

  get currentGuess() {
    return this.#currentGuess;
  }

  get guesses() {
    return this.#guesses;
  }

  get answers() {
    return this.#answers;
  }

  get success() {
    return this.#answers.at(-1) === successAnswer;
  }

  get invalid() {
    return this.#invalid;
  }

  get letterStatuses() {
    if (!this.#guesses.length) {
      return {};
    }
    const letters = Array.from(
      new Set(
        this.#guesses
          .map((w, i) =>
            w.split('').map((l, j) => ({
              letter: l,
              status: this.answers[i]?.[j] || '_',
            })),
          )
          .flat(),
      ),
    );
    const correctList = letters.filter((letter) => letter.status === 'x').map((l) => ({ [l.letter]: l.status }));
    const correct: { [x: string]: string } = Object.assign({}, ...correctList);
    const containsList = letters.filter((letter) => letter.status === 'c').map((l) => ({ [l.letter]: l.status }));
    const contains: { [x: string]: string } = Object.assign({}, ...containsList);
    const incorrectList = letters.filter((letter) => letter.status === 'i').map((l) => ({ [l.letter]: l.status }));
    const incorrect: { [x: string]: string } = Object.assign({}, ...incorrectList);
    return { ...incorrect, ...contains, ...correct };
  }

  get gameState(): WordlettuceGameState {
    return {
      gameNum: this.#gameNum,
      guesses: $state.snapshot(this.#guesses),
      currentGuess: this.#currentGuess,
    };
  }

  get encoded() {
    return WordlettuceGame.encode(this.gameState);
  }
}

function getLetterLocations(s: string, l: string) {
  return s
    .split('')
    .map((l: string, i: number) => ({ letter: l, index: i }))
    .filter((slot) => slot.letter === l)
    .map((slot) => slot.index);
}

function containsLetter({ index, guess, answer }: { index: number; guess: string; answer: string }) {
  const letter = guess.charAt(index);
  const guessLocations = getLetterLocations(guess, letter);
  const answerLocations = getLetterLocations(answer, letter);
  const correctCount = guessLocations.filter((location) => answerLocations.includes(location)).length;
  const previousContainsCount = getLetterLocations(guess.slice(0, index), letter).filter(
    (index) => !answerLocations.includes(index),
  ).length;
  return correctCount + previousContainsCount < answerLocations.length;
}

function checkWords({ answer, guesses }: { answer: string; guesses: string[] }) {
  const answers = guesses.map((guess: string) => {
    return checkWord({ guess, answer });
  });
  return answers;
}

function checkWord({ guess, answer }: { guess: string; answer: string }) {
  if (!guess.length) {
    return '_____';
  }
  const contains = guess.split('').map((_, i) => (containsLetter({ index: i, guess, answer }) ? 'c' : 'i'));
  const correct = guess.split('').map((char, i) => (answer[i] === char ? 'x' : ''));

  const statuses = correct.map((status, i) => (status ? status : contains[i]));
  return statuses.join('');
}

type WordlettuceGameSubmitResult =
  | {
      success: true;
      invalid: false;
    }
  | {
      success: false;
      invalid: false;
    }
  | {
      success: false;
      invalid: true;
    };
