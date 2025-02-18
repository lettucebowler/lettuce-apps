import { UserSubject } from '@lettuce-apps-packages/auth';
import type { KVNamespace, D1Database } from '@cloudflare/workers-types';

export type ApiWordlettuceBindings = {
  wordlettuce_db: D1Database;
  lettuce_auth: Service;
  TOKEN: string;
  AUTH_HOST?: string;
  lettuce_auth_signing_keys: KVNamespace;
};

export type ApiWordlettuceVariables = {
  jwtPayload?: UserSubject;
};

export type ApiWordlettuceHono = {
  Bindings: ApiWordlettuceBindings;
  Variables: ApiWordlettuceVariables;
};
