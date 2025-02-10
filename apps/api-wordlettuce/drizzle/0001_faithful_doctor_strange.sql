-- CREATE TABLE `d1_migrations` (
-- 	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
-- 	`name` text,
-- 	`applied_at` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL
-- );
--> statement-breakpoint
CREATE TABLE `game_results` (
	`gamenum` integer NOT NULL,
	`answers` text(30) NOT NULL,
	`user_id` integer NOT NULL,
	`attempts` integer NOT NULL,
	PRIMARY KEY(`gamenum`, `user_id`)
);
--> statement-breakpoint
CREATE INDEX `game_results_gamenum_desc` ON `game_results` (`gamenum`);--> statement-breakpoint
CREATE TABLE `users` (
	`github_id` integer PRIMARY KEY NOT NULL,
	`username` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `username_unique` ON `users` (`username`);