CREATE TABLE `api_key` (
	`id` varchar(255) NOT NULL,
	`client_id` varchar(255),
	`client_secret` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL,
	`expires_at` datetime(3),
	`deleted_at` datetime(3),
	CONSTRAINT `api_key_id` PRIMARY KEY(`id`),
	CONSTRAINT `client_id_idx` UNIQUE(`client_id`)
);
--> statement-breakpoint
CREATE TABLE `oauth_account` (
	`provider_id` varchar(255) NOT NULL,
	`provider_user_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `oauth_account_provider_id_provider_user_id_pk` PRIMARY KEY(`provider_id`,`provider_user_id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`username` varchar(255),
	`email` varchar(255),
	`image` varchar(255),
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `api_key` ADD CONSTRAINT `api_key_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `oauth_account` ADD CONSTRAINT `oauth_account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;