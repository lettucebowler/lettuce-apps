/// <reference types="@sveltejs/kit" />
import { KVNamespace } from '@cloudflare/workers-types';
import { WordlettuceGame } from '$lib/game/wordlettuce-game.svelte';
import { UserSubject } from '$lib/auth.server';

declare global {
  declare namespace App {
    interface Locals {
      getGameStateV3: () => WordlettuceGame;
      session: UserSubject | undefined;
    }
    interface PageState {
      showModal: boolean;
    }
    interface Platform {
      env?: {
        lettuce_auth_signing_keys: KVNamespace;
      };
    }
  }
}
export {};
