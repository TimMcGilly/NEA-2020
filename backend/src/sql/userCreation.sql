CREATE TABLE IF NOT EXISTS `user` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `auth0_id` CHAR(100) UNIQUE NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `bio_description` TEXT,
);
