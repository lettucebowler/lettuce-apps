import { Hono } from 'hono';
import * as v from 'valibot';
import { ApiWordlettuceHono } from '../util/env';
import { GameNumSchema } from '../util/schemas';
import { getGameNum } from '../util/game-num';
import { vValidator } from '@hono/valibot-validator';
import { createLettuceAuthClient } from '../client/lettuce-auth';
import { createGameResultsTursoDao } from '../dao/game-results-turso';
import { Client } from '@libsql/client';

export function rankingsController({ client }: { client: Client }) {
  const rankingsController = new Hono<ApiWordlettuceHono>();

  const GetRankingsQuerySchema = v.object({
    gameNum: v.pipe(
      v.optional(v.string(), () => getGameNum().toString()),
      v.transform((input) => Number(input)),
      GameNumSchema,
    ),
  });

  rankingsController.get('/', vValidator('query', GetRankingsQuerySchema), async (c) => {
    const { getRankings } = createGameResultsTursoDao({ client });
    const results = await getRankings();
    const { getUsers } = createLettuceAuthClient(c);
    const userIDs = results.map((result) => result.userID);
    const users = await getUsers({ userIDs });
    const group = Object.groupBy(users.users, (r) => {
      return r.id;
    });

    return c.json({
      rankings: results.map((result) => ({ ...result, user: group[result.userID]?.at(0)?.username })),
    });
  });
  return rankingsController;
}
