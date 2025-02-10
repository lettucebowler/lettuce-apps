import { issuer } from '@openauthjs/openauth';
import { Account, subjects } from '@lettuce-apps-packages/auth';

import { GithubProvider } from '@openauthjs/openauth/provider/github';
import { CloudflareStorage } from '@openauthjs/openauth/storage/cloudflare';

import type { Env, ProviderUser } from './types';

import { fetcher } from 'itty-fetcher';
import { Hono } from 'hono';
import { cache } from 'hono/cache';
import { v4 as uuidV4 } from 'uuid';
import { createLettuceAuthDao } from './dao';

const github = fetcher({
  base: 'https://api.github.com',
  headers: {
    'user-agent': 'lettuce-auth',
  },
});

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const app = new Hono();
    app.use(
      '/.well-known/jwks.json',
      cache({
        cacheName: 'lettuce-auth-jwks',
        cacheControl: 'max-age-604800',
      }),
    );
    app.use(
      '/.well-known/oauth-authorization-server',

      cache({
        cacheName: 'lettuce-auth-oauth-authorization-server',
        cacheControl: 'max-age-604800',
      }),
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
        const account: Account = { provider: value.provider, providerId: providerUser.id.toString() };
        // Check if provider account is already tied to an account
        const userForAccount = await dao.getUserByAccount(account);
        if (userForAccount) {
          await dao.updateUserEmailByUuid({ userId: userForAccount.id, email: providerUser.email });
          return ctx.subject('user', {
            id: userForAccount.id,
            email: userForAccount.email,
            display_name: userForAccount.display_name,
            account,
          });
        }
        // Check if email is already tied to an account before creating one.
        const userForEmail = await dao.getUserByEmail(providerUser.email);
        if (userForEmail) {
          throw new Error('email_already_in_use');
        }
        // Create new user if email is not already taken
        const newUser = await dao.createUser({
          id: uuidV4(),
          email: providerUser.email,
          display_name: providerUser.username,
          account,
        });
        return ctx.subject('user', newUser);
      },
    });
    app.route('/', auth);
    return app.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
