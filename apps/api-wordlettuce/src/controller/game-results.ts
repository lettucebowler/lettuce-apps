import { Hono } from 'hono';
import * as v from 'valibot';
import { ApiWordlettuceHono } from '../util/env';
import { sValidator } from '@hono/standard-validator';
import { Username, GameNumSchema, AnswerSchema, UserID, PositiveInteger } from '../util/schemas';
import { createGameResultsDao } from '../dao/game-results';
import { getGameNum } from '../util/game-num';
import { HTTPException } from 'hono/http-exception';
import { createLettuceAuthClient } from '../client/lettuce-auth';
import { requireToken } from '../middleware/requireToken';
import { cache } from '../middleware/cache';
import { ContentfulStatusCode } from 'hono/utils/http-status';

const gameResultsController = new Hono<ApiWordlettuceHono>();

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

gameResultsController.get(
  '/',
  sValidator('query', GetGameResultsQuerySchema),
  async (c, next) => {
    const { username, start } = c.req.valid('query');
    const gameNum = getGameNum();
    const gameNumMatch = start === gameNum;
    return cache({
      cacheName: 'wordlettuce-game-results',
      cacheControl: `max-age=${60 * 60 * 24}`,
      async shouldICacheThisResponse(res) {
        if (username) {
          return false;
        }
        if (!start) {
          return false;
        }
        const json = await res.json<{ results: Array<{ gameNum: number }> }>();
        if (!json?.results) {
          return false;
        }
        if (!json.results.length) {
          return false;
        }
        if (gameNumMatch) {
          const should = json.results.at(0)?.gameNum === gameNum;
          return should;
        }
        return true;
      },
    })(c, next);
  },
  async (c) => {
    const { username, limit, start, userID } = c.req.valid('query');
    const { getUserGameResults } = createGameResultsDao(c);

    let searchID: number;
    if (username) {
      const client = createLettuceAuthClient(c);
      const { user, error } = await client.getUser(username);
      if (error) {
        if (error.status === 404) {
          throw new HTTPException(404, { message: `User ${username} not found` });
        }
        throw new HTTPException(
          (error?.status as ContentfulStatusCode) ?? 500,
          error?.message ? { message: error.message } : undefined,
        );
      }
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
  },
);

const CreateGameResultJsonSchema = v.object({
  gameNum: GameNumSchema,
  userID: UserID,
  answers: AnswerSchema,
});

gameResultsController.post('/', requireToken, sValidator('json', CreateGameResultJsonSchema), async (c) => {
  const { gameNum, userID, answers } = c.req.valid('json');
  const dao = createGameResultsDao(c);
  const inserts = await dao.saveGame({ gameNum, userID, answers });
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
export default gameResultsController;
