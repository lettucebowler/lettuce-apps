import { json } from '@sveltejs/kit';
import { getMovieLogsDesc } from '$lib/collections';

export async function GET() {
  const watched = getMovieLogsDesc().flatMap((log) => log.movies);
  return json({
    watched
  });
}

export const prerender = true;
