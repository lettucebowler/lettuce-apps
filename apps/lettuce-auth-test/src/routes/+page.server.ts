import { createAuthClient } from '$lib/auth.server';

export async function load(event) {
  const session = event.locals.session;

  if (!session) {
    const authClient = createAuthClient(event);
    const { url } = await authClient.authorize(`${event.url.origin}/callback`, 'code');
    return {
      authenticated: false as const,
      loginUrl: url,
    };
  }
  return {
    authenticated: true as const,
    user: {
      id: session.userID,
      username: session.username,
    },
  };
}
