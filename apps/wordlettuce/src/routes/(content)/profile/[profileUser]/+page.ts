import { createApiWordlettuceClient } from '$lib/api-wordlettuce.js';

import { getGameNum } from '$lib/words.js';

export async function load(event) {
  const { profileUser } = event.params;
  const searchParams = event.url.searchParams;
  const gameNum = getGameNum();
  const startParam = Number(searchParams.get('start')) || gameNum;
  const { getNextPageAfter } = createApiWordlettuceClient(event);
  const { results, limit } = await getNextPageAfter({ username: profileUser, start: startParam, limit: 37 });
  const currentResults = startParam === gameNum ? results.filter((result) => result.gameNum > getGameNum() - 7) : [];
  const pastResults = results.slice(currentResults.length).slice(0, 30);
  return {
    profileUser,
    profileUserID: results.at(0)?.userID!,
    currentResults,
    results: pastResults,
    next: pastResults.at(-1)!.gameNum - 1,
    limit,
    start: startParam,
  };
}
