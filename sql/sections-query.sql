SELECT
    sec.section_id,
    sec.order_in_song,
    sec.name
FROM
    sections sec
WHERE
    sec.song_id = '211e4567-e89b-12d3-a456-426655440000'; -- Replace 'your_song_uuid' with the actual UUID of the song