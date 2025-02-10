import { createAuthClient } from '$lib/auth.server';

export async function load(event) {
  const user = event.locals.user;

  if (!user) {
    const authClient = createAuthClient(event);
    const { url } = await authClient.authorize(`${event.url.origin}/callback`, 'code');
    return {
      authenticated: false as const,
      loginUrl: url,
    };
  }

  return {
    authenticated: true as const,
    user,
  };
}
