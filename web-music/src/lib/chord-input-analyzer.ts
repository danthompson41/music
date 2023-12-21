import { chordToNashvilleChord } from "./nashville-chord";
import { splitChord } from "./chord-splitter";
import type { ChordProgression, Chord, NashvilleChord } from "./types";

export class ChordStreamAnalyzer implements ChordProgression {
  key: string;
  mode: string;
  chord_progression_id: string;
  chord_input: string;
  derived_chords: Chord[];
  derived_nashville_chords: NashvilleChord[];
  constructor(chord_stream: string, key: string, mode: string = "Ionian") {
    this.key = key;
    this.mode = mode;
    this.chord_progression_id = "";
    this.chord_input = chord_stream.trim();
    this.derived_chords = this.splitChordProgression(this.chord_input);
    this.derived_nashville_chords = this.chordProgressionToNashville(this.derived_chords as Chord[]);
  }

  chordProgressionToNashville(derived_chords: Chord[]): NashvilleChord[] {
    console.log("Converting chord progression to Nashville notation:", derived_chords);

    if (derived_chords.length === 0) {
      return [];
    }
    if (derived_chords.length === 1 && derived_chords[0] === null) {
      return [];
    }

    return derived_chords.map((chord) =>
      chordToNashvilleChord(this.key, this.mode, chord)
    );
  }

  splitChordProgression(chordSequenceString: string): Chord[] {
    console.log("Splitting chord progression:", chordSequenceString);
    return chordSequenceString.split(" ").map(splitChord);
  }
}
