CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`customerPhone` varchar(20) NOT NULL,
	`items` text NOT NULL,
	`totalPrice` int NOT NULL,
	`paymentMethod` varchar(50),
	`status` enum('nuevo','en_preparacion','listo','entregado','cancelado') NOT NULL DEFAULT 'nuevo',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
