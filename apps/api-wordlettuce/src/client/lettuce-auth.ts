import { fetcher } from 'itty-fetcher';
import { User } from '@lettuce-apps-packages/auth/src/auth';
const DEFAULT_HOST = 'https://auth.lettucebowler.net';

export function createLettuceAuthClient(input: { fetch?: typeof fetch; host?: string }) {
  const lettuceAuth = fetcher({
    base: input.host ?? DEFAULT_HOST,
    fetch: input.fetch,
  });

  async function getUsers({ userIDs }: { userIDs: Array<number> }): Promise<{ users: Array<Omit<User, 'email'>> }> {
    const searchParams = new URLSearchParams();
    userIDs.forEach((userID) => searchParams.append('userID', userID.toString()));
    return lettuceAuth.get('/users', searchParams);
  }

  async function getUserById({ userID }: { userID: number }) {
    return lettuceAuth.get<Omit<User, 'email'>>('/users/' + userID);
  }

  return {
    getUsers,
    getUserById,
  };
}
