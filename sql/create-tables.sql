drop table chord_progression_details,  artists, chords, genres, songs, progressions;

-- Create Songs Table
CREATE TABLE songs (
    song_id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(), 
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255),
    genre VARCHAR(100)
);

-- Create Chords Table
CREATE TABLE chords (
    chord_id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    chord_name VARCHAR(50) NOT NULL,
    chord_type VARCHAR(50),
    chord_degree VARCHAR(10) NOT NULL,
    chord_extension VARCHAR(10),
    chord_bass_note VARCHAR(10),
    chord_extra VARCHAR(10)
);

-- Create Progressions Table
CREATE TABLE progressions (
    progression_id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    song_id uuid REFERENCES songs(song_id),
    progression_description TEXT
);

-- Create Chord Progression Details Table
CREATE TABLE chord_progression_details (
    detail_id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    progression_id uuid REFERENCES progressions(progression_id),
    chord_id uuid REFERENCES chords(chord_id),
    sequence_number INT,
    duration INT
);

-- Optional: Create Artists Table
CREATE TABLE artists (
    artist_id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    artist_name VARCHAR(255) NOT NULL
);

-- Optional: Create Genre Table
CREATE TABLE genres (
    genre_id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    genre_name VARCHAR(100) NOT NULL
);
