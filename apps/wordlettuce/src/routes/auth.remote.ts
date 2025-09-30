import { getRequestEvent, query } from '$app/server';

export const getSession = query(async () => {
  const event = getRequestEvent();
  if (!event.locals.session) {
    return {
      authenticated: false as const,
    };
  }
  const user = event.locals.session;
  return {
    authenticated: true as const,
    user,
  };
});
