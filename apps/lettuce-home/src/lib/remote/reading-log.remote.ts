import { prerender } from '$app/server';
import * as v from 'valibot';

import readingLogYaml from '$lib/assets/reading-log.yaml';
import { ReadingLog } from '$lib/schemas';

const readingLog = v.parse(ReadingLog, readingLogYaml);

export const getReadingLog = prerender(() => {
  const yearBooks = Object.groupBy(
    readingLog.filter((book) => book.completed),
    (book) => {
      return book.completed!.substring(0, 4);
    }
  );
  return Object.entries(yearBooks)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map((year) => {
      return {
        title: year[0],
        items: year[1]!
      };
    });
});

export const getLastReadBook = prerender(() => {
  const latest = readingLog.find((book) => book.completed)!;
  return latest;
});

export const getCurrentBooks = prerender(() => {
  const current = readingLog.filter((book) => !book.completed);
  return current;
});
