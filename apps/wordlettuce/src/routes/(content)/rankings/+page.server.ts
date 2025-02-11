import { createApiWordlettuceClient } from '$lib/api-wordlettuce';

export async function load(event) {
  const { getRankings } = createApiWordlettuceClient(event);
  const rankings = getRankings();

  event.setHeaders({ 'Cache-Control': 'max-age=60' });

  return {
    rankings: event.isDataRequest ? rankings : await rankings,
  };
}
