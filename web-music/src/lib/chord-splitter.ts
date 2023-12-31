import type { Chord } from './types';

export function splitChord(chord: string): Chord {
    const pattern = /^([A-G][#b]?)(maj|min|m|dim|aug|sus|add)?(2|4|6|7|9|11|13)?([^/]*)\/?([A-G][#b]?)?$/;
    const match = pattern.exec(chord);

    if (!match) {
        return null as unknown as Chord; // Return null if the chord doesn't match the pattern
    }

    const [, root_note, quality, extension, extra, bassNote] = match;

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
        chord_id: '', // Add the missing chord_id property
        root_note,
        chord_type: chordType,
        extension,
        bass_note: bassNote,
        extra
    };
}

// Example usage
console.log(splitChord('Am7/G'));