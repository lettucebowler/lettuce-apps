import { createAuthClient } from '$lib/auth.server';

export async function load(event) {
	const session = event.locals.session;

	if (!session) {
		const authClient = createAuthClient(event);
		const { url } = await authClient.authorize(`${event.url.origin}/callback`, 'code');
		return {
			authenticated: false as false,
			loginUrl: url
		};
	}

	return {
		authenticated: true as true,
		session
	};
}
