import { getMovieLogsDesc } from '#lib/collections.js';

export async function GET() {
  const movies = getMovieLogsDesc().flatMap((log) => log.movies);
  return Response.json({
    movies,
  });
}
