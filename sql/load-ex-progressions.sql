INSERT INTO songs (song_id, title, key, mode) VALUES
('211e4567-e89b-12d3-a456-426655440000', 'Sunrise Symphony', 'C', 'Ionian'),
('211e4567-e89b-12d3-a456-426655440001', 'Evening Rhapsody', 'G', 'Ionian');

INSERT INTO sections (section_id, song_id, order_in_song, name, key, mode) VALUES
('311e4567-e89b-12d3-a456-426655440000', '211e4567-e89b-12d3-a456-426655440000', 1, 'Intro', 'C', 'Ionian'),
('311e4567-e89b-12d3-a456-426655440001', '211e4567-e89b-12d3-a456-426655440000', 2, 'Verse', 'C', 'Ionian'),
('311e4567-e89b-12d3-a456-426655440002', '211e4567-e89b-12d3-a456-426655440001', 1, 'Intro', 'C', 'Ionian'),
('311e4567-e89b-12d3-a456-426655440003', '211e4567-e89b-12d3-a456-426655440001', 2, 'Chorus', 'C', 'Ionian');

INSERT INTO chord_progressions (progression_id) VALUES
('411e4567-e89b-12d3-a456-426655440000'),
('411e4567-e89b-12d3-a456-426655440001');

INSERT INTO section_progressions (section_id, progression_id, order_in_section) VALUES
('311e4567-e89b-12d3-a456-426655440000', '411e4567-e89b-12d3-a456-426655440000', 1),
('311e4567-e89b-12d3-a456-426655440000', '411e4567-e89b-12d3-a456-426655440001', 2),
('311e4567-e89b-12d3-a456-426655440001', '411e4567-e89b-12d3-a456-426655440001', 1),
('311e4567-e89b-12d3-a456-426655440002', '411e4567-e89b-12d3-a456-426655440001', 1),
('311e4567-e89b-12d3-a456-426655440003', '411e4567-e89b-12d3-a456-426655440001', 1);

INSERT INTO chords (chord_id, degree, chord_type, bass_note, extension, additional) VALUES
(1, '1', 'major', '5', '7', NULL),
(2, '4', 'major', NULL, NULL, NULL),
(3, '5', 'major', NULL, NULL, NULL);

INSERT INTO progression_chords (progression_id, chord_id, order_in_progression) VALUES
('411e4567-e89b-12d3-a456-426655440000', 1, 1),
('411e4567-e89b-12d3-a456-426655440000', 2, 2),
('411e4567-e89b-12d3-a456-426655440000', 3, 3),
('411e4567-e89b-12d3-a456-426655440001', 1, 1),
('411e4567-e89b-12d3-a456-426655440001', 3, 2);
