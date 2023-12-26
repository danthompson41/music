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
    update(): unknown;
    chord_progression_id: string;
    chord_input: string;
    key: string;
    mode: string;
    derived_chords: Chord[];
    derived_nashville_chords: NashvilleChord[];
    derived_movements: ChordMovement[]
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

export interface ChordMovement {
    root_from: string
    root_to: string
    delta_up: string
    delta_down: string
    half_steps_up: number
    half_steps_down: number
}
