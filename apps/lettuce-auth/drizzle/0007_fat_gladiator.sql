ALTER TABLE `users` RENAME COLUMN "user_id" TO "id";--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `idOld`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`provider` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` integer,
	PRIMARY KEY(`provider`, `provider_id`)
);
--> statement-breakpoint
INSERT INTO `__new_accounts`("provider", "provider_id", "user_id") SELECT "provider", "provider_id", "user_id" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;