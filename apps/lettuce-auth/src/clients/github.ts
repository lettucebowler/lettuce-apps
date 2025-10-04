import type { ProviderUser } from '../types';
import ky from 'ky';

export async function getUser({ accessToken }: { accessToken: string }): Promise<ProviderUser> {
  const githubKY = ky.create({
    prefixUrl: 'https://api.github.com',
    headers: {
      'user-agent': 'lettuce-auth',
      ['Authorization']: `token ${accessToken}`,
    },
  });
  const [userResult, emailsResult] = await Promise.allSettled([
    githubKY.get<{ email?: string; id: number; login: string }>('user').json(),
    githubKY.get<Array<{ email: string; primary: boolean; verified: boolean }>>('user/emails').json(),
  ]);
  if (userResult.status !== 'fulfilled' || emailsResult.status !== 'fulfilled') {
    throw new Error('Error fetching provider user');
  }
  const user = userResult.value;
  const emails = emailsResult.value;
  const primaryEmail = emails.find((email) => email.primary)?.email;
  if (!primaryEmail) {
    throw new Error('Email is required.');
  }
  return {
    username: user.login,
    id: user.id.toString(),
    email: primaryEmail,
  };
}
