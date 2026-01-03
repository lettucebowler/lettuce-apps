import { prerender } from '$app/server';
import * as v from 'valibot';

import { MovieLog } from '$lib/schemas';

import movieLogYaml from '$lib/assets/movie-log.yaml';

const movieLog = v.parse(MovieLog, movieLogYaml);

export const getMovieLog = prerender(() => MovieLog);

export const getLatestMovie = prerender(() => {
  const [latestYear] = Object.keys(movieLog).toSorted().reverse();
  return movieLog[latestYear][0];
});
