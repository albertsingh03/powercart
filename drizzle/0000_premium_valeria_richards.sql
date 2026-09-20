CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`product_key` text NOT NULL,
	`kind` text NOT NULL,
	`at` integer NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `events_owner_at` ON `events` (`owner`,`at`);--> statement-breakpoint
CREATE TABLE `products` (
	`key` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`data` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`last_op` text
);
--> statement-breakpoint
CREATE INDEX `products_owner` ON `products` (`owner`);--> statement-breakpoint
CREATE TABLE `receipts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`filename` text NOT NULL,
	`object_key` text NOT NULL,
	`mime` text NOT NULL,
	`at` integer NOT NULL,
	`note` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `receipts_owner` ON `receipts` (`owner`);