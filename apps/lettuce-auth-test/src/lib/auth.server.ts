import type { RequestEvent } from '@sveltejs/kit';
import * as v from 'valibot';
import { createAuthClient, subjects } from '@lettuce-apps-packages/auth';

import { AUTH_HOST } from '$env/static/private';

function _createAuthClient(event: RequestEvent) {
	// const customFetch = async (url: string, options: any) => {
	// 	const before = performance.now();
	// 	const result = await event.fetch(url, options);
	// 	const after = performance.now();
	// 	console.log('fetch', url, after - before);
	// 	return result;
	// };

	return createAuthClient({
		clientID: 'lettuce-auth-test',
		issuer: AUTH_HOST,
		// fetch: customFetch,
		// fetch: event.platform?.env.lettuce_auth?.fetch ?? event.fetch
		fetch: event.fetch,
		storage: event.platform?.env.lettuce_auth_test
	});
}

export { _createAuthClient as createAuthClient };

export function setTokens(event: RequestEvent, access: string, refresh: string) {
	event.cookies.set('refresh_token', refresh, {
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
		maxAge: 34560000
	});
	event.cookies.set('access_token', access, {
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
		maxAge: 34560000
	});
}

export type UserSubject = v.InferOutput<typeof subjects.user>;
