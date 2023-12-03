-- SELECT *
-- FROM songs s
-- JOIN progressions p ON s.song_id = p.song_id;
-- -- JOIN chord_progression_details cpd ON p.progression_id = cpd.progression_id;
-- -- JOIN chords c ON cpd.chord_id = c.chord_id
-- -- -- WHERE s.title = 'Fictional Song 1'
-- -- ORDER BY cpd.sequence_number;

SELECT s.title, c.chord_name, cpd.sequence_number, cpd.duration, p.progression_description
FROM songs s
JOIN progressions p ON s.song_id = p.song_id
JOIN chord_progression_details cpd ON p.progression_id = cpd.progression_id
JOIN chords c ON cpd.chord_id = c.chord_id
WHERE s.title = 'Fictional Song 1'
ORDER BY p.progression_description, cpd.sequence_number;