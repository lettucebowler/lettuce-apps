import { sql } from 'drizzle-orm';
import { sqliteTable, primaryKey, int, text, numeric } from 'drizzle-orm/sqlite-core';

export const accounts = sqliteTable(
  'accounts',
  {
    provider: text().notNull(),
    provider_id: text().notNull(),
    user_id: text(),
  },
  (table) => [primaryKey({ columns: [table.provider, table.provider_id] })],
);

export const users = sqliteTable('users', {
  id: text().notNull().unique().primaryKey(),
  email: text().notNull().unique(),
  display_name: text().notNull().unique(),
});

export const d1Migrations = sqliteTable('d1_migrations', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text(),
  appliedAt: numeric('applied_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const cfKv = sqliteTable('_cf_KV', {});
