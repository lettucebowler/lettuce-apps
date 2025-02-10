import { sqliteTable, AnySQLiteColumn, index, primaryKey, integer, uniqueIndex, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const gameResults = sqliteTable(
  'game_results',
  {
    gamenum: integer().notNull(),
    answers: text({ length: 30 }).notNull(),
    userId: integer('user_id').notNull(),
    attempts: integer().notNull(),
  },
  (table) => [
    index('game_results_gamenum_desc').on(table.gamenum),
    primaryKey({ columns: [table.gamenum, table.userId], name: 'game_results_gamenum_user_id_pk' }),
  ],
);

export const users = sqliteTable(
  'users',
  {
    githubId: integer('github_id').primaryKey().notNull(),
    username: text(),
  },
  (table) => [uniqueIndex('username_unique').on(table.username)],
);

export const cfKv = sqliteTable('_cf_KV', {});
