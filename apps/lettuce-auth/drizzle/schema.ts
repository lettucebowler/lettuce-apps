import { sql } from 'drizzle-orm';
import { sqliteTable, primaryKey, int, text, numeric } from 'drizzle-orm/sqlite-core';

export const accounts = sqliteTable(
  'accounts',
  {
    provider: text().notNull(),
    providerId: text('provider_id').notNull(),
    userId: int('user_id'),
  },
  (table) => [primaryKey({ columns: [table.provider, table.providerId] })],
);

export const users = sqliteTable('users', {
  id: int().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  displayName: text('display_name').notNull().unique(),
});

export const d1Migrations = sqliteTable('d1_migrations', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text(),
  appliedAt: numeric('applied_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const cfKv = sqliteTable('_cf_KV', {});
