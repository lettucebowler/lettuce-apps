import { Hono } from 'hono';
import type { ApiWordlettuceHono } from './util/env';
import { rankingsController } from './controller/rankings';
import { gameResultsController } from './controller/game-results';
import { cors } from 'hono/cors';
import { createClient } from '@libsql/client';
// import { lettuceAuth } from './middleware/lettuceAuth';

const dbClient = createClient({
  syncUrl: process.env.TURSO_CONNECTION_URL!,
  url: process.env.DEV_MODE ? 'file:.replica.db' : 'file:/app/data/local.db',
  authToken: process.env.TURSO_AUTH_TOKEN!,
  syncInterval: 60,
});

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
app.route('/v2/rankings', rankingsController({ client: dbClient }));
app.route('/v1/game-results', gameResultsController({ client: dbClient }));

export default app;
