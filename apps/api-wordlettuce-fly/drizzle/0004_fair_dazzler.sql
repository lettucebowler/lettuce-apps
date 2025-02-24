PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_game_results` (
	`game_num` integer NOT NULL,
	`answers` text(30) NOT NULL,
	`user_id` integer NOT NULL,
	`attempts` integer NOT NULL,
	PRIMARY KEY(`game_num`, `user_id`)
);
--> statement-breakpoint
INSERT INTO `__new_game_results`("game_num", "answers", "user_id", "attempts") SELECT "game_num", "answers", "user_id", "attempts" FROM `game_results`;--> statement-breakpoint
DROP TABLE `game_results`;--> statement-breakpoint
ALTER TABLE `__new_game_results` RENAME TO `game_results`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `game_results_gamenum_desc` ON `game_results` (`game_num`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "username") SELECT "id", "username" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `username_unique` ON `users` (`username`);