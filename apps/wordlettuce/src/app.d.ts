/// <reference types="@sveltejs/kit" />
import type { KVNamespace, Service } from '@cloudflare/workers-types';
import { WordlettuceGame } from '$lib/wordlettuce-game.svelte';
import { User, UserSubject } from '@lettuce-apps-packages/auth';

declare global {
  declare namespace App {
    interface Locals {
      getGameStateV3: () => WordlettuceGame;
      session: User | undefined;
    }
    interface PageState {
      showModal: boolean;
    }
    interface Platform {
      env?: {
        lettuce_auth_signing_keys: KVNamespace;
        api_wordlettuce: Service;
      };
    }
  }
}
export {};
