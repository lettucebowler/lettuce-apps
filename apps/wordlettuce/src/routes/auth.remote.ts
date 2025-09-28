import { getRequestEvent, query } from '$app/server';
import * as v from 'valibot';

export const getSession = query(v.object({}), async () => {
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
