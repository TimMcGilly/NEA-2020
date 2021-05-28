-- https://stackoverflow.com/questions/12598120/mysql-pivot-table-query-with-dynamic-columns

SET @sql = '';
SELECT
    @sql := CONCAT(@sql,if(@sql='','',', '),temp.output)
FROM
(
    SELECT
      DISTINCT
        CONCAT(
         'MAX(IF(activity.name = ''',
          name,
          ''', activitytotrip.experience, NULL)) AS ',
          id,'_experience, ',  
          'MAX(IF(activity.name = ''',
          name,
          ''', activitytotrip.style, NULL)) AS ',
          id, '_style'
        ) as output
    FROM
        activity
    ORDER BY
        id
) as temp;

SET @sql = CONCAT('SELECT trip.uuid, trip.start_date, trip.end_date, trip.lat, trip.lng, trip.user_id, ', @sql, ' 
                   FROM trip
                   LEFT JOIN activitytotrip
                    ON trip.id = activitytotrip.trip_id
                   LEFT JOIN activity 
                    ON activitytotrip.activity_id = activity.id
                   GROUP BY trip.id');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
