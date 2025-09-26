import { redirect } from '@sveltejs/kit';

import { clearTokens } from '$lib/auth.server.js';

export async function GET(event) {
  clearTokens();
  const url = event.url.searchParams.get('referrer') ?? '/';
  redirect(302, url);
}
