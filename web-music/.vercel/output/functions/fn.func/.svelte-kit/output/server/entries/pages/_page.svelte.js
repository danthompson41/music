import { c as create_ssr_component, e as escape, d as add_attribute, f as each } from "../../chunks/ssr.js";
import { v4 } from "uuid";
const notesSet = [
  ["C", "B#"],
  ["C#", "Db"],
  ["D", "D"],
  ["D#", "Eb"],
  ["E", "Fb"],
  ["F", "E#"],
  ["F#", "Gb"],
  ["G", "G"],
  ["G#", "Ab"],
  ["A", "A"],
  ["A#", "Bb"],
  ["B", "Cb"]
];
const modeIntervals = {
  Ionian: ["W", "W", "H", "W", "W", "W", "H"],
  Dorian: ["W", "H", "W", "W", "W", "H", "W"],
  Phrygian: ["H", "W", "W", "W", "H", "W", "W"],
  Lydian: ["W", "W", "W", "H", "W", "W", "H"],
  Mixolydian: ["W", "W", "H", "W", "W", "H", "W"],
  Aeolian: ["W", "H", "W", "W", "H", "W", "W"],
  Locrian: ["H", "W", "W", "H", "W", "W", "W"]
};
function findNoteInSet(note) {
  return notesSet.find((nt) => nt.includes(note));
}
function getScale(key, mode) {
  console.log("Getting scale for", key, mode);
  const keyTuple = findNoteInSet(key);
  if (!keyTuple) {
    return "Key root not found";
  }
  const scale = [keyTuple];
  for (const interval of modeIntervals[mode]) {
    const lastNoteIndex = notesSet.findIndex((nt) => nt === scale[scale.length - 1]);
    const nextIndex = (lastNoteIndex + (interval === "W" ? 2 : 1)) % 12;
    scale.push(notesSet[nextIndex]);
  }
  console.log(scale);
  return scale;
}
function getNashvilleNumber(note, scale) {
  const noteTuple = findNoteInSet(note);
  if (!noteTuple) {
    return "Note not found";
  }
  for (let i = 0; i < scale.length; i++) {
    if (scale[i].includes(noteTuple[0]) || scale[i].includes(noteTuple[1])) {
      return String(i + 1);
    }
  }
  let noteIndex = notesSet.findIndex((nt) => nt === noteTuple);
  while (!scale.some((s) => s === notesSet[noteIndex]) && noteIndex > 0) {
    noteIndex -= 1;
  }
  return `b${scale.findIndex((s) => s === notesSet[noteIndex]) + 2}`;
}
function chordToNashvilleChord(key, mode, chord) {
  console.log("Converting chord to Nashville notation:", chord, "in", key, mode);
  if (!chord) {
    return {};
  }
  const scale = getScale(key, mode);
  if (typeof scale === "string") {
    return {};
  }
  const number = getNashvilleNumber(chord.root_note, scale);
  let bassNote = void 0;
  if (chord.bass_note) {
    bassNote = getNashvilleNumber(chord.bass_note, scale);
  }
  const outChord = {
    degree: number,
    chord_type: chord.chord_type,
    extension: chord.extension,
    bass_note: bassNote,
    extra: chord.extra,
    chord_id: ""
  };
  console.log("Converted Chord:", outChord);
  return outChord;
}
function fmtNashvilleNotation(chord) {
  console.log(chord);
  let nashvilleNotation = chord.degree;
  let nashvilleType = "";
  switch (chord.chord_type) {
    case "minor":
      nashvilleType += "m";
      break;
    case "major":
      nashvilleType += "maj";
      break;
    case "dominant":
      nashvilleType += "dom";
      break;
    default:
      nashvilleType += chord.chord_type;
  }
  if (["1", "4", "5"].includes(chord.degree) && chord.chord_type === "major" && !chord.extension) {
    nashvilleType = "";
  }
  if (["2", "3", "6"].includes(chord.degree) && chord.chord_type === "minor" && !chord.extension) {
    nashvilleType = "";
  }
  if (chord.degree === "7" && chord.chord_type === "dominant" && !chord.extension) {
    nashvilleType = "";
  }
  nashvilleNotation += nashvilleType;
  if (chord.extension) {
    nashvilleNotation += chord.extension;
  }
  if (chord.extra) {
    nashvilleNotation += chord.extra;
  }
  if (chord.bass_note) {
    nashvilleNotation += "/" + chord.bass_note;
  }
  return nashvilleNotation;
}
function splitChord(chord) {
  const pattern = /^([A-G][#b]?)(maj|min|m|dim|aug|sus|add)?(2|4|6|7|9|11|13)?([^/]*)\/?([A-G][#b]?)?$/;
  const match = pattern.exec(chord);
  if (!match) {
    return null;
  }
  const [, root_note, quality, extension, extra, bassNote] = match;
  let chordType;
  if (quality === "m" || quality === "min") {
    chordType = "minor";
  } else if (quality === "maj" || quality === void 0 && extension === void 0) {
    chordType = "major";
  } else if (quality === void 0 && extension !== void 0) {
    chordType = "dominant";
  } else {
    chordType = quality;
  }
  return {
    chord_id: "",
    // Add the missing chord_id property
    root_note,
    chord_type: chordType,
    extension,
    bass_note: bassNote,
    extra
  };
}
console.log(splitChord("Am7/G"));
class ChordStreamAnalyzer {
  key;
  mode;
  chord_progression_id;
  chord_input;
  derived_chords;
  derived_nashville_chords;
  constructor(chord_stream, key, mode = "Ionian") {
    this.key = key;
    this.mode = mode;
    this.chord_progression_id = "";
    this.chord_input = chord_stream.trim();
    this.derived_chords = this.splitChordProgression(this.chord_input);
    this.derived_nashville_chords = this.chordProgressionToNashville(this.derived_chords);
  }
  chordProgressionToNashville(derived_chords) {
    console.log("Converting chord progression to Nashville notation:", derived_chords);
    if (derived_chords.length === 0) {
      return [];
    }
    if (derived_chords.length === 1 && derived_chords[0] === null) {
      return [];
    }
    return derived_chords.map(
      (chord) => chordToNashvilleChord(this.key, this.mode, chord)
    );
  }
  splitChordProgression(chordSequenceString) {
    console.log("Splitting chord progression:", chordSequenceString);
    return chordSequenceString.split(" ").map(splitChord);
  }
}
const css = {
  code: '.input-section.svelte-nkyj50{margin-bottom:1rem}label.svelte-nkyj50{display:block;margin-bottom:0.5rem}input[type="text"].svelte-nkyj50{width:100%;padding:0.5rem;border:1px solid #ccc;border-radius:4px}',
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let preChorusProgression;
  let chorusProgression;
  let outroProgression;
  let song = {
    title: "New Song",
    sections: [],
    song_id: v4()
  };
  let key = "G";
  let preChorusInput = "Em7 Asus2/F#";
  let chorusInput = "G G/A B7sus4 Em Gmaj7 A/F# Bm/E Gmaj7/A A/D";
  let outroInput = "Em7 Asus/F# G G/A B7sus4 Em Gmaj7 A/F# Bm/E Gmaj7/A A/D G(b5)/Db F#aug";
  $$result.css.add(css);
  preChorusProgression = new ChordStreamAnalyzer(preChorusInput, key, "Ionian");
  chorusProgression = new ChordStreamAnalyzer(chorusInput, key, "Ionian");
  outroProgression = new ChordStreamAnalyzer(outroInput, key, "Ionian");
  song.sections = [
    {
      section_id: v4(),
      name: "Pre-Chorus",
      chord_progressions: [preChorusProgression]
    },
    {
      section_id: v4(),
      name: "Chorus",
      chord_progressions: [chorusProgression]
    },
    {
      section_id: v4(),
      name: "Outro",
      chord_progressions: [outroProgression]
    }
  ];
  return `<h1 class="text-3xl font-bold">${escape(song.title)}</h1> <div class="input-section svelte-nkyj50"><label for="keyInput" class="svelte-nkyj50" data-svelte-h="svelte-fzjino">Key:</label> <input type="text" id="keyInput" class="svelte-nkyj50"${add_attribute("value", key, 0)}></div> <div class="input-section svelte-nkyj50"><label for="preChorus" class="svelte-nkyj50" data-svelte-h="svelte-1vse4tq">Pre-Chorus Progression:</label> <input type="text" id="preChorus" class="svelte-nkyj50"${add_attribute("value", preChorusInput, 0)}></div> <div class="input-section svelte-nkyj50"><label for="chorus" class="svelte-nkyj50" data-svelte-h="svelte-1iwjgk7">Chorus Progression:</label> <input type="text" id="chorus" class="svelte-nkyj50"${add_attribute("value", chorusInput, 0)}></div> <div class="input-section svelte-nkyj50"><label for="outro" class="svelte-nkyj50" data-svelte-h="svelte-vurh2t">Outro Progression:</label> <input type="text" id="outro" class="svelte-nkyj50"${add_attribute("value", outroInput, 0)}></div> ${each(song.sections, (section, i) => {
    return `<h2 class="text-2xl font-bold">${escape(section.name)}</h2> ${each(section.chord_progressions, (chord_progression, j) => {
      return `<h3 class="text-xl font-bold">${escape(chord_progression.chord_input)}</h3> ${each(chord_progression.derived_nashville_chords, (notation) => {
        return `<p>* ${escape(fmtNashvilleNotation(notation))}</p>`;
      })}`;
    })}`;
  })}`;
});
export {
  Page as default
};
