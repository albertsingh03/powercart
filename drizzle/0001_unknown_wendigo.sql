ALTER TABLE `products` ADD `identity_key` text;--> statement-breakpoint
CREATE UNIQUE INDEX `products_owner_identity` ON `products` (`owner`,`identity_key`);