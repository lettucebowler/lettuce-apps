import { redirect } from '@sveltejs/kit';

import { createAuthClient } from '$lib/auth.server.js';

import * as v from 'valibot';

const Referrer = v.pipe(v.string(), v.startsWith('/'));

export async function GET(event) {
  const authClient = createAuthClient();
  const referrerParam = event.url.searchParams.get('referrer');
  const referrer = v.is(Referrer, referrerParam) ? referrerParam : '';

  if (referrer) {
    event.cookies.set('signin-referrer', '/profile/lettucebowler', { path: '/' });
  }
  const { url } = await authClient.authorize(`${event.url.origin}/callback`, 'code', {});
  redirect(302, url);
}
