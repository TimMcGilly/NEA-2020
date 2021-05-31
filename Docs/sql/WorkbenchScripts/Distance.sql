DROP FUNCTION IF EXISTS distance;
DELIMITER $$
CREATE FUNCTION DISTANCE(lat1 float, lng1 float, lat2 float, lng2 float) 
RETURNS FLOAT
DETERMINISTIC
BEGIN
	DECLARE a, radConv FLOAT DEFAULT 0;
    set radConv = 0.01745329251; -- Constant to convert degrees to radians 
    SET a = 0.5 - cos((lat2-lat1)*radConv)/2 + cos(lat1*radConv)*cos(lat2*radConv)*(1-cos((lng2-lng1)*radConv))/2;
	return 12742 * asin(sqrt(a)); -- 12742000 is 2 * radius of earth
END$$

DELIMITER ;

SET @s = 'SELECT DISTANCE(trip.lat, trip.lng, ?, ?) FROM trip;';


PREPARE stmt FROM @s;
SET @a = 54.431953;
SET @b = -2.963053;
EXECUTE stmt USING @a, @b;
DEALLOCATE PREPARE stmt;
