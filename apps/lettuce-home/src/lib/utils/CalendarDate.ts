import { endOfMonth, startOfMonth, today } from '@internationalized/date';

export function getFirstDayOfTheMonth() {
  let lettuceToday = today('America/Chicago');
  return startOfMonth(lettuceToday);
}

export function getLastDayOfTheMonth() {
  let lettuceToday = today('America/Chicago');
  return endOfMonth(lettuceToday);
}
