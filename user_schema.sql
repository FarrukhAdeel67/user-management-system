CREATE TABLE `usermanagement`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `comments` VARCHAR(255) NULL,
  `status` VARCHAR(45) NULL DEFAULT 'active',
  PRIMARY KEY (`id`));