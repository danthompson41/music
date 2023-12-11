
import type { Chord, ChordProgression } from './interfaces';
import { chordToNashvilleChord } from './nashville-chord';
import { splitChord } from './chord-splitter';
import type { Song } from './interfaces';

export class SongAnalyzer {
    key: string;
    mode: string;
    song: Song;
    constructor(key: string, mode: string = 'Ionian') {
      this.key = key;
      this.mode = mode;
      this.song = {} as Song;
    }
  
    chordProgressionToNashville(chordProgression: Chord[]): Chord[] {
      return chordProgression.map(chord => chordToNashvilleChord(this.key, this.mode, chord));
    }
  
    splitChordProgression(chordSequenceString: string): ChordProgression {
      console.log('Splitting chord progression:', chordSequenceString);
      const chordProgression: Chord[] = chordSequenceString.split(' ').map(splitChord);
  
      return {
        key: this.key,
        mode: this.mode,
        chords: chordProgression,
        nashvilleChords: this.chordProgressionToNashville(chordProgression)
      };
    }
  }