PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO d1_migrations VALUES(1,'0000_goofy_sentry.sql','2025-02-10 04:01:46');
INSERT INTO d1_migrations VALUES(2,'0001_faithful_phil_sheldon.sql','2025-02-10 04:01:46');
INSERT INTO d1_migrations VALUES(3,'0002_melted_betty_brant.sql','2025-02-10 06:51:43');
INSERT INTO d1_migrations VALUES(4,'0003_pale_sentinels.sql','2025-02-10 07:46:44');
INSERT INTO d1_migrations VALUES(5,'0004_huge_gateway.sql','2025-02-10 07:46:45');
CREATE TABLE IF NOT EXISTS "accounts" (
	`provider` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text,
	PRIMARY KEY(`provider`, `provider_id`)
);
INSERT INTO accounts VALUES('github','31812953','8');
CREATE TABLE IF NOT EXISTS "users" (
	`id` text NOT NULL,
	"user_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL
);
INSERT INTO users VALUES('8',1,'lettucebowler@gmail.com','lettucebowler');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('d1_migrations',5);
INSERT INTO sqlite_sequence VALUES('users',1);
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
CREATE UNIQUE INDEX `users_display_name_unique` ON `users` (`display_name`);