import { browser } from '$app/environment';
import { createApiWordlettuceClient } from '$lib/api-wordlettuce';

function delay(ms: number): Promise<undefined> {
  return new Promise((res) => setTimeout(res, ms));
}

export async function load(event) {
  const { getRankings } = createApiWordlettuceClient(event);
  const rankings = getRankings();

  const result = await Promise.race([delay(150), rankings]);
  return {
    rankings: browser ? (result ?? rankings) : await rankings,
  };
}
