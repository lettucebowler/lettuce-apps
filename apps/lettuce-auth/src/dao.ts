import { drizzle } from 'drizzle-orm/d1';
import { users, accounts } from '../drizzle/schema';
import type { Bindings } from './types';
import type { Context } from 'hono';
import type { Account } from '@lettuce-apps-packages/auth';
import { eq } from 'drizzle-orm';

export function createLettuceAuthDao(c: Context<{ Bindings: Bindings }>) {
  const db = drizzle(c.env.lettuce_auth_db);

  async function getUserByAccount(account: Account) {
    return db
      .select({
        user_id: accounts.user_id,
        uuid: users.uuid,
        display_name: users.display_name,
        email: users.email,
        provider: accounts.provider,
        providerId: accounts.provider_id,
      })
      .from(users)
      .innerJoin(accounts, eq(users.id, accounts.user_id));
  }
}
