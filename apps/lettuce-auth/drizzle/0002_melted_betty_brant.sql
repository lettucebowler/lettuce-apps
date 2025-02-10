PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "display_name") SELECT "id", "email", "display_name" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_display_name_unique` ON `users` (`display_name`);--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`provider` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text,
	PRIMARY KEY(`provider`, `provider_id`)
);
--> statement-breakpoint
INSERT INTO `__new_accounts`("provider", "provider_id", "user_id") SELECT "provider", "provider_id", "user_id" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;