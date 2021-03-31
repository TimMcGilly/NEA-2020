CREATE TABLE IF NOT EXISTS `nea_backend_db`.`trip` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `uuid` BINARY(16) UNIQUE NOT NULL,
    `name` TINYTEXT NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `text_loc` TEXT NOT NULL,
    `location` POINT SRID 4326 NOT NULL,
    SPATIAL INDEX(`location`),
    `user_id` INT NOT NULL,
    FOREIGN KEY (`user_id`) 
        REFERENCES `user`(`id`)
        ON DELETE CASCADE
);
