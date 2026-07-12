import { CalendarDate, startOfMonth, today } from '@internationalized/date';

export function getUniqueItems<T extends any>(items: T[], keyFunction: (item: T) => any) {
  let uniqueItems: T[] = [];
  items.toReversed().forEach((item) => {
    const key = keyFunction(item);
    if (!uniqueItems.find((u) => keyFunction(u) === key)) {
      uniqueItems.push(item);
    }
  });
  return uniqueItems.toReversed();
}

export function getUniqueCount<T extends any>(items: T[], keyFunction: (item: T) => any): number {
  return [...new Set(items.map(keyFunction))].length;
}

export function getFirstDayOfTheMonth(): CalendarDate {
  let lettuceToday = today('America/Chicago');
  return startOfMonth(lettuceToday);
}
