<script lang="ts">
    import { ChordStreamAnalyzer } from '$lib/chord-input-analyzer';
    import { fmtNashvilleNotation } from '$lib/nashville-chord';
    import type { Song, SongSection, Chord } from '$lib/types';
    import { v4 as uuidv4 } from "uuid"
  
    let song: Song = {
      title: 'New Song',
      sections: [],
      song_id: uuidv4(),
    };
  
    let key = 'G'; // Key of the song
    let preChorusInput = 'Em7 Asus2/F#';
    let chorusInput = 'G G/A B7sus4 Em Gmaj7 A/F# Bm/E Gmaj7/A A/D';
    let outroInput = 'Em7 Asus/F# G G/A B7sus4 Em Gmaj7 A/F# Bm/E Gmaj7/A A/D G(b5)/Db F#aug';
    
    // Reactive statements to update chord progressions
    $: preChorusProgression = new ChordStreamAnalyzer(preChorusInput, key, 'Ionian');
    $: chorusProgression = new ChordStreamAnalyzer(chorusInput, key, 'Ionian');
    $: outroProgression = new ChordStreamAnalyzer(outroInput, key, 'Ionian');
    
    // Reactive statement to update the song sections whenever the chord progressions or key change
    $: song.sections = [
      { section_id: uuidv4(), name: 'Pre-Chorus', chord_progressions: [preChorusProgression] },
      { section_id: uuidv4(), name: 'Chorus', chord_progressions: [chorusProgression] },
      { section_id: uuidv4(), name: 'Outro', chord_progressions: [outroProgression] }
    ];
  </script>
  
  <h1 class="text-3xl font-bold">{song.title}</h1>
  
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