export interface Chord {
    root: string;
    chordType: string;
    extension: string | undefined;
    bassNote: string | undefined;
    extra: string | undefined;
}

export interface ChordProgression {
    key: string;
    mode: string;
    chords: Chord[];
    nashvilleChords: Chord[];
  }