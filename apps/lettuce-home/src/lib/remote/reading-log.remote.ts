import { prerender } from '$app/server';
import * as v from 'valibot';

import readingLogYaml from '$lib/assets/reading-log.yaml';
import { ReadingLog } from '$lib/schemas';

const readingLog = v.parse(ReadingLog, readingLogYaml);

export const getReadingLog = prerender(() => readingLog);

export const getLatestBook = prerender(() => {
  const [latestYear] = Object.keys(readingLog).toSorted().reverse();
  return readingLog[latestYear][0];
});
