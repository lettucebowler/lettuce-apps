ALTER TABLE `users` ADD `uuid` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `display_name` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `users_uuid_unique` ON `users` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_display_name_unique` ON `users` (`display_name`);