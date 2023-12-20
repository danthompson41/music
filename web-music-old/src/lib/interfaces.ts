export interface Song {
    title: string;
    song_id: string;
    sections: Section[];
    key: string;
    mode: string;
}

export interface Section {
    section_id: string;
    name: string;
    order_in_song: number;
    key: string;
    mode: string;
    chord_progressions: ChordProgression[];
}

export interface Chord {
    chord_id: string;
    degree: string;
    chord_type: string;
    extension: string | undefined;
    bass_note: string | undefined;
    extra: string | undefined;
}

export interface ChordProgression {
    progression_id: string;
    key: string;
    mode: string;
    chords: Chord[];
    nashvilleChords: Chord[];
  }