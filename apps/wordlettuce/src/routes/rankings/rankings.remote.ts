import { query } from '$app/server';
import * as apiWordlettuce from '$lib/api-wordlettuce.server';

export const getRankings = query(async () => {
  return apiWordlettuce.getRankings();
});
