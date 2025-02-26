import { Hono } from 'hono';
import * as v from 'valibot';
import { ApiWordlettuceHono } from '../util/env';
import { GameNumSchema } from '../util/schemas';
import { getGameNum } from '../util/game-num';
import { sValidator } from '@hono/standard-validator';
import { createGameResultsDao } from '../dao/game-results';
import { createLettuceAuthClient } from '../client/lettuce-auth';

const rankingsControllerV2 = new Hono<ApiWordlettuceHono>();

const GetRankingsQuerySchema = v.object({
  gameNum: v.pipe(
    v.optional(v.string(), () => getGameNum().toString()),
    v.transform((input) => Number(input)),
    GameNumSchema,
  ),
});

rankingsControllerV2.get(
  '/',
  sValidator('query', GetRankingsQuerySchema),
  // cache({ cacheName: 'wordlettuce-rankings', cacheControl: 'max-age=60' }),
  async (c) => {
    const { getRankings } = createGameResultsDao(c);
    const results = await getRankings();
    const { getUsers } = createLettuceAuthClient(c);
    const userIDs = results.map((result) => result.userID);
    const users = await getUsers({ userIDs });
    const group = Object.groupBy(users.users, (r) => {
      return r.id;
    });

    console.log(JSON.stringify(users.users));

    return c.json({
      rankings: results.map((result) => ({ ...result, user: group[result.userID]?.at(0)?.username })),
    });
  },
);

export { rankingsControllerV2 };
