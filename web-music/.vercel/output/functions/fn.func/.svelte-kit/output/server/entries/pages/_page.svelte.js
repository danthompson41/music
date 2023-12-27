import { c as create_ssr_component, a as subscribe, b as createEventDispatcher, d as add_attribute, e as escape, f as each, v as validate_component } from "../../chunks/ssr.js";
import { w as writable } from "../../chunks/index.js";
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
const EditableText = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $editing, $$unsubscribe_editing;
  let { value = "" } = $$props;
  const editing = writable(false);
  $$unsubscribe_editing = subscribe(editing, (value2) => $editing = value2);
  createEventDispatcher();
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  $$unsubscribe_editing();
  return `${$editing ? `<input type="text" class="border p-1 rounded" autofocus placeholder="Input here please"${add_attribute("value", value, 0)}>` : `<span>${escape(value)}</span>`}`;
});
const css = {
  code: 'input[type="text"].svelte-1d5j0f8{width:100%;padding:0.5rem;border:1px solid #ccc;border-radius:4px}',
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let song = null;
  let current_song_index = null;
  let songs_list = [];
  let song_title = "";
  console.log("Updated song index");
  $$result.css.add(css);
  songs_list[current_song_index] = song;
  return `<div><button data-svelte-h="svelte-1jengm0">Add New Song</button> <ul>${each(songs_list, (song_list_song, i) => {
    return `<li><button>${escape(song_list_song.title)}</button> </li>`;
  })}</ul></div> <div>${validate_component(EditableText, "EditableText").$$render($$result, { value: song_title }, {}, {})} ${``}</div> `;
});
export {
  Page as default
};
