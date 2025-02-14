export type ProviderUser = {
  email: string;
  id: string;
  username: string;
};

export type LettuceAuthBindings = {
  lettuce_auth_sessions: KVNamespace;
  lettuce_auth_db: D1Database;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
};
