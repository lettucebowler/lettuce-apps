import * as yaml from 'js-yaml';
import { getMovieLogsDesc } from '$lib/collections';

export const prerender = true;

export async function GET() {
  const watched = getMovieLogsDesc().flatMap((year) => year.movies);
  const yamlString = yaml.dump({ watched });
  return new Response(yamlString, {
    headers: { 'Content-Type': 'application/yaml', 'Content-Disposition': 'inline' },
  });
}
