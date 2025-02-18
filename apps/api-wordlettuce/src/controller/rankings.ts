import { Hono } from 'hono';
import * as v from 'valibot';
import { ApiWordlettuceHono } from '../util/env';
import { GameNumSchema } from '../util/schemas';
import { getGameNum } from '../util/game-num';
import { vValidator } from '@hono/valibot-validator';
import { createGameResultsDao } from '../dao/game-results';
import { createLettuceAuthClient } from '../client/lettuce-auth';
import { createGameResultsTursoDao } from '../dao/game-results-turso';

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
  vValidator('query', GetRankingsQuerySchema),
  // cache({ cacheName: 'wordlettuce-rankings', cacheControl: 'max-age=60' }),
  async (c) => {
    // const { getRankings } = createGameResultsDao(c);
    const { getRankings } = createGameResultsTursoDao({
      url: c.env.TURSO_CONNECTION_URL,
      authToken: c.env.TURSO_AUTH_TOKEN,
    });
    const results = await getRankings();
    const { getUsers } = createLettuceAuthClient(c);
    const userIDs = results.map((result) => result.userID);
    const users = await getUsers({ userIDs });
    const group = Object.groupBy(users.users, (r) => {
      return r.id;
    });

    return c.json({
      rankings: results.map((result) => ({ ...result, user: group[result.userID]?.at(0)?.displayName })),
    });
  },
);

export { rankingsControllerV2 };
