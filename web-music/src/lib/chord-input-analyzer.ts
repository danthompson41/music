import { chordToNashvilleChord } from "./nashville-chord";
import { splitChord } from "./chord-splitter";
import type {
  ChordProgression,
  Chord,
  NashvilleChord,
  ChordMovement,
} from "./types";
import { v4 as uuidv4 } from "uuid";
export class ChordStreamAnalyzer implements ChordProgression {
  key: string;
  mode: string;
  chord_progression_id: string;
  chord_input: string;
  derived_chords: Chord[];
  derived_nashville_chords: NashvilleChord[];
  derived_movements: ChordMovement[];
  constructor(chord_stream: string, key: string, mode: string = "Ionian") {
    this.key = key;
    this.mode = mode;
    this.chord_progression_id = uuidv4();
    this.chord_input = chord_stream.trim();
    this.derived_chords = this.splitChordProgression(this.chord_input);
    this.derived_nashville_chords = this.chordProgressionToNashville(
      this.derived_chords as Chord[]
    );
    this.derived_movements = this.nashvilleChordsToMovement(
      this.derived_nashville_chords
    );
  }

  chordProgressionToNashville(derived_chords: Chord[]): NashvilleChord[] {
    console.log(
      "Converting chord progression to Nashville notation:",
      derived_chords
    );

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

  nashvilleChordsToMovement(
    nashville_chords: NashvilleChord[]
  ): ChordMovement[] {
    console.log("Extracting movements");
    if (nashville_chords.length < 2) {
      return [];
    }
    let movements: ChordMovement[] = [];
    for (let i = 0; i < nashville_chords.length - 1; i++) {
      movements.push(
        this.extract_movement(nashville_chords[i], nashville_chords[i + 1])
      );
    }
    return movements;
  }

  convert_degree_to_number(degree: string): number {
    let degree_map: Map<string, number> = new Map();
    degree_map.set("1", 0);
    degree_map.set("b2", 1);
    degree_map.set("2", 2);
    degree_map.set("b3", 3);
    degree_map.set("3", 4);
    degree_map.set("4", 5);
    degree_map.set("b5", 6);
    degree_map.set("5", 7);
    degree_map.set("b6", 8);
    degree_map.set("6", 9);
    degree_map.set("b7", 10);
    degree_map.set("7", 11);
    if (degree_map.has(degree)) {
      return degree_map.get(degree) as unknown as number;
    } else {
      return -1
    }
  }

  convert_number_to_degree(number: number): string {
    let number_list =  ["Unison", "Half Step", "Second", "Minor Third", "Major Third", "Fourth", "Tri-Tone", "Fifth", "Minor Sixth", "Major Sixth", "Minor Seventh", "Major Seventh"]
    return number_list[number % 12]
  }

  extract_movement(from: NashvilleChord, to: NashvilleChord) {
    let from_number :number = this.convert_degree_to_number(from.degree);
    let to_number : number = this.convert_degree_to_number(to.degree);
    console.log("From", from_number, "To", to_number);
    let up = 0;
    let down = 0;
    if (from_number < to_number) {
      console.log("From < to");
      up = to_number - from_number;
      down = 12 - up;
      console.log(up, down);
    } else {
      console.log("From >= to");
      down = from_number - to_number;
      up = 12 - down;
      console.log(up, down);
    }
    let movement: ChordMovement = {
      root_from: from.degree,
      root_to: to.degree,
      delta_up: this.convert_number_to_degree(up),
      delta_down: this.convert_number_to_degree(down),
      half_steps_up: up % 12,
      half_steps_down: down % 12
    };
    console.log("Chord movement:", movement)
    return movement;
  }

  splitChordProgression(chordSequenceString: string): Chord[] {
    console.log("Splitting chord progression:", chordSequenceString);
    return chordSequenceString.split(" ").map(splitChord);
  }

  update() {
    this.chord_input = this.chord_input.trim();
    this.derived_chords = this.splitChordProgression(this.chord_input);
    this.derived_nashville_chords = this.chordProgressionToNashville(
      this.derived_chords as Chord[]
    );
    this.derived_movements = this.nashvilleChordsToMovement(
      this.derived_nashville_chords
    );
  }
}
