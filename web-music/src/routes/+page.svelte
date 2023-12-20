<script lang="ts">
    import { ChordStreamAnalyzer } from '$lib/chord-input-analyzer';
    import { fmtNashvilleNotation } from '$lib/nashville-chord';
    import type { Song, SongSection } from '$lib/types';
    import { v4 as uuidv4 } from "uuid"
  
    let song: Song = {
      title: 'New Song',
      sections: [],
      song_id: uuidv4(),
    };
  
    let key = 'G'; // Key of the song
    let verseInput = 'Em7 Asus2/F#';
    let chorusInput = 'G G/A B7sus4 Em Gmaj7 A/F# Bm/E Gmaj7/A A/D';
    let outroInput = 'Em7 Asus/F# G G/A B7sus4 Em Gmaj7 A/F# Bm/E Gmaj7/A A/D G(b5)/Db F#aug';
  
    function createChordProgression(input: string): ChordStreamAnalyzer {
      return new ChordStreamAnalyzer(input, key, 'Ionian');
    }
  
    function updateSections() {
      song.sections = [
        { section_id: uuidv4(), name: 'Verse', chord_progressions: [createChordProgression(verseInput)] },
        { section_id: uuidv4(), name: 'Chorus', chord_progressions: [createChordProgression(chorusInput)] },
        { section_id: uuidv4(), name: 'Bridge', chord_progressions: [createChordProgression(outroInput)] }
      ];
    }
  
    updateSections();
  </script>
  
  <h1 class="text-3xl font-bold">{song.title}</h1>
  
  <div class="input-section">
    <label for="keyInput">Key:</label>
    <input type="text" id="keyInput" bind:value={key} on:input={updateSections} />
  </div>
  
  <div class="input-section">
    <label for="preChorus">Verse Progression:</label>
    <input type="text" id="preChorus" bind:value={verseInput} on:input={updateSections} />
  </div>
  
  <div class="input-section">
    <label for="chorus">Chorus Progression:</label>
    <input type="text" id="chorus" bind:value={chorusInput} on:input={updateSections} />
  </div>
  
  <div class="input-section">
    <label for="outro">Bridge Progression:</label>
    <input type="text" id="outro" bind:value={outroInput} on:input={updateSections} />
  </div>
  
  {#each song.sections as section}
    <h2 class="text-2xl font-bold">{section.name}</h2>
    {#each section.chord_progressions as chord_progression}
      <h3 class="text-xl font-bold">{chord_progression.chord_input}</h3>
      {#each chord_progression.derived_nashville_chords as derived_nashville_chord}
        <p>* {fmtNashvilleNotation(derived_nashville_chord)}</p>
      {/each}
    {/each}
  {/each}
  
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