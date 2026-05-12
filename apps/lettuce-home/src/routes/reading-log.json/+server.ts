import { json } from '@sveltejs/kit';
import { getCurrentlyReading, getReadingLogsDesc } from '$lib/collections';

export async function GET() {
  const current = getCurrentlyReading();
  const completed = getReadingLogsDesc();
  return json({ current, completed });
}
