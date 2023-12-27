<script lang="ts">
  import { ChordStreamAnalyzer } from "$lib/chord-input-analyzer";
  import { fmtNashvilleNotation } from "$lib/nashville-chord";
  import EditableText from "$lib/EditableText.svelte";
  import type { Song, SongSection, Chord } from "$lib/types";
  import { v4 as uuidv4 } from "uuid";

  let song: Song | null = null;
  let current_song_index: number | null = null;

  let songs_list: Song[] = [];

  // Function to add a new song
  async function addNewSong() {
    console.log("New Song");
    let new_song: Song = {
      title: "New Song",
      sections: [],
      song_id: uuidv4(),
    };
    songs_list = [...songs_list, new_song];
    console.log(songs_list);
    current_song_index = songs_list.length - 1;
    song = songs_list[current_song_index];
    console.log(current_song_index);
  }

  async function chooseSong(song_index: number) {
    console.log("Setting song");
    current_song_index = song_index;
    song = songs_list[song_index];
    console.log(song);
  }
  let song_title = "";

  async function updateTitle(event: CustomEvent) {
    song_title = event.detail;
    if (song) song.title = song_title;
    console.log(song_title);
    console.log(song);
  }

  async function addNewSection() {
    console.log("Adding new section");
    let new_section: SongSection = {
      section_id: uuidv4(),
      name: "New Section",
      chord_progressions: [],
    };
    if (song != null) song.sections = [...song.sections, new_section];
  }

  async function updateSection(event: CustomEvent, i: number) {
    let section_title = event.detail;
    if (song) song.sections[i].name = section_title;
    console.log(song?.sections[i]);
  }

  async function addNewChordProgression(i: number) {
    console.log("Adding new progression");
    let new_progression: ChordStreamAnalyzer = new ChordStreamAnalyzer(
      "C",
      "C"
    );
    if (song != null)
      song.sections[i].chord_progressions = [
        ...song.sections[i].chord_progressions,
        new_progression,
      ];
  }

  async function updateChordProgressionKey(
    key: string,
    i: number,
    j: number
  ) {
    if (song) song.sections[i].chord_progressions[j].key = key;
    song.sections[i].chord_progressions[j].update();
    console.log(song?.sections[i].chord_progressions);
  }

  async function updateChordProgression(
    chord_input: string,
    i: number,
    j: number
  ) {
    if (song) song.sections[i].chord_progressions[j].chord_input = chord_input;
    song.sections[i].chord_progressions[j].update();
    console.log(song?.sections[i].chord_progressions);
  }

  $: songs_list[current_song_index] = song;
  console.log("Updated song index");
  $: if (song != null) song_title = song?.title;
</script>

<div>
  <button on:click={addNewSong}>Add New Song</button>

  <ul>
    {#each songs_list as song_list_song, i}
      <li>
        <button on:click={() => chooseSong(i)}>{song_list_song.title}</button>
      </li>
    {/each}
  </ul>
</div>
<div>
  <EditableText value={song_title} on:save={(e) => updateTitle(e)}
  ></EditableText>
  {#if song != null}
    <ul>
      <li><button on:click={addNewSection}>Add Section</button></li>
      {#each song.sections as song_section, i}
        <li>
          <EditableText
            value={song_section.name}
            on:save={(e) => updateSection(e, i)}
          ></EditableText>
        </li>
        {#each song_section.chord_progressions as chord_progression, j}
          <ul>
            <li>
              <input type="text" bind:value={chord_progression.key} on:blur={updateChordProgressionKey(chord_progression.key,i,j)}/>
            </li>
            <li>
              <input type="text" bind:value={chord_progression.chord_input} on:blur={updateChordProgression(chord_progression.chord_input,i,j)}/>
            </li>
          </ul>
          {#each chord_progression.derived_nashville_chords as notation}
            <ul>
              <li>{fmtNashvilleNotation(notation)}</li>
            </ul>
          {/each}
        {/each}
        <button on:click={() => addNewChordProgression(i)}
          >Add New Progression</button
        >
      {/each}
    </ul>
  {/if}
</div>

<!-- 
  
  <div class="input-section">
    <label for="keyInput">Key:</label>
    <input type="text" id="keyInput" bind:value={key} />
  </div>
  
  <div class="input-section">
    <label for="preChorus">Pre-Chorus Progression:</label>
    <input type="text" id="preChorus" bind:value={preChorusInput} />
  </div>
  
  <div class="input-section">
    <label for="chorus">Chorus Progression:</label>
    <input type="text" id="chorus" bind:value={chorusInput} />
  </div>
  
  <div class="input-section">
    <label for="outro">Outro Progression:</label>
    <input type="text" id="outro" bind:value={outroInput} />
  </div>
  
  {#each song.sections as section, i}
    <h2 class="text-2xl font-bold">{section.name}</h2>
    {#each section.chord_progressions as chord_progression, j}
      <h3 class="text-xl font-bold">{chord_progression.chord_input}</h3>
      {#each chord_progression.derived_nashville_chords as notation}
        <p>* {fmtNashvilleNotation(notation)}</p>
      {/each}
    {/each}
  {/each} -->

<style>
  .input-section {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input[type="text"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
