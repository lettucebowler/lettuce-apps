import { getCurrentlyReading, getReadingLogsDesc } from '$lib/collections';
import { json } from '@sveltejs/kit';

export async function GET() {
  const currentlyReading = getCurrentlyReading();
  const readingLogs = getReadingLogsDesc();
  return json({
    currentlyReading: currentlyReading.map((item) => {
      const { id, ...rest } = item;
      return rest;
    }),
    completed: readingLogs.flatMap((log) =>
      log.items.map((item) => {
        const { id, ...rest } = item;
        return rest;
      }),
    ),
  });
}
