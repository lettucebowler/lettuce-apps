import { drizzle } from 'drizzle-orm/d1';
import { users, accounts } from '../drizzle/schema';
import type { Account, User } from '@lettuce-apps-packages/auth';
import { and, asc, eq, inArray } from 'drizzle-orm';

export function createLettuceAuthDao(database: D1Database) {
  const db = drizzle(database);

  async function getUserByAccount(account: Account): Promise<User | undefined> {
    const accountResults = db
      .select({ userID: accounts.userID })
      .from(accounts)
      .where(and(eq(accounts.provider, account.provider), eq(accounts.providerID, account.providerID)));
    return db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
      })
      .from(users)
      .where(inArray(users.id, accountResults))
      .then((users) => users.at(0));
  }

  async function getUserByEmail(email: string): Promise<User | undefined> {
    return db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((users) => users.at(0));
  }

  type GetUserInput =
    | {
        userID: number;
      }
    | {
        username: string;
      };
  async function getUser(input: GetUserInput) {
    return db
      .select()
      .from(users)
      .where(
        and(
          'userID' in input ? eq(users.id, input.userID) : undefined,
          'username' in input ? eq(users.username, input.username) : undefined,
        ),
      )
      .limit(1)
      .then((r) => r.at(0));
  }

  async function createUser({
    user,
    account,
  }: {
    user: Omit<User, 'id'>;
    account: Account;
  }): Promise<{ user: User; account: Account }> {
    const userInserts = await db.insert(users).values({ email: user.email, username: user.username }).returning();
    const newUser = userInserts.at(0);
    if (!newUser) {
      throw new Error('oh no user insert failed');
    }
    const accountInserts = await db
      .insert(accounts)
      .values({ provider: account.provider, providerID: account.providerID, userID: newUser.id })
      .returning();
    const newAccount = accountInserts.at(0);
    if (!newAccount) {
      throw new Error('oh no account insert failed');
    }
    return {
      user: newUser,
      account: newAccount,
    };
  }

  async function getUsers({
    userIDs,
    offset = 0,
    limit = 10,
  }: {
    userIDs: Array<number>;
    offset?: number;
    limit?: number;
  }) {
    const query = db
      .select({
        displayName: users.username,
        id: users.id,
      })
      .from(users)
      .where(and(userIDs.length ? inArray(users.id, userIDs) : undefined))
      .orderBy(asc(users.id))
      .limit(limit)
      .offset(offset);
    const results = await query.all();
    return results;
  }

  return {
    getUserByAccount,
    getUserByEmail,
    createUser,
    getUser,
    getUsers,
  };
}
