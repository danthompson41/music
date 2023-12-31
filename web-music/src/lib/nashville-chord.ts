import type { Chord, NashvilleChord } from './types';

interface NoteTuple {
	[index: number]: string;
}

const notesSet: NoteTuple[] = [
	['C', 'B#'],
	['C#', 'Db'],
	['D', 'D'],
	['D#', 'Eb'],
	['E', 'Fb'],
	['F', 'E#'],
	['F#', 'Gb'],
	['G', 'G'],
	['G#', 'Ab'],
	['A', 'A'],
	['A#', 'Bb'],
	['B', 'Cb']
];

const modeIntervals: { [key: string]: string[] } = {
	Ionian: ['W', 'W', 'H', 'W', 'W', 'W', 'H'],
	Dorian: ['W', 'H', 'W', 'W', 'W', 'H', 'W'],
	Phrygian: ['H', 'W', 'W', 'W', 'H', 'W', 'W'],
	Lydian: ['W', 'W', 'W', 'H', 'W', 'W', 'H'],
	Mixolydian: ['W', 'W', 'H', 'W', 'W', 'H', 'W'],
	Aeolian: ['W', 'H', 'W', 'W', 'H', 'W', 'W'],
	Locrian: ['H', 'W', 'W', 'H', 'W', 'W', 'W']
};

function findNoteInSet(note: string): NoteTuple | undefined {
	return notesSet.find((nt) => nt.includes(note));
}

export function getScale(key: string, mode: string): NoteTuple[] | string {
  console.log('Getting scale for', key, mode);
	const keyTuple = findNoteInSet(key);
	if (!keyTuple) {
		return 'Key root not found';
	}

	const scale: NoteTuple[] = [keyTuple];
	for (const interval of modeIntervals[mode]) {
		const lastNoteIndex = notesSet.findIndex((nt) => nt === scale[scale.length - 1]);
		const nextIndex = (lastNoteIndex + (interval === 'W' ? 2 : 1)) % 12;
		scale.push(notesSet[nextIndex]);
	}
	console.log(scale);
	return scale;
}

export function getNashvilleNumber(note: string, scale: NoteTuple[]): string {
	const noteTuple = findNoteInSet(note);
	if (!noteTuple) {
		return 'Note not found';
	}

	for (let i = 0; i < scale.length; i++) {
		if (scale[i].includes(noteTuple[0]) || scale[i].includes(noteTuple[1])) {
			return String(i + 1);
		}
	}

	// If not in scale, find the closest lower note and denote as a flat
	let noteIndex = notesSet.findIndex((nt) => nt === noteTuple);
	while (!scale.some((s) => s === notesSet[noteIndex]) && noteIndex > 0) {
		noteIndex -= 1;
	}
	return `b${scale.findIndex((s) => s === notesSet[noteIndex]) + 2}`;
}

export function chordToNashvilleChord(key: string, mode: string, chord: Chord): NashvilleChord{
	console.log('Converting chord to Nashville notation:', chord, 'in', key, mode);
	if (!chord) {
		return {} as NashvilleChord;
	}
	const scale = getScale(key, mode);
	if (typeof scale === 'string') {
		return {} as NashvilleChord;
	}

	const number = getNashvilleNumber(chord.root_note, scale);
	let bassNote: string | undefined = undefined;
	if (chord.bass_note) {
		bassNote = getNashvilleNumber(chord.bass_note, scale);
	}

	const outChord: NashvilleChord = {
		degree: number,
		chord_type: chord.chord_type,
		extension: chord.extension,
		bass_note: bassNote,
		extra: chord.extra,
		chord_id: ''
	};

	console.log('Converted Chord:', outChord);
	return outChord;
}

export function fmtNashvilleNotation(chord: NashvilleChord): string {
	let nashvilleNotation = chord.degree;
	let nashvilleType = '';

	switch (chord.chord_type) {
		case 'minor':
			nashvilleType += 'm';
			break;
		case 'major':
			nashvilleType += 'maj';
			break;
		case 'dominant':
			nashvilleType += 'dom';
			break;
		default:
			nashvilleType += chord.chord_type;
	}

	if (['1', '4', '5'].includes(chord.degree) && chord.chord_type === 'major' && !chord.extension) {
		nashvilleType = '';
	}
	if (['2', '3', '6'].includes(chord.degree) && chord.chord_type === 'minor' && !chord.extension) {
		nashvilleType = '';
	}
	if (chord.degree === '7' && chord.chord_type === 'dominant' && !chord.extension) {
		nashvilleType = '';
	}

	nashvilleNotation += nashvilleType;

	if (chord.extension) {
		nashvilleNotation += chord.extension;
	}

	if (chord.extra) {
		nashvilleNotation += chord.extra;
	}

	if (chord.bass_note) {
		nashvilleNotation += '/' + chord.bass_note;
	}

	return nashvilleNotation;
}
