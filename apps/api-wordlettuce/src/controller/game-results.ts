import { Hono } from 'hono';
import * as v from 'valibot';
import { ApiWordlettuceBindings } from '../util/env';
import { vValidator } from '@hono/valibot-validator';
import { Username, GameNumSchema, AnswerSchema, UserID, PositiveInteger } from '../util/schemas';
import { createGameResultsDao } from '../dao/game-results';
import { getGameNum } from '../util/game-num';
import { requireToken } from '../middleware/requireToken';
import { HTTPException } from 'hono/http-exception';

const gameResultsController = new Hono<{ Bindings: ApiWordlettuceBindings }>();

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
);

gameResultsController.get('/', vValidator('query', GetGameResultsQuerySchema), async (c) => {
  const { username, limit, start, userID } = c.req.valid('query');
  const { getNextPageAfter, getUserGameResults } = createGameResultsDao(c);

  if (userID) {
    return getUserGameResults({ userID, limit, start }).then(({ results, next }) => {
      return c.json({
        results: results.slice(0, limit),
        next,
        limit,
        start,
      });
    });
  } else if (username) {
    return getNextPageAfter({ username, limit, start }).then(({ results, next }) => {
      return c.json({
        results: results.slice(0, limit),
        next,
        limit,
        start,
      });
    });
  }
  throw new HTTPException(400, { message: 'Must provider username or userID' });
});

const CreateGameResultJsonSchema = v.object({
  gameNum: GameNumSchema,
  userID: UserID,
  answers: AnswerSchema,
});

gameResultsController.post('/', requireToken, vValidator('json', CreateGameResultJsonSchema), async (c) => {
  const { gameNum, userID, answers } = c.req.valid('json');
  const { saveGame } = createGameResultsDao(c);
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
export default gameResultsController;
