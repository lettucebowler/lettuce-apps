import { KVNamespace, Service } from '@cloudflare/workers-types';
import type { UserSubject } from '$lib/auth.server';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: UserSubject | undefined;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				lettuce_auth_signing_keys: KVNamespace;
			};
		}
	}
}

export {};
