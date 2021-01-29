CREATE DATABASE IF NOT EXISTS nea_backend_db;
CREATE USER IF NOT EXISTS 'nea_backend'@'localhost' IDENTIFIED WITH mysql_native_password  BY 'REPLACE_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON nea_backend_db TO 'nea_backend'@'localhost';

