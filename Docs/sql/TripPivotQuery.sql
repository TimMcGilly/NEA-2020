-- https://stackoverflow.com/questions/12598120/mysql-pivot-table-query-with-dynamic-columns
SET @sql = '';
SELECT @sql := CONCAT(@sql, if(@sql = '', '', ', '), temp.output),
    @sql
FROM (
        SELECT DISTINCT CONCAT(
                'MAX(IF(activity.name = ''',
                name,
                ''', activitytotrip.experience, NULL)) AS ',
                activity.id,
                '_experience, ',
                'MAX(IF(activity.name = ''',
                name,
                ''', activitytotrip.style, NULL)) AS ',
                activity.id,
                '_style'
            ) as output
        FROM activity,
            activitytotrip
        WHERE activitytotrip.trip_id = ?
            AND activitytotrip.activity_id = activity.id
        ORDER BY activity.id
    ) as temp

SELECT trip.id,
    trip.lat,
    trip.lng,
    DATEOVERLAP(
        trip.start_date,
        trip.end_date,
        :start_date,
        :end_date
    ) as overlap 
    
    ${ activityQueryAddition }
    
FROM trip
    LEFT JOIN activitytotrip ON trip.id = activitytotrip.trip_id
    LEFT JOIN activity ON activitytotrip.activity_id = activity.id
WHERE lat Between :lat_min And :lat_max
    And lng Between :lng_min And :lng_max
    AND trip.id <> :trip_id
    AND DATEOVERLAP(
        trip.start_date,
        trip.end_date,
        :start_date,
        :end_date
    ) > 0
GROUP BY trip.id;