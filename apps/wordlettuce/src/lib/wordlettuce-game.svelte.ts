import { successAnswer } from '$lib/app-constants';
import { isAllowedGuess, getGameWord, getGameNum } from '$lib/words';
import { GuessLetter } from '$lib/game-schemas';

type WordlettuceGameConstructorArgs = {
  gameNum: number;
  currentGuess?: string;
  guesses?: Array<string>;
};

export class WordlettuceGame {
  #gameNum: number = $state(1);
  #guesses: Array<string> = $state([]);
  #currentGuess: string = $state('');
  // #answers: Array<string> = $state([]);
  // #invalid: boolean = $state(false);

  constructor({ gameNum, guesses = [], currentGuess = '' }: WordlettuceGameConstructorArgs) {
    this.replaceState({ gameNum, guesses, currentGuess });
  }

  replaceState = ({ gameNum, guesses = [], currentGuess = '' }: WordlettuceGameConstructorArgs) => {
    this.#gameNum = gameNum;
    this.#currentGuess = currentGuess;
    this.#guesses = guesses;
  };

  static fromStateString = ({ state, currentGameNum = getGameNum() }: { state: string; currentGameNum?: number }) => {
    if (!state) {
      return new WordlettuceGame({ gameNum: currentGameNum });
    }
    const decoded = atob(state);
    const [gameNum, guesses, currentGuess] = decoded.split(';');
    if (!gameNum || Number(gameNum) !== currentGameNum) {
      return new WordlettuceGame({ gameNum: currentGameNum });
    }
    return new WordlettuceGame({
      gameNum: currentGameNum,
      guesses: guesses.length ? guesses.split(',') : [],
      currentGuess,
    });
  };

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
    return checkWords({ gameNum: this.#gameNum, guesses: this.#guesses });
  }

  get success() {
    return this.answers.at(-1) === successAnswer;
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

  toStateString = () => {
    const state = `${this.#gameNum};${this.#guesses.join(',')};${this.#currentGuess}`;
    return btoa(state);
  };

  doLetter = (letter: GuessLetter) => {
    if (this.success || this.#currentGuess.length >= 5) {
      return {};
    }
    this.#currentGuess += letter;
    return {};
  };

  doUndo = () => {
    if (!this.#currentGuess.length) {
      return;
    }
    this.#currentGuess = this.#currentGuess.slice(0, -1);
  };

  doSumbit = () => {
    if (this.success) {
      return {
        success: true,
        invalid: false,
      };
    }
    const invalid = !isAllowedGuess({ guess: this.#currentGuess });
    if (invalid) {
      return {
        success: false,
        invalid: true,
      };
    }

    this.#guesses.push(this.#currentGuess);
    this.#currentGuess = '';
    return {
      success: true,
      invalid: false,
    };
  };
}

function checkWords({ gameNum, guesses }: { gameNum: number; guesses: string[] }) {
  const answer = getGameWord(gameNum);
  const answers = guesses.map((guess: string) => {
    return checkWord({ guess, answer });
  });
  return answers;
}

const getLetterLocations = (s: string, l: string) => {
  return s
    .split('')
    .map((l: string, i: number) => ({ letter: l, index: i }))
    .filter((slot) => slot.letter === l)
    .map((slot) => slot.index);
};

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

function checkWord({ guess, answer }: { guess: string; answer: string }) {
  if (!guess.length) {
    return '_____';
  }
  const contains = guess.split('').map((_, i) => (containsLetter({ index: i, guess, answer }) ? 'c' : 'i'));
  const correct = guess.split('').map((char, i) => (answer[i] === char ? 'x' : ''));

  const statuses = correct.map((status, i) => (status ? status : contains[i]));
  return statuses.join('');
}
