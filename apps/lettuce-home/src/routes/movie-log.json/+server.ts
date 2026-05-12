import { getMovieLogsDesc } from '$lib/collections';
import { json } from '@sveltejs/kit';

export async function GET() {
  const watched = getMovieLogsDesc();
  return json({ watched });
}
