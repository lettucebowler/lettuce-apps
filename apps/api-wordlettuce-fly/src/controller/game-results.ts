import { Hono } from 'hono';
import * as v from 'valibot';
import { ApiWordlettuceHono } from '../util/env';
import { vValidator } from '@hono/valibot-validator';
import { Username, GameNumSchema, AnswerSchema, UserID, PositiveInteger } from '../util/schemas';
import { getGameNum } from '../util/game-num';
import { HTTPException } from 'hono/http-exception';
import { createLettuceAuthClient } from '../client/lettuce-auth';
import { requireToken } from '../middleware/requireToken';
import { createGameResultsTursoDao } from '../dao/game-results-turso';
import type { Client } from '@libsql/client';

const GetGameResultsQuerySchema = v.pipe(
  v.object({
    username: v.optional(Username, undefined),
    limit: v.pipe(
      v.optional(v.string(), '30'),
      v.digits(),
      v.transform((input) => Number(input)),
      PositiveInteger,
    ),
    start: v.pipe(
      v.optional(v.string(), () => getGameNum().toString()),
      v.transform((input) => Number(input)),
      v.integer(),
      v.minValue(0),
    ),
    userID: v.optional(v.pipe(v.string(), v.digits(), v.transform(Number)), undefined),
  }),
  v.check((input) => !!input.userID || !!input.username, 'Must provider username or userID'),
  v.check((input) => !(input.userID && input.username), 'Must provider either username or userID'),
);

const CreateGameResultJsonSchema = v.object({
  gameNum: GameNumSchema,
  userID: UserID,
  answers: AnswerSchema,
});

export function gameResultsController({ client }: { client: Client }) {
  const gameResultsController = new Hono<ApiWordlettuceHono>();

  gameResultsController.get('/', vValidator('query', GetGameResultsQuerySchema), async (c) => {
    const { username, limit, start, userID } = c.req.valid('query');
    const { getUserGameResults } = createGameResultsTursoDao({ client });

    let searchID: number;
    if (username) {
      const client = createLettuceAuthClient(c);
      const user = await client.getUser(username);
      searchID = user.id;
    } else if (userID) {
      searchID = userID;
    } else {
      throw new HTTPException(400, { message: 'Must provider either username or userID ' });
    }
    return getUserGameResults({ userID: searchID, limit, start }).then(({ results, next }) => {
      return c.json({
        results: results.slice(0, limit),
        next,
        limit,
        start,
      });
    });
  });

  gameResultsController.post('/', requireToken, vValidator('json', CreateGameResultJsonSchema), async (c) => {
    const { gameNum, userID, answers } = c.req.valid('json');
    const { saveGame } = createGameResultsTursoDao({ client });
    const inserts = await saveGame({ gameNum, userID, answers });
    if (!inserts.length) {
      return c.json(
        {
          success: false,
        },
        500,
      );
    }
    return c.json(inserts.at(0));
  });
  return gameResultsController;
}
