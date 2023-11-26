import re
import pprint

from dataclasses import dataclass

mode_intervals = {
    'Ionian': ['W', 'W', 'H', 'W', 'W', 'W', 'H'],     # Major
    'Dorian': ['W', 'H', 'W', 'W', 'W', 'H', 'W'],
    'Phrygian': ['H', 'W', 'W', 'W', 'H', 'W', 'W'],
    'Lydian': ['W', 'W', 'W', 'H', 'W', 'W', 'H'],
    'Mixolydian': ['W', 'W', 'H', 'W', 'W', 'H', 'W'],
    'Aeolian': ['W', 'H', 'W', 'W', 'H', 'W', 'W'],   # Natural Minor
    'Locrian': ['H', 'W', 'W', 'H', 'W', 'W', 'W']
}

# Define notes
notes_sharps = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
notes_flats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
notes_set = [('C', 'B#'), ('C#', 'Db'), ('D', 'D'), ('D#', 'Eb'), ('E', 'Fb'), ('F', 'E#'), ('F#', 'Gb'), ('G', 'G'), ('G#', 'Ab'), ('A', 'A'), ('A#', 'Bb'), ('B', 'Cb')]

# Function to find the enharmonic equivalent in notes_set
def find_note_in_set(note: str) -> set[str]:
    for enharmonic_pair in notes_set:
        if note in enharmonic_pair:
            return enharmonic_pair
    return None

@dataclass
class Chord:
    root_note: str
    chord_type: str
    extension: str
    bass_note: str
    extra: str or None = None

@dataclass
class ChordProgression:
    key: str
    mode: str
    chords: list[Chord]
    nashville_chords: list[Chord]


def split_chord(chord):
    # Regular expression to match chord components including optional slash chords
    pattern = r'^([A-G][#b]?)(maj|min|m|dim|aug|sus|add)?(2|4|6|7|9|11|13)?([^/]*)/?([A-G][#b]?)?$'
    match = re.match(pattern, chord)

    if not match:
        return "Invalid chord format"

    root, quality, extension, extra, bass_note = match.groups()

    # Determine the chord type
    if quality in ['m', 'min']:
        chord_type = 'minor'
    elif quality == 'maj' or (quality == None and extension is None):
        chord_type = 'major'
    elif quality is None and extension != None:
        chord_type = 'dominant'
    else:
        chord_type = quality  # For augmented, diminished, etc.

    return Chord(root, chord_type, extension, bass_note, extra)

# Function to determine the Nashville number with flats and sharps
def get_nashville_number(note, scale):
    # Find both enharmonic equivalents in the scale
    note_tuple = find_note_in_set(note)
    for i, scale_tuple in enumerate(scale):
        if note_tuple[0] in scale_tuple or note_tuple[1] in scale_tuple:
            return str(i + 1)
    # If not in scale, find the closest lower note and denote as a flat
    note_index = notes_set.index(note_tuple)
    while notes_set[note_index] not in scale and note_index > 0:
        note_index -= 1
    return f'b{scale.index(notes_set[note_index]) + 2}'


def get_scale(key, mode, sharp=True):
    key_tuple = find_note_in_set(key)
    if not key_tuple:
        return "Key root not found"

    # Generate the scale for the selected mode
    scale = [key_tuple]
    for interval in mode_intervals[mode]:
        last_note_index = notes_set.index(scale[-1])
        next_index = (last_note_index + (2 if interval == 'W' else 1)) % 12
        scale.append(notes_set[next_index])
    print(scale)
    return scale

def chord_to_nashville_chord(key, mode, chord: Chord):
    print("Converting chord to Nashville notation:", chord, "in", key, mode)
    sharp = True if chord.root_note in notes_sharps else False
    scale = get_scale(key, mode, sharp)
    number = get_nashville_number(chord.root_note, scale)
    bass_note = None
    if chord.bass_note:
        bass_note = get_nashville_number(chord.bass_note, scale)

    out_chord = Chord(number, chord.chord_type, chord.extension, bass_note, chord.extra)
    print("Converted Chord:", out_chord)
    return out_chord

def fmt_nashville_notation(chord):
    # Format the chord notation
    nashville_notation = chord.root_note
    nashville_type = ""
    # Add the chord type
    if chord.chord_type == 'minor':
        nashville_type += 'm'
    elif chord.chord_type == 'major':
        # Major chords often don't have an explicit type in Nashville notation
        nashville_type += 'maj'
    elif chord.chord_type == 'dominant':
        nashville_type += 'dom'
    else:
        nashville_type += chord.chord_type  # For other types like 'dim', 'aug', etc.

    if chord.root_note in ('1', '4', '5') and chord.chord_type == 'major' and chord.extension == None:
        nashville_type = ""
    if chord.root_note in ('2', '3', '6') and chord.chord_type == 'minor' and chord.extension == None:
        nashville_type = ""
    if chord.root_note in ('7') and chord.chord_type == 'domininant':
        nashville_type = ""
    nashville_notation += nashville_type

    # Add the extension if any
    if chord.extension:
        nashville_notation += chord.extension
    
    if chord.extra:
        nashville_notation += chord.extra
    
    # Add the bass note if any
    if chord.bass_note:
        nashville_notation += '/' + chord.bass_note
    # print("Nashville notation:", nashville_notation)
    return nashville_notation

class SongAnalyzer(object):

    def __init__(self, key, mode='Ionian'):
        self.key = key
        self.mode = mode

    def chord_progression_to_nashville(self, chord_progression):
        return [chord_to_nashville_chord(self.key, self.mode, chord) for chord in chord_progression]

    def split_chord_progression(self, chord_sequence_string):
        chord_progression = []
        for chord_string in chord_sequence_string.split():
            chord = split_chord(chord_string)
            chord_progression.append(chord)
        return ChordProgression(self.key, self.mode, chord_progression, self.chord_progression_to_nashville(chord_progression))

# Yesterday
# for i in SongAnalyzer('F').split_chord_progression('F Em7 A7 Dm Dm/C Bb Gm C7 F F/E Dm G7 Bb F F').nashville_chords:
#     print(fmt_nashville_notation(i))

# Sun King
# for i in SongAnalyzer('C').split_chord_progression('C Cmaj7 Gm7 A7 F D7 C Em7 C C7 F').nashville_chords:
#     print(fmt_nashville_notation(i))

#Dragonball Durag
# for i in SongAnalyzer('G').split_chord_progression('G G/A B7sus4 Em Gmaj7 A/F# Bm/E Gmaj7/A A/D').nashville_chords:
#     print(fmt_nashville_notation(i))

# I Love Louis Cole
for i in SongAnalyzer('F#').split_chord_progression('F#maj7 F#m7 Bsus2 F# F#sus2 D6sus2 Bmaj7 F#').nashville_chords:
    print(fmt_nashville_notation(i))