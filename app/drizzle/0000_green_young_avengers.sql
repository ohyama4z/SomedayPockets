CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`parent_id` text,
	`priority` integer,
	`deadline` text,
	`completed` integer DEFAULT 0 NOT NULL,
	`completed_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action
);
