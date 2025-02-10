export interface Env extends Bindings {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

export type Bindings = {
  lettuce_auth_sessions: KVNamespace;
  lettuce_auth_db: D1Database;
};

export type ProviderUser = {
  email: string;
  id: string;
  username: string;
};
