SELECT
    cp.progression_id,
    sp.section_id,
    sp.order_in_section
FROM
    chord_progressions cp
JOIN
    section_progressions sp ON cp.progression_id = sp.progression_id
JOIN
    sections sec ON sp.section_id = sec.section_id
WHERE
    sec.song_id = '211e4567-e89b-12d3-a456-426655440000'; -- Replace 'your_song_uuid' with the actual UUID of the song