PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_game_results` (
	`gamenum` integer NOT NULL,
	`answers` text(30) NOT NULL,
	`userId` text NOT NULL,
	`attempts` integer NOT NULL,
	PRIMARY KEY(`gamenum`, `userId`)
);
--> statement-breakpoint
INSERT INTO `__new_game_results`("gamenum", "answers", "userId", "attempts") SELECT "gamenum", "answers", "userId", "attempts" FROM `game_results`;--> statement-breakpoint
DROP TABLE `game_results`;--> statement-breakpoint
ALTER TABLE `__new_game_results` RENAME TO `game_results`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `game_results_gamenum_desc` ON `game_results` (`gamenum`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "username") SELECT "id", "username" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `username_unique` ON `users` (`username`);