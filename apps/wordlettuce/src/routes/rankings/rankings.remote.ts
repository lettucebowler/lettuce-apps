import { query } from '$app/server';
import * as v from 'valibot';

import * as apiWordlettuce from '$lib/api-wordlettuce.server';

export const getRankings = query(v.object({}), async () => {
  return apiWordlettuce.getRankings();
});
