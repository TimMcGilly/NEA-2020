CREATE TABLE IF NOT EXISTS `user` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `auth0_id` CHAR(100) UNIQUE NOT NULL,
    `uuid` BINARY(16) UNIQUE NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `date_of_birth` DATE NOT NULL,
    `bio_description` TEXT
);
CREATE TABLE IF NOT EXISTS `trip` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `uuid` BINARY(16) UNIQUE NOT NULL,
    `name` TINYTEXT NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `lat` FLOAT(10, 6),
    `lng` FLOAT(10, 6),
    `text_loc` TEXT NOT NULL,
    `user_id` INT NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS `activity` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `faicon` TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS `activitytotrip` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `activity_id` INT NOT NULL,
    FOREIGN KEY (`activity_id`) REFERENCES `activity`(`id`) ON UPDATE CASCADE,
    `trip_id` INT NOT NULL,
    FOREIGN KEY (`trip_id`) REFERENCES `trip`(`id`) ON UPDATE CASCADE,
    `experience` ENUM ('beginner', 'intermediate', 'expert') NOT NULL,
    `style` ENUM ('casual', 'serious') NOT NULL
);
CREATE TABLE IF NOT EXISTS `chat` (
  `id` INT PRIMARY KEY AUTO_INCREMENT
);
CREATE TABLE IF NOT EXISTS `usermatch` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `trip_id1` INT NOT NULL,
    FOREIGN KEY (`trip_id1`) REFERENCES `trip`(`id`) ON UPDATE CASCADE,
    `trip_id2` INT NOT NULL,
    FOREIGN KEY (`trip_id2`) REFERENCES `trip`(`id`) ON UPDATE CASCADE,
    `status` ENUM ('requested', 'accepted'),
    `chat` INT NOT NULL,
    FOREIGN KEY (`chat`) REFERENCES `chat`(`id`) ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS `textmessage` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `uuid` BINARY(16) UNIQUE NOT NULL,
    `contents` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL,
    `chat` INT NOT NULL
);
CREATE TABLE IF NOT EXISTS `blobmessage` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `uuid` BINARY(16) UNIQUE NOT NULL,
    `contents` JSON NOT NULL,
    `created_at` DATETIME NOT NULL,
    `chat` INT NOT NULL
);
CREATE TABLE IF NOT EXISTS `group` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `status` ENUM ('draft', 'public', 'private') NOT NULL,
    `created_at` DATETIME NOT NULL,
    `max_members` INT NOT NULL,
    `creator_trip_id` INT NOT NULL,
    FOREIGN KEY (`creator_trip_id`) REFERENCES `trip`(`id`) ON UPDATE CASCADE,
    `chat` INT NOT NULL,
    FOREIGN KEY (`chat`) REFERENCES `chat`(`id`) ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS `triptogroup` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `trip_id` INT NOT NULL,
    FOREIGN KEY (`trip_id`) REFERENCES `trip`(`id`) ON UPDATE CASCADE,
    `group_id` INT NOT NULL,
    FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON UPDATE CASCADE
);