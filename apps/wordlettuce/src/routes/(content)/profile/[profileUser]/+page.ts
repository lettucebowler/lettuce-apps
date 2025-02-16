import { createApiWordlettuceClient } from '$lib/api-wordlettuce.js';

import { getGameNum } from '$lib/words.js';

export async function load(event) {
  const { profileUser } = event.params;
  const searchParams = event.url.searchParams;
  const gameNum = getGameNum();
  const startParam = Number(searchParams.get('start')) || gameNum;
  const { getNextPageAfter } = createApiWordlettuceClient(event);
  const { results, next, limit } = await getNextPageAfter({ username: profileUser, start: startParam });
  const currentResults = startParam === gameNum ? results.filter((result) => result.gameNum > getGameNum() - 7) : [];
  const pastResults = results.slice(currentResults.length);
  return {
    profileUser,
    profileUserID: results.at(0)?.userID!,
    currentResults,
    results: pastResults,
    next,
    limit,
    start: startParam,
  };
}
