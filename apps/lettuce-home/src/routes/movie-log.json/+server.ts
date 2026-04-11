import { getMovieLogsDesc } from '$lib/collections';
import { json } from '@sveltejs/kit';

export async function GET() {
  const movieLogs = getMovieLogsDesc();
  return json({
    watched: movieLogs.flatMap((log) => log.movies),
  });
}
