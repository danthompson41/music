import type { Chord } from './interfaces';

export function splitChord(chord: string): Chord | string {
    const pattern = /^([A-G][#b]?)(maj|min|m|dim|aug|sus|add)?(2|4|6|7|9|11|13)?([^/]*)\/?([A-G][#b]?)?$/;
    const match = pattern.exec(chord);

    if (!match) {
        return "Invalid chord format";
    }

    const [, degree, quality, extension, extra, bassNote] = match;

    let chordType: string;
    if (quality === 'm' || quality === 'min') {
        chordType = 'minor';
    } else if (quality === 'maj' || (quality === undefined && extension === undefined)) {
        chordType = 'major';
    } else if (quality === undefined && extension !== undefined) {
        chordType = 'dominant';
    } else {
        chordType = quality;  // For augmented, diminished, etc.
    }

    return {
        chord_id: '', // Add a placeholder value for chord_id
        degree,
        chord_type: chordType,
        extension,
        bass_note: bassNote,
        extra
    } as Chord; // Cast the object to the Chord type
}

// Example usage
console.log(splitChord('Am7/G'));