import { createApiWordlettuceClient } from '$lib/api-wordlettuce.js';

import { getGameNum } from '$lib/words.js';

export async function load(event) {
  const { profileUser } = event.params;
  const searchParams = event.url.searchParams;
  const gameNum = getGameNum();
  const startParam = Number(searchParams.get('start')) || gameNum;
  const { getNextPageAfter } = createApiWordlettuceClient(event);
  const { results, next, limit } = await getNextPageAfter({ username: profileUser, start: startParam });
  return {
    profileUser,
    results,
    next,
    limit,
    start: startParam,
  };
}
