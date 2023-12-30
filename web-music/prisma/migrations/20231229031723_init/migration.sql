-- CreateTable
CREATE TABLE "Song" (
    "song_id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "song_key" STRING,
    "song_mode" STRING,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("song_id")
);

-- CreateTable
CREATE TABLE "SongSection" (
    "section_id" STRING NOT NULL,
    "song_id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "section_order" INT4 NOT NULL,

    CONSTRAINT "SongSection_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "ChordProgression" (
    "chord_progression_id" STRING NOT NULL,
    "section_id" STRING NOT NULL,
    "chord_input" STRING,
    "key" STRING,
    "mode" STRING,
    "progression_order" INT4 NOT NULL,

    CONSTRAINT "ChordProgression_pkey" PRIMARY KEY ("chord_progression_id")
);

-- CreateTable
CREATE TABLE "Chord" (
    "chord_id" STRING NOT NULL,
    "root_note" STRING NOT NULL,
    "chord_type" STRING NOT NULL,
    "extension" STRING,
    "bass_note" STRING,
    "extra" STRING,

    CONSTRAINT "Chord_pkey" PRIMARY KEY ("chord_id")
);

-- CreateTable
CREATE TABLE "NashvilleChord" (
    "chord_id" STRING NOT NULL,
    "degree" STRING NOT NULL,
    "chord_type" STRING NOT NULL,
    "extension" STRING,
    "bass_note" STRING,
    "extra" STRING,

    CONSTRAINT "NashvilleChord_pkey" PRIMARY KEY ("chord_id")
);

-- CreateTable
CREATE TABLE "ChordMovement" (
    "movement_id" STRING NOT NULL,
    "root_from" STRING NOT NULL,
    "root_to" STRING NOT NULL,
    "delta_up" STRING NOT NULL,
    "delta_down" STRING NOT NULL,
    "half_steps_up" INT4 NOT NULL,
    "half_steps_down" INT4 NOT NULL,

    CONSTRAINT "ChordMovement_pkey" PRIMARY KEY ("movement_id")
);

-- CreateTable
CREATE TABLE "ProgressionChord" (
    "chord_progression_id" STRING NOT NULL,
    "chord_id" STRING NOT NULL,
    "chord_order" INT4 NOT NULL,

    CONSTRAINT "ProgressionChord_pkey" PRIMARY KEY ("chord_progression_id","chord_id","chord_order")
);

-- CreateTable
CREATE TABLE "ProgressionNashvilleChord" (
    "chord_progression_id" STRING NOT NULL,
    "nashville_chord_id" STRING NOT NULL,
    "nashville_chord_order" INT4 NOT NULL,

    CONSTRAINT "ProgressionNashvilleChord_pkey" PRIMARY KEY ("chord_progression_id","nashville_chord_id","nashville_chord_order")
);

-- CreateTable
CREATE TABLE "ProgressionChordMovement" (
    "chord_progression_id" STRING NOT NULL,
    "movement_id" STRING NOT NULL,
    "movement_order" INT4 NOT NULL,

    CONSTRAINT "ProgressionChordMovement_pkey" PRIMARY KEY ("chord_progression_id","movement_id","movement_order")
);

-- AddForeignKey
ALTER TABLE "SongSection" ADD CONSTRAINT "SongSection_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song"("song_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChordProgression" ADD CONSTRAINT "ChordProgression_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "SongSection"("section_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressionChord" ADD CONSTRAINT "ProgressionChord_chord_progression_id_fkey" FOREIGN KEY ("chord_progression_id") REFERENCES "ChordProgression"("chord_progression_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressionChord" ADD CONSTRAINT "ProgressionChord_chord_id_fkey" FOREIGN KEY ("chord_id") REFERENCES "Chord"("chord_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressionNashvilleChord" ADD CONSTRAINT "ProgressionNashvilleChord_chord_progression_id_fkey" FOREIGN KEY ("chord_progression_id") REFERENCES "ChordProgression"("chord_progression_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressionNashvilleChord" ADD CONSTRAINT "ProgressionNashvilleChord_nashville_chord_id_fkey" FOREIGN KEY ("nashville_chord_id") REFERENCES "NashvilleChord"("chord_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressionChordMovement" ADD CONSTRAINT "ProgressionChordMovement_chord_progression_id_fkey" FOREIGN KEY ("chord_progression_id") REFERENCES "ChordProgression"("chord_progression_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressionChordMovement" ADD CONSTRAINT "ProgressionChordMovement_movement_id_fkey" FOREIGN KEY ("movement_id") REFERENCES "ChordMovement"("movement_id") ON DELETE RESTRICT ON UPDATE CASCADE;
