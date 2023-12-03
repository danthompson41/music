INSERT INTO bands (band_id, name) VALUES
('111e4567-e89b-12d3-a456-426655440000', 'The Harmonics'),
('111e4567-e89b-12d3-a456-426655440001', 'Melody Makers');

INSERT INTO songs (song_id, band_id, title, key) VALUES
('211e4567-e89b-12d3-a456-426655440000', '111e4567-e89b-12d3-a456-426655440000', 'Sunrise Symphony', 'C'),
('211e4567-e89b-12d3-a456-426655440001', '111e4567-e89b-12d3-a456-426655440001', 'Evening Rhapsody', 'G');

INSERT INTO sections (section_id, song_id, order_in_song, name) VALUES
('311e4567-e89b-12d3-a456-426655440000', '211e4567-e89b-12d3-a456-426655440000', 1, 'Intro'),
('311e4567-e89b-12d3-a456-426655440001', '211e4567-e89b-12d3-a456-426655440000', 2, 'Verse'),
('311e4567-e89b-12d3-a456-426655440002', '211e4567-e89b-12d3-a456-426655440001', 3, 'Chorus');

INSERT INTO chord_progressions (progression_id) VALUES
('411e4567-e89b-12d3-a456-426655440000'),
('411e4567-e89b-12d3-a456-426655440001');

INSERT INTO section_progressions (section_id, progression_id, order_in_section) VALUES
('311e4567-e89b-12d3-a456-426655440000', '411e4567-e89b-12d3-a456-426655440000', 1),
('311e4567-e89b-12d3-a456-426655440001', '411e4567-e89b-12d3-a456-426655440001', 1);

INSERT INTO chords (chord_id, degree, chord_type, bass_note, extension, additional) VALUES
(1, '1', 'major', NULL, NULL, NULL),
(2, '4', 'major', NULL, NULL, NULL),
(3, '5', 'major', NULL, NULL, NULL);

INSERT INTO progression_chords (progression_id, chord_id, order_in_progression) VALUES
('411e4567-e89b-12d3-a456-426655440000', 1, 1),
('411e4567-e89b-12d3-a456-426655440000', 2, 2),
('411e4567-e89b-12d3-a456-426655440000', 3, 3),
('411e4567-e89b-12d3-a456-426655440001', 1, 1),
('411e4567-e89b-12d3-a456-426655440001', 3, 2);
