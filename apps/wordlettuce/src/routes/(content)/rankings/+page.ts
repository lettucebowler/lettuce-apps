import { createApiWordlettuceClient } from '$lib/api-wordlettuce';

export async function load(event) {
  const { getRankings } = createApiWordlettuceClient(event);
  const rankings = await getRankings();

  return {
    rankings,
  };
}
