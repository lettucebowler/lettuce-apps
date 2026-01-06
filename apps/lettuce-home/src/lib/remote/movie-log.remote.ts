import { prerender } from '$app/server';
import * as v from 'valibot';

import { MovieLog } from '$lib/schemas';

import movieLogYaml from '$lib/assets/movie-log.yaml';

const movieLog = v.parse(MovieLog, movieLogYaml);

export const getMovieLog = prerender(() => {
  const yearBooks = Object.groupBy(movieLog, (movie) => {
    return movie.watched.substring(0, 4);
  });
  return new Map(Object.entries(yearBooks));
});

export const getLatestMovie = prerender(() => {
  const latest = movieLog.find((movie) => movie.watched)!;
  return latest;
});
