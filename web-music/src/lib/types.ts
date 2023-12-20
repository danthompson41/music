export interface Chord {
    chord_id: string;
    root_note: string;
    chord_type: string;
    extension: string | undefined;
    bass_note: string | undefined;
    extra: string | undefined;
}

export interface NashvilleChord {
    chord_id: string;
    degree: string;
    chord_type: string;
    extension: string | undefined;
    bass_note: string | undefined;
    extra: string | undefined;
}

export interface ChordProgression {
    chord_progression_id: string;
    chord_input: string;
    key: string;
    mode: string;
    derived_chords: Chord[];
    derived_nashville_chords: NashvilleChord[];
  }

export interface SongSection {
    section_id: string;
    name: string;
    chord_progressions: ChordProgression[];
}

export interface Song {
    title: string;
    song_id: string;
    sections: SongSection[];
}


