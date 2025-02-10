import { drizzle } from 'drizzle-orm/d1';
import { users, accounts } from '../drizzle/schema';
import type { Bindings } from './types';
import type { Context } from 'hono';
import type { Account, User } from '@lettuce-apps-packages/auth';
import { and, eq, inArray } from 'drizzle-orm';

export function createLettuceAuthDao(database: D1Database) {
  const db = drizzle(database);

  async function getUserByAccount(account: Account) {
    const accountResults = db
      .select({ user_id: accounts.user_id })
      .from(accounts)
      .where(and(eq(accounts.provider, account.provider), eq(accounts.provider_id, account.providerId)));
    return db
      .select({
        id: users.uuid,
        display_name: users.display_name,
        email: users.email,
      })
      .from(users)
      .where(inArray(users.id, accountResults))
      .then((users) => users.at(0));
  }

  async function getUserByEmail(email: string) {
    return db
      .select({
        id: users.uuid,
        display_name: users.display_name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((users) => users.at(0));
  }

  async function createUser(user: User): Promise<User> {
    const userInserts = await db
      .insert(users)
      .values({ uuid: user.id, display_name: user.display_name, email: user.email })
      .returning();
    const newUser = userInserts.at(0);
    if (!newUser) {
      throw new Error('oh no user insert failed');
    }
    const accountInserts = await db
      .insert(accounts)
      .values({ provider: user.account.provider, provider_id: user.account.providerId, user_id: newUser.id })
      .returning();
    const newAccount = accountInserts.at(0);
    if (!newAccount) {
      throw new Error('oh no account insert failed');
    }
    const returnValue = {
      display_name: newUser.display_name,
      email: newUser.email,
      id: newUser.uuid,
      account: {
        provider: newAccount.provider,
        providerId: newAccount.provider_id,
      },
    };
    return returnValue;
  }

  return {
    getUserByAccount,
    getUserByEmail,
    createUser,
  };
}
