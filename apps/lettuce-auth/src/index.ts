import { issuer } from '@openauthjs/openauth';
import { subjects } from '@lettuce-apps-packages/auth';

import { GithubProvider } from '@openauthjs/openauth/provider/github';
import { CloudflareStorage } from '@openauthjs/openauth/storage/cloudflare';

interface Env {
  lettuce_auth_sessions: KVNamespace;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

import { fetcher } from 'itty-fetcher';
import { Hono } from 'hono';
import { cache } from 'hono/cache';
import { v4 as uuidV4 } from 'uuid';
import test from 'node:test';

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
        const user = await github.get<{
          login: string;
          id: number;
          email: string;
        }>(
          '/user',
          {},
          { headers: { ['Authorization']: `token ${value.tokenset.access}` } },
        );
        return ctx.subject('user', {
          id: uuidV4(),
          email: user.email,
          display_name: user.login,
          account: {
            provider: 'github',
            providerId: user.id.toString(),
          },
        });
      },
    });
    app.route('/', auth);
    return app.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
