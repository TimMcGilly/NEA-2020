CREATE USER IF NOT EXISTS 'nea_backend'@'localhost' IDENTIFIED BY 'password';
CREATE DATABASE IF NOT EXISTS nea_backend_db;
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON nea_backend_db.* TO 'nea_backend'@'localhost';

CREATE TABLE IF NOT EXISTS `nea_backend_db`.`user` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `auth0_id` CHAR(100) UNIQUE NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `date_of_birth`	DATE NOT NULL,
    `bio_description` TEXT,
)

CREATE TABLE IF NOT EXISTS `nea_backend_db`.`trip` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `uuid` BINARY(16) UNIQUE NOT NULL,
    `name` TINYTEXT NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `location` POINT SRID 4326 NOT NULL,
    SPATIAL INDEX(`location`),
    FOREIGN KEY (`user_id`) 
        REFERENCES `user`(`id`)
        ON DELETE CASCADE

)