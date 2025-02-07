import type { RequestEvent } from '@sveltejs/kit';
import * as v from 'valibot';
import { createClient } from '@openauthjs/openauth/client';

import { AUTH_HOST } from '$env/static/private';

function _createAuthClient(event: RequestEvent) {
	const customFetch = async (url: string, options: any) => {
		if (
			['/.well-known/oauth-authorization-server', '/.well-known/jwks.json'].includes(
				new URL(url).pathname
			)
		) {
			console.log('yeah buddy');
			return fetch(url, {
				...options,
				cf: {
					cacheTtl: 60 * 60 * 24,
					cacheEverything: true
				}
			});
		}
		return event.fetch(url, options);
	};

	return createClient({
		clientID: 'lettuce-auth-test',
		issuer: AUTH_HOST,
		fetch: customFetch
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

import { subjects } from 'auth';

export type UserSubject = v.InferOutput<typeof subjects.user>;
