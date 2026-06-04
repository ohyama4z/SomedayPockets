PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_items` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`type` text,
	`lane` text DEFAULT 'inbox' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`parent_id` text,
	`priority` integer,
	`deadline` text,
	`completed` integer DEFAULT false NOT NULL,
	`completed_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_items`("id", "title", "type", "lane", "sort_order", "parent_id", "priority", "deadline", "completed", "completed_at", "created_at", "updated_at") SELECT "id", "title", "type", "lane", "sort_order", "parent_id", "priority", "deadline", "completed", "completed_at", "created_at", "updated_at" FROM `items`;--> statement-breakpoint
DROP TABLE `items`;--> statement-breakpoint
ALTER TABLE `__new_items` RENAME TO `items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;