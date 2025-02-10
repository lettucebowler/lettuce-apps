import { createApiWordlettuceClient } from '$lib/api-wordlettuce.server.js';

export async function load(event) {
  const api = createApiWordlettuceClient(event);
  const rankings = api.getRankings();

  return {
    rankings: event.isDataRequest ? rankings : await rankings,
  };
}
