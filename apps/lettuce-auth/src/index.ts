import { issuer } from '@openauthjs/openauth';
import { Account, subjects } from '@lettuce-apps-packages/auth';

import { GithubProvider } from '@openauthjs/openauth/provider/github';
import { CloudflareStorage } from '@openauthjs/openauth/storage/cloudflare';

import type { LettuceAuthBindings, ProviderUser } from './types';

import { fetcher } from 'itty-fetcher';
import { Hono } from 'hono';
import { cache } from 'hono/cache';
import { createLettuceAuthDao } from './dao';
import { sValidator } from '@hono/standard-validator';
import * as v from 'valibot';

const github = fetcher({
  base: 'https://api.github.com',
  headers: {
    'user-agent': 'lettuce-auth',
  },
});

export default {
  fetch(request: Request, env: LettuceAuthBindings, ctx: ExecutionContext) {
    const app = new Hono<{ Bindings: LettuceAuthBindings }>();
    app.use(
      '/.well-known/jwks.json',
      // cache({
      //   cacheName: 'lettuce-auth-jwks',
      //   cacheControl: 'max-age=604800',
      // }),
      async (c, next) => {
        const cachedJwks = await c.env.lettuce_auth_sessions.get('jwks-cache', 'json');
        console.log('cached jwks', cachedJwks);
        if (cachedJwks) {
          console.log('jwks cached in kv');
          return c.json(cachedJwks);
        }
        await next();
        const json = await c.res.clone().json();
        if (json) {
          console.log('caching jwks in kv');
          c.executionCtx.waitUntil(
            c.env.lettuce_auth_sessions.put('jwks-cache', JSON.stringify(json), { expirationTtl: 60 * 60 * 24 * 7 }),
          );
        }
      },
    );
    app.use(
      '/.well-known/oauth-authorization-server',

      cache({
        cacheName: 'lettuce-auth-oauth-authorization-server',
        cacheControl: 'max-age=604800',
      }),
    );
    app.get(
      '/users/:user',
      cache({ cacheName: 'lettuce-auth-users', cacheControl: 'public max-age=60' }),
      sValidator(
        'param',
        v.object({
          user: v.union([v.pipe(v.string(), v.digits(), v.transform(Number)), v.string()]),
        }),
      ),
      async (c) => {
        const dao = createLettuceAuthDao(c.env.lettuce_auth_db);
        const { user: userParam } = c.req.valid('param');
        const user =
          typeof userParam === 'string'
            ? await dao.getUser({ username: userParam })
            : await dao.getUser({ userID: userParam });
        if (!user) {
          return c.json({ message: 'Not found' }, 404);
        }
        const { id, username } = user;
        return c.json({ id, username });
      },
    );
    const UsersQuery = v.object({
      userID: v.optional(
        v.union([
          v.array(v.pipe(v.string(), v.digits(), v.transform(Number))),
          v.pipe(
            v.string(),
            v.digits(),
            v.transform(Number),
            v.transform((input) => [input]),
          ),
        ]),
        [],
      ),
      limit: v.optional(v.pipe(v.string(), v.digits(), v.transform(Number), v.integer()), '10'),
      offset: v.optional(v.pipe(v.string(), v.digits(), v.transform(Number), v.integer()), '0'),
    });
    app.get(
      '/users',
      cache({ cacheName: 'lettuce-auth-users-multi', cacheControl: 'public max-age=60' }),
      sValidator('query', UsersQuery),
      async (c) => {
        const query = c.req.valid('query');
        const dao = createLettuceAuthDao(c.env.lettuce_auth_db);
        const users = await dao.getUsers({ userIDs: query.userID, limit: query.limit, offset: query.offset });
        return c.json({ users });
      },
    );
    const auth = issuer({
      providers: {
        github: GithubProvider({
          clientID: env.GITHUB_CLIENT_ID!,
          clientSecret: env.GITHUB_CLIENT_SECRET!,
          scopes: ['user:email', 'user:profile'],
        }),
      },
      subjects,
      storage: CloudflareStorage({
        namespace: env.lettuce_auth_sessions,
      }),
      ttl: {
        access: 604800,
      },
      success: async (ctx, value) => {
        let providerUser: ProviderUser;
        if (value.provider === 'github') {
          providerUser = await github
            .get<{
              login: string;
              id: number;
              email: string;
            }>('/user', {}, { headers: { ['Authorization']: `token ${value.tokenset.access}` } })
            .then((r) => ({ id: r.id.toString(), email: r.email, username: r.login }));
        } else {
          throw new Error('idk how we got here');
        }
        const dao = createLettuceAuthDao(env.lettuce_auth_db);
        const account: Account = { provider: value.provider, providerID: providerUser.id.toString() };
        // Check if provider account is already tied to an account
        const userForAccount = await dao.getUserByAccount(account);
        if (userForAccount) {
          return ctx.subject('user', {
            userID: userForAccount.id,
            username: userForAccount.username,
          });
        }
        // Check if email is already tied to an account before creating one.
        const userForEmail = await dao.getUserByEmail(providerUser.email);
        if (userForEmail) {
          throw new Error('email_already_in_use');
        }
        // Create new user if email is not already taken
        const inserts = await dao.createUser({
          user: {
            email: providerUser.email,
            username: providerUser.username,
          },
          account,
        });
        if (!inserts) {
          throw new Error('Error_creating_user');
        }
        return ctx.subject('user', {
          userID: inserts.user.id,
          username: inserts.user.username,
        });
      },
    });
    app.route('/', auth);
    return app.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<LettuceAuthBindings>;
