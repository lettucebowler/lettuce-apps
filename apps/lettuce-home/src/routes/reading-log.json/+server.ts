import { getCurrentlyReading, getReadingLogsDesc } from '#lib/collections.js';

export async function GET() {
  const currentlyReading = getCurrentlyReading();
  const completed = getReadingLogsDesc().flatMap((log) => log.books);
  return Response.json({
    currentlyReading,
    completed,
  });
}
