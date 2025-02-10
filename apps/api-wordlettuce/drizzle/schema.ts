import { sql } from 'drizzle-orm';
import { sqliteTable, index, primaryKey, uniqueIndex, text, int, numeric } from 'drizzle-orm/sqlite-core';

export const gameResults = sqliteTable(
  'game_results',
  {
    gameNum: int('game_num').notNull(),
    answers: text({ length: 30 }).notNull(),
    userId: int('user_id').notNull(),
    attempts: int().notNull(),
  },
  (table) => [
    index('game_results_gamenum_desc').on(table.gameNum),
    primaryKey({ columns: [table.gameNum, table.userId], name: 'game_results_gamenum_user_id_pk' }),
  ],
);

export const users = sqliteTable(
  'users',
  {
    id: int().primaryKey().notNull(),
    username: text(),
  },
  (table) => [uniqueIndex('username_unique').on(table.username)],
);

export const cfKv = sqliteTable('_cf_KV', {});

export const d1Migrations = sqliteTable('d1_migrations', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text(),
  appliedAt: numeric('applied_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
