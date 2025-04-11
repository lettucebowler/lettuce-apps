import { browser } from '$app/environment';
import { createApiWordlettuceClient } from '$lib/api-wordlettuce';
import { error } from '@sveltejs/kit';

function delay(ms: number): Promise<undefined> {
  return new Promise((res) => setTimeout(res, ms));
}

export async function load(event) {
  const { getRankings } = createApiWordlettuceClient(event);

  try {
    // const result = await Promise.race([delay(150), rankings]);
    // return {
    //   rankings: browser ? (result ?? rankings) : await rankings,
    // };
    const rankings = await getRankings();

    return {
      rankings,
    };
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      throw error(500, e?.message);
    }
    throw e;
  }
}
