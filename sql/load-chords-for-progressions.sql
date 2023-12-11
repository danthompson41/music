SELECT
    c.chord_id,
    c.degree,
    c.chord_type,
    c.bass_note,
    c.extension,
    c.additional,
    pc.order_in_progression,
    pc.progression_id
FROM
    chords c
JOIN
    progression_chords pc ON c.chord_id = pc.chord_id
WHERE
    pc.progression_id in ('411e4567-e89b-12d3-a456-426655440000', '411e4567-e89b-12d3-a456-426655440001') -- Replace with each progression's UUID
ORDER BY
    progression_id,
    order_in_progression;