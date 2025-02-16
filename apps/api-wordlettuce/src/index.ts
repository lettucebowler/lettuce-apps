import { Hono } from 'hono';
import type { ApiWordlettuceBindings } from './util/env';
import { rankingsControllerV2 } from './controller/rankings';
import gameResultsController from './controller/game-results';
import { cors } from 'hono/cors';

const app = new Hono<{ Bindings: ApiWordlettuceBindings }>();

app.use(
  cors({
    origin: (origin, c) => {
      console.log(c.env);
      if (c.env.ALLOW_LOCALHOST === 'true' && origin.includes('http://localhost:')) {
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
app.route('/v2/rankings', rankingsControllerV2);
app.route('/v1/game-results', gameResultsController);

export default app;
