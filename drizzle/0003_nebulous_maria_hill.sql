CREATE TABLE `adminConfig` (
	`id` int AUTO_INCREMENT NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`whatsapp` varchar(20) NOT NULL,
	`recoveryToken` varchar(255),
	`recoveryTokenExpiry` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adminConfig_id` PRIMARY KEY(`id`)
);
