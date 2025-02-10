import { drizzle } from 'drizzle-orm/d1';
import { users, accounts } from '../drizzle/schema';
import type { Account, User } from '@lettuce-apps-packages/auth';
import { and, eq, inArray } from 'drizzle-orm';

export function createLettuceAuthDao(database: D1Database) {
  const db = drizzle(database);

  async function getUserByAccount(account: Account): Promise<Omit<User, 'account'> | undefined> {
    const accountResults = db
      .select({ userId: accounts.userId })
      .from(accounts)
      .where(and(eq(accounts.provider, account.provider), eq(accounts.providerId, account.providerId)));
    return db
      .select({
        id: users.id,
        displayName: users.displayName,
        email: users.email,
      })
      .from(users)
      .where(inArray(users.id, accountResults))
      .then((users) => users.at(0));
  }

  async function getUserByEmail(email: string): Promise<Omit<User, 'account'> | undefined> {
    return db
      .select({
        id: users.id,
        displayName: users.displayName,
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((users) => users.at(0));
  }

  async function createUser(user: Omit<User, 'id'>): Promise<User | undefined> {
    const userInserts = await db.insert(users).values({ email: user.email, displayName: user.displayName }).returning();
    const newUser = userInserts.at(0);
    if (!newUser) {
      throw new Error('oh no user insert failed');
    }
    const accountInserts = await db
      .insert(accounts)
      .values({ provider: user.account.provider, providerId: user.account.providerId, userId: newUser.id })
      .returning();
    const newAccount = accountInserts.at(0);
    if (!newAccount) {
      throw new Error('oh no account insert failed');
    }
    const returnValue: User = {
      displayName: newUser.displayName,
      email: newUser.email,
      id: newUser.id,
      account: {
        provider: newAccount.provider,
        providerId: newAccount.providerId,
      },
    };
    return returnValue;
  }

  async function updateUserEmailByUuid({ userId, email }: { userId: number; email: string }) {
    return db.update(users).set({ email }).where(eq(users.id, userId));
  }

  return {
    getUserByAccount,
    getUserByEmail,
    createUser,
    updateUserEmailByUuid,
  };
}
