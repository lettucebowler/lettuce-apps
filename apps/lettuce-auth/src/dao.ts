import { drizzle } from 'drizzle-orm/d1';
import { users, accounts } from '../drizzle/schema';
import type { Account, User } from '@lettuce-apps-packages/auth';
import { and, asc, eq, inArray, sql } from 'drizzle-orm';
import { D1Database, D1DatabaseSession } from '@cloudflare/workers-types';
import * as schema from '../drizzle/schema';

export function createLettuceAuthDao(database: D1Database | D1DatabaseSession) {
  const db = drizzle(database, { schema });

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

  const getUserByIdStatement = db
    .select()
    .from(users)
    .where(eq(users.id, sql.placeholder('id')))
    .limit(1)
    .prepare();
  const getUserByUsernameStatement = db
    .select()
    .from(users)
    .where(eq(users.username, sql.placeholder('username')))
    .limit(1)
    .prepare();
  type GetUserInput =
    | {
        userID: number;
      }
    | {
        username: string;
      };
  async function getUser(input: GetUserInput) {
    if ('username' in input) {
      return getUserByUsernameStatement.all({ username: input.username }).then((r) => r.at(0));
    } else {
      return getUserByIdStatement.all({ id: input.userID }).then((r) => r.at(0));
    }
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

  const getUsersWithIDFiltersStatement = db
    .select({
      username: users.username,
      id: users.id,
    })
    .from(users)
    .where(inArray(users.id, sql.placeholder('ids')))
    .orderBy(asc(users.id))
    .limit(sql.placeholder('limit'))
    .offset(sql.placeholder('offset'))
    .prepare();
  const getUsersWithoutIDFiltersStatement = db
    .select({
      username: users.username,
      id: users.id,
    })
    .from(users)
    .orderBy(asc(users.id))
    .limit(sql.placeholder('limit'))
    .offset(sql.placeholder('offset'))
    .prepare();
  async function getUsers({
    userIDs,
    offset = 0,
    limit = 10,
  }: {
    userIDs: Array<number>;
    offset?: number;
    limit?: number;
  }) {
    let results;
    if (userIDs.length) {
      results = await getUsersWithIDFiltersStatement.all({ ids: userIDs, offset, limit });
    } else {
      results = await getUsersWithoutIDFiltersStatement.all({ offset, limit });
    }
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
