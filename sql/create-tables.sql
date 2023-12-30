drop table songs, sections, chord_progressions, section_progressions, chords, progression_chords cascade;

-- Songs Table
CREATE TABLE songs (
    song_id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    song_key VARCHAR(50),
    song_mode VARCHAR(50)
);

-- Song Sections Table
CREATE TABLE song_sections (
    section_id UUID PRIMARY KEY,
    song_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    section_order INT NOT NULL, -- Added to specify the order of sections within a song
    FOREIGN KEY (song_id) REFERENCES songs(song_id)
);

-- Chord Progressions Table
CREATE TABLE chord_progressions (
    chord_progression_id UUID PRIMARY KEY,
    section_id UUID NOT NULL,
    chord_input TEXT,
    key VARCHAR(50),
    mode VARCHAR(50),
    progression_order INT NOT NULL, -- Added to specify the order of progressions within a section
    FOREIGN KEY (section_id) REFERENCES song_sections(section_id)
);

-- Chords Table
CREATE TABLE chords (
    chord_id UUID PRIMARY KEY,
    root_note VARCHAR(50),
    chord_type VARCHAR(50),
    extension VARCHAR(50),
    bass_note VARCHAR(50),
    extra TEXT
);

-- Nashville Chords Table
CREATE TABLE nashville_chords (
    chord_id UUID PRIMARY KEY,
    degree VARCHAR(50),
    chord_type VARCHAR(50),
    extension VARCHAR(50),
    bass_note VARCHAR(50),
    extra TEXT
);

-- Chord Movements Table
CREATE TABLE chord_movements (
    movement_id UUID PRIMARY KEY,
    root_from VARCHAR(50),
    root_to VARCHAR(50),
    delta_up VARCHAR(50),
    delta_down VARCHAR(50),
    half_steps_up INT,
    half_steps_down INT
);

-- Association Table for Chord Progressions and Chords
CREATE TABLE progression_chords (
    chord_progression_id UUID NOT NULL,
    chord_id UUID NOT NULL,
    chord_order INT NOT NULL, -- Added to specify the order of chords within a progression
    FOREIGN KEY (chord_progression_id) REFERENCES chord_progressions(chord_progression_id),
    FOREIGN KEY (chord_id) REFERENCES chords(chord_id),
    PRIMARY KEY (chord_progression_id, chord_id, chord_order)
);

-- Association Table for Chord Progressions and Nashville Chords
CREATE TABLE progression_nashville_chords (
    chord_progression_id UUID NOT NULL,
    nashville_chord_id UUID NOT NULL,
    nashville_chord_order INT NOT NULL, -- Added to specify the order of Nashville chords within a progression
    FOREIGN KEY (chord_progression_id) REFERENCES chord_progressions(chord_progression_id),
    FOREIGN KEY (nashville_chord_id) REFERENCES nashville_chords(chord_id),
    PRIMARY KEY (chord_progression_id, nashville_chord_id, nashville_chord_order)
);

-- Association Table for Chord Progressions and Chord Movements
CREATE TABLE progression_chord_movements (
    chord_progression_id UUID NOT NULL,
    movement_id UUID NOT NULL,
    movement_order INT NOT NULL, -- Added to specify the order of movements within a progression
    FOREIGN KEY (chord_progression_id) REFERENCES chord_progressions(chord_progression_id),
    FOREIGN KEY (movement_id) REFERENCES chord_movements(movement_id),
    PRIMARY KEY (chord_progression_id, movement_id, movement_order)
);