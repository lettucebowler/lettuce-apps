import { getMovieLogsDesc } from '$lib/collections';
import { json } from '@sveltejs/kit';
export const prerender = true;

export async function GET() {
  const watched = getMovieLogsDesc().flatMap((year) => year.movies);
  return json({ watched });
}
