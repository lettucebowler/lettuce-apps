-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
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
CREATE UNIQUE INDEX `username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE TABLE `_cf_KV` (

);

*/