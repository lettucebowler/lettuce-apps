import { sequence } from '@sveltejs/kit/hooks';
import { type Handle } from '@sveltejs/kit';

const fetchHandler: Handle = ({ event, resolve }) => {
  return resolve(event, {
    filterSerializedResponseHeaders: (name) => name === 'content-type',
  });
};

import { getSession } from '$lib/auth.server';

const authHandler: Handle = async ({ event, resolve }) => {
  event.locals.session = await getSession();
  return await resolve(event);
};

const timingsHandler: Handle = async ({ event, resolve }) => {
  const before = performance.now();
  const result = await resolve(event);
  const after = performance.now();
  console.log(event.request.method, new URL(event.request.url).pathname, after - before);
  return result;
};

export const handle = sequence(timingsHandler, authHandler, fetchHandler);
