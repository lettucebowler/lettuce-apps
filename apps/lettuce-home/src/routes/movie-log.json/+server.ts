import { getMovieLogsDesc } from '$lib/collections';
import { json } from '@sveltejs/kit';

export async function GET() {
  const movieLogs = getMovieLogsDesc();
  return json({
    watched: movieLogs.flatMap((log) =>
      log.items.map((item) => {
        const { id, ...rest } = item;
        return rest;
      }),
    ),
  });
}
