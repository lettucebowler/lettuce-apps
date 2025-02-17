import { Hono } from 'hono';
import type { ApiWordlettuceHono } from './util/env';
import { rankingsControllerV2 } from './controller/rankings';
import gameResultsController from './controller/game-results';
import { cors } from 'hono/cors';
import { lettuceAuth } from './middleware/lettuceAuth';

const app = new Hono<ApiWordlettuceHono>();

app.use(
  cors({
    origin: (origin, c) => {
      if (origin.includes('http://localhost:')) {
        return origin;
      }
      return origin.endsWith('.lettucebowler.net') ? origin : 'https://lettucebowler.net';
    },
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
);
app.use(lettuceAuth());
app.route('/v2/rankings', rankingsControllerV2);
app.route('/v1/game-results', gameResultsController);

export default app;
