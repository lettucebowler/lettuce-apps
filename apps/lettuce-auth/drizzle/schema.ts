import { sql } from 'drizzle-orm';
import { sqliteTable, primaryKey, int, text, numeric } from 'drizzle-orm/sqlite-core';

export const accounts = sqliteTable(
  'accounts',
  {
    provider: text().notNull(),
    providerID: text('provider_id').notNull(),
    userID: int('user_id'),
  },
  (table) => [primaryKey({ columns: [table.provider, table.providerID] })],
);

export const users = sqliteTable('users', {
  id: int().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  username: text('display_name').notNull().unique(),
});

export const d1Migrations = sqliteTable('d1_migrations', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text(),
  appliedAt: numeric('applied_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const cfKv = sqliteTable('_cf_KV', {});
