import { query } from '$app/server';
import * as v from 'valibot';
import * as apiWordlettuce from '$lib/api-wordlettuce.server';
import { getGameNum } from '$lib/words';
import type { HTTPError } from 'ky';

export const getProfileData = query(
  v.object({
    profileUser: v.string(),
    start: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), getGameNum()),
  }),
  async ({ profileUser, start }) => {
    const gameNum = getGameNum();
    const { results, limit } = await apiWordlettuce
      .getGameResults({ username: profileUser, start: start, limit: 37 })
      .catch(() => ({ results: [], limit: 30 }));
    const currentResults = start === gameNum ? results.filter((result) => result.gameNum > getGameNum() - 7) : [];
    const pastResults = results.slice(currentResults.length).slice(0, 30);
    return {
      profileUser,
      profileUserID: results.at(0)?.userID!,
      currentResults,
      pastResults,
      next: pastResults.length ? pastResults.at(-1)!.gameNum - 1 : null,
      limit,
      start: start,
    };
  },
);

export const getGameResults = query(
  apiWordlettuce.GetGameResultsInput,
  async (input: apiWordlettuce.GetGameResultsInput) => {
    return apiWordlettuce.getGameResults(input);
  },
);
