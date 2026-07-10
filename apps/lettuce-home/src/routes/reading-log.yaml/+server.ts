import * as yaml from 'js-yaml';
import { getCurrentlyReading, getReadingLogsDesc } from '$lib/collections';

export const prerender = true;

export async function GET() {
  const current = getCurrentlyReading();
  const completed = getReadingLogsDesc().flatMap((year) => year.books);
  const yamlString = yaml.dump({ current, completed });
  return new Response(yamlString, {
    headers: { 'Content-Type': 'application/yaml', 'Content-Disposition': 'inline' },
  });
}
