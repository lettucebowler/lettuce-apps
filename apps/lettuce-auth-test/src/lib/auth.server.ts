import type { RequestEvent } from '@sveltejs/kit';
import * as v from 'valibot';
import { createAuthClient } from 'auth';

import { AUTH_HOST } from '$env/static/private';

function _createAuthClient(event: RequestEvent) {
	return createAuthClient({
		clientID: 'lettuce-auth-test',
		issuer: AUTH_HOST,
		storage: event.platform?.env.lettuce_auth_test,
		fetch: event.fetch
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
