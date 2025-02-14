import { fetcher } from 'itty-fetcher';
import { User } from '@lettuce-apps-packages/auth/src/auth';
import { ApiWordlettuceBindings } from '../util/env';
import { Context } from 'hono';
const DEFAULT_HOST = 'https://auth.lettucebowler.net';

export function createLettuceAuthClient(c: Context<{ Bindings: ApiWordlettuceBindings }>) {
  const lettuceAuth = fetcher({
    base: c.env.AUTH_HOST ?? DEFAULT_HOST,
    fetch: (a, b) => c.env.lettuce_auth.fetch(a, b),
  });

  async function getUsers({ userIDs }: { userIDs: Array<number> }): Promise<{ users: Array<Omit<User, 'email'>> }> {
    const searchParams = new URLSearchParams();
    userIDs.forEach((userID) => searchParams.append('userID', userID.toString()));
    return lettuceAuth.get('/users', searchParams);
  }

  async function getUser(user: string | number) {
    return lettuceAuth.get<Omit<User, 'email'>>('/users/' + user);
  }

  return {
    getUsers,
    getUser,
  };
}
