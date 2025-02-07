import { KVNamespace } from '@cloudflare/workers-types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: import('$lib/auth.server').UserSubject | undefined;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				lettuce_auth_test: KVNamespace;
			};
		}
	}
}

export {};
