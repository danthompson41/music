drop table bands, songs, sections, chord_progressions, section_progressions, chords, progression_chords cascade;

CREATE TABLE bands (
    band_id UUID PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE songs (
    song_id UUID PRIMARY KEY,
    band_id UUID,
    title VARCHAR(100),
    key VARCHAR(10),
    FOREIGN KEY (band_id) REFERENCES bands(band_id)
);

CREATE TABLE sections (
    section_id UUID PRIMARY KEY,
    song_id UUID,
    order_in_song INT,
    name VARCHAR(50),
    FOREIGN KEY (song_id) REFERENCES songs(song_id)
);

CREATE TABLE chord_progressions (
    progression_id UUID PRIMARY KEY
);

CREATE TABLE section_progressions (
    section_id UUID,
    progression_id UUID,
    order_in_section INT,
    PRIMARY KEY (section_id, progression_id),
    FOREIGN KEY (section_id) REFERENCES sections(section_id),
    FOREIGN KEY (progression_id) REFERENCES chord_progressions(progression_id)
);

CREATE TABLE chords (
    chord_id SERIAL PRIMARY KEY,
    degree VARCHAR(10),
    chord_type VARCHAR(10),
    bass_note VARCHAR(10) NULL,
    extension VARCHAR(10) NULL,
    additional VARCHAR(10) NULL
);

CREATE TABLE progression_chords (
    progression_id UUID,
    chord_id INT,
    order_in_progression INT,
    PRIMARY KEY (progression_id, chord_id, order_in_progression),
    FOREIGN KEY (progression_id) REFERENCES chord_progressions(progression_id),
    FOREIGN KEY (chord_id) REFERENCES chords(chord_id)
);

