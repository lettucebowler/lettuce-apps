/// <reference types="@sveltejs/kit" />
import type { KVNamespace, Service } from '@cloudflare/workers-types';
import { User, UserSubject } from '@lettuce-apps-packages/auth';

declare global {
  declare namespace App {
    interface Locals {
      session: UserSubject | null;
    }
    interface PageState {
      showModal: boolean;
    }
    interface Platform {
      env?: {
        lettuce_auth_signing_keys: KVNamespace;
        api_wordlettuce: Service;
        lettuce_auth: Service;
      };
    }
  }
}
export {};
