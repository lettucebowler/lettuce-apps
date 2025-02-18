import { UserSubject } from '@lettuce-apps-packages/auth';

export type ApiWordlettuceBindings = {
  wordlettuce_db: D1Database;
  lettuce_auth: Service;
  TOKEN: string;
  AUTH_HOST?: string;
  lettuce_auth_signing_keys: KVNamespace;
  TURSO_CONNECTION_URL: string;
  TURSO_AUTH_TOKEN: string;
};

export type ApiWordlettuceVariables = {
  jwtPayload?: UserSubject;
};

export type ApiWordlettuceHono = {
  Bindings: ApiWordlettuceBindings;
  Variables: ApiWordlettuceVariables;
};
