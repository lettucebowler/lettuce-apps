import { json } from '@sveltejs/kit';
import { getCurrentlyReading, getReadingLogsDesc } from '$lib/collections';

export async function GET() {
  const current = getCurrentlyReading();
  const completed = getReadingLogsDesc().flatMap((log) => log.items);
  return json({
    current,
    completed
  });
}

export const prerender = true;
