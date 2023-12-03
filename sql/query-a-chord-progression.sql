SELECT
    c.degree,
    c.chord_type,
    c.bass_note,
    c.extension,
    c.additional,
    sec.name AS section_name
FROM
    songs s
JOIN sections sec ON s.song_id = sec.song_id
JOIN section_progressions sp ON sec.section_id = sp.section_id
JOIN chord_progressions cp ON sp.progression_id = cp.progression_id
JOIN progression_chords pc ON cp.progression_id = pc.progression_id
JOIN chords c ON pc.chord_id = c.chord_id
WHERE
    s.title = 'Sunrise Symphony'
ORDER BY
    sec.order_in_song,
    sp.order_in_section,
    pc.order_in_progression;
