import { User } from '@lettuce-apps-packages/auth';
import { ApiWordlettuceHono } from '../util/env';
import { Context } from 'hono';
import ky, { HTTPError } from 'ky';
const DEFAULT_HOST = 'https://auth.lettucebowler.net';

export function createLettuceAuthClient(c: Context<ApiWordlettuceHono>) {
  const lettuceAuthKY = ky.create({
    prefixUrl: c.env.AUTH_HOST ?? DEFAULT_HOST,
    fetch: (a, b) => c.env.lettuce_auth.fetch(a, b),
  });

  async function getUsers({ userIDs }: { userIDs: Array<number> }): Promise<{ users: Array<Omit<User, 'email'>> }> {
    const searchParams = new URLSearchParams();
    userIDs.forEach((userID) => searchParams.append('userID', userID.toString()));
    return lettuceAuthKY.get<{ users: Array<Omit<User, 'email'>> }>('users', { searchParams }).json();
  }

  async function getUser(
    user: string | number,
  ): Promise<{ user: Omit<User, 'email'>; error?: undefined } | { user: undefined; error: HTTPError }> {
    return lettuceAuthKY
      .get<Omit<User, 'email'>>('users/' + user)
      .json()
      .then((user) => ({ user, error: undefined }))
      .catch((error: HTTPError) => ({ error, user: undefined }));
  }

  return {
    getUsers,
    getUser,
  };
}
