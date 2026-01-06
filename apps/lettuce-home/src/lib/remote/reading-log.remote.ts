import { prerender } from '$app/server';
import * as v from 'valibot';

import readingLogYaml from '$lib/assets/reading-log.yaml';
import { ReadingLog } from '$lib/schemas';

const readingLog = v.parse(ReadingLog, readingLogYaml);

export const getReadingLog = prerender(() => {
  const yearBooks = Object.groupBy(readingLog, (book) => {
    if (!book.completed) {
      return 'current';
    }
    return book.completed.substring(0, 4);
  });
  return new Map(Object.entries(yearBooks));
});

export const getLastReadBook = prerender(() => {
  const latest = readingLog.find((book) => book.completed)!;
  return latest;
});

export const getCurrentBooks = prerender(() => {
  const current = readingLog.filter((book) => !book.completed);
  return current;
});
