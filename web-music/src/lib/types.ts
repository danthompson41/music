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
    derived_movements: ChordMovement[];
    progression_order: number;
  }

export interface SongSection {
    section_id: string;
    name: string;
    progressions: ChordProgression[];
    section_order: number;
}

export interface Song {
    title: string;
    song_id: string;
    sections: SongSection[];
    song_key: string;
    song_mode: string;
}

export interface ChordMovement {
    root_from: string
    root_to: string
    delta_up: string
    delta_down: string
    half_steps_up: number
    half_steps_down: number
}
