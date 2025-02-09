CREATE TABLE `accounts` (
	`provider` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` integer NOT NULL,
	PRIMARY KEY(`provider`, `provider_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);