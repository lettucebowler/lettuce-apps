import { LETTER_STATUS_CONTAINS, LETTER_STATUS_EXACT, LETTER_STATUS_INCORRECT } from './schemas';
import { answerList, allowedGuesses } from './words';
import { appName } from '$lib/app-constants';

const msInADay = 1000 * 60 * 60 * 24;
const initial = new Date(1643673600000);
export function getGameNum() {
  const now = new Date();
  return Math.floor((now.getTime() - initial.getTime()) / msInADay);
}

function mulberry(a: number) {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function getGameWord(gameNum: number) {
  const wordIndex = mulberry(gameNum) * answerList.length;
  return answerList.at(wordIndex) ?? 'slate';
}

export function isAllowedGuess({ guess }: { guess: string }) {
  const allowed = answerList.includes(guess) || allowedGuesses.includes(guess);
  return allowed;
}

export function getGameStatus({ gameNum, answers }: { answers: string[]; gameNum: number }) {
  const today = `${appName} ${gameNum} ${answers.length}/6`;
  const strings = answers.map((k) => {
    return k
      .split('')
      .map((w) => {
        return getStatusEmoji(w);
      })
      .join('');
  });
  return [today, ...strings].join('\n');
}

function getStatusEmoji(status: string) {
  switch (status) {
    case LETTER_STATUS_EXACT:
      return '🟩';
    case LETTER_STATUS_CONTAINS:
      return '🟨';
    case LETTER_STATUS_INCORRECT:
    default:
      return '⬛';
  }
}
