import { sequence } from '@sveltejs/kit/hooks';
import { type Handle } from '@sveltejs/kit';
import { clearTokens, createAuthClient } from '$lib/auth.server';
import { subjects } from '@lettuce-apps-packages/auth';

const authHandler: Handle = async ({ event, resolve }) => {
  const authClient = createAuthClient(event);
  const access_token = event.cookies.get('access_token');
  if (access_token && event.url.pathname !== '/auth' && event.url.pathname !== '/callback') {
    const before = performance.now();
    const verified = await authClient.verify(subjects, event.cookies.get('access_token')!, {
      refresh: event.cookies.get('refresh_token') || undefined,
    });
    if (!verified.err) {
      const user = await authClient.getUser({ userID: verified.subject.properties.userID });
      event.locals.user = user;
    } else {
      clearTokens(event);
    }
    const after = performance.now();
    console.log('verify', after - before);
  }

  return await resolve(event);
};

const timingsHandler: Handle = async ({ event, resolve }) => {
  const before = performance.now();
  const result = await resolve(event);
  const after = performance.now();
  console.log(event.request.method, new URL(event.request.url).pathname, after - before);
  return result;
};

export const handle = sequence(timingsHandler, authHandler);
