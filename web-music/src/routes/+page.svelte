<script lang="ts">
  import { writable } from 'svelte/store';
  import { ChordStreamAnalyzer } from "$lib/chord-input-analyzer";
  import { fmtNashvilleNotation } from "$lib/nashville-chord";
  import EditableText from "$lib/EditableText.svelte";
  import type { Song, SongSection, Chord } from "$lib/types";
  import { v4 as uuidv4 } from "uuid";

  // Stores
  const songs = writable<Song[]>([]);
  const currentSongIndex = writable<number | null>(null);
  const currentSong = writable<Song | null>(null);

  // Reactive variables
  let song_title = '';

  $: if ($currentSong) {
    song_title = $currentSong.title;
  }

  $: if ($currentSong?.song_key) {
    $currentSong.sections.forEach(section => {
      section.chord_progressions.forEach(progression => {
        progression.key = $currentSong?.song_key;
        progression.update();
      });
    });
  }
  
  // Functions
  function addNewSong() {
    const newSong: Song = {
      title: "New Song",
      sections: [],
      song_id: uuidv4(),
      song_key: 'C',
      song_mode: 'Ionian'
    };

    songs.update(allSongs => {
      allSongs.push(newSong);
      return allSongs;
    });

    currentSongIndex.set($songs.length - 1);
    currentSong.set(newSong);
  }

  function chooseSong(index: number) {
    currentSongIndex.set(index);
    currentSong.set($songs[index]);
  }

  function updateTitle(newTitle: string) {
    currentSong.update(song => {
      if (song) {
        song.title = newTitle;
      }
      return song;
    });
    songs.update(allSongs => {
      if (!$currentSongIndex) return allSongs;
      if (allSongs[$currentSongIndex]) {
        allSongs[$currentSongIndex].title = newTitle;
      }
      return allSongs;
    });
  }

  function addNewSection() {
    currentSong.update(song => {
      if (song) {
        let newSection: SongSection = {
          section_id: uuidv4(),
          name: "New Section",
          chord_progressions: []
        };
        song.sections.push(newSection);
        addNewChordProgression(song.sections.length - 1);
      }
      return song;
    });
  }

  function updateSection(newName: string, sectionIndex: number) {
    currentSong.update(song => {
      if (song && song.sections[sectionIndex]) {
        song.sections[sectionIndex].name = newName;
      }
      return song;
    });
  }

  function addNewChordProgression(sectionIndex: number) {
    currentSong.update(song => {
      if (song && song.sections[sectionIndex]) {
        let newProgression = new ChordStreamAnalyzer("", $currentSong?.song_key, $currentSong?.song_mode);
        song.sections[sectionIndex].chord_progressions.push(newProgression);
      }
      return song;
    });
  }

  function updateChordProgressionKey(newKey: string, sectionIndex: number, progressionIndex: number) {
    currentSong.update(song => {
      if (song && song.sections[sectionIndex]?.chord_progressions[progressionIndex]) {
        let progression = song.sections[sectionIndex].chord_progressions[progressionIndex];
        progression.key = newKey;
        progression.update(); // Assuming update is a method of ChordStreamAnalyzer
      }
      return song;
    });
  }

  function updateChordProgression(chordInput: string, sectionIndex: number, progressionIndex: number) {
    currentSong.update(song => {
      if (song && song.sections[sectionIndex]?.chord_progressions[progressionIndex]) {
        let progression = song.sections[sectionIndex].chord_progressions[progressionIndex];
        progression.chord_input = chordInput;
        progression.update(); // Assuming update is a method of ChordStreamAnalyzer
      }
      return song;
    });
  }


</script>

<div>
  <button on:click={addNewSong}>Add New Song</button>
  <ul>
    {#each $songs as song, i}
      <li>
        <button on:click={() => chooseSong(i)}>{song.title}</button>
      </li>
    {/each}
  </ul>
</div>

<div>
  <EditableText value={song_title} on:save={(e) => updateTitle(e.detail)}></EditableText>
  {#if $currentSong}
  <p>input key: <input type="text" bind:value={$currentSong.song_key} /></p>
  <p>input mode: <input type="text" bind:value={$currentSong.song_mode} /></p>
    <ul>
      <li><button on:click={addNewSection}>Add Section</button></li>
      {#each $currentSong.sections as section, sectionIndex}
        <li>
          <EditableText value={section.name} on:save={(e) => updateSection(e.detail, sectionIndex)}></EditableText>
          {#each section.chord_progressions as progression, progressionIndex}
            <ul>
              <!-- <li>
                <input type="text" bind:value={progression.key} on:blur={() => updateChordProgressionKey(progression.key, sectionIndex, progressionIndex)} />
              </li> -->
              <li>
                <input type="text" bind:value={progression.chord_input} on:blur={() => updateChordProgression(progression.chord_input, sectionIndex, progressionIndex)} />
              </li>
            </ul>
            {#each progression.derived_nashville_chords as notation}
              <ul>
                <li>{fmtNashvilleNotation(notation)}</li>
              </ul>
            {/each}
          {/each}
          <button on:click={() => addNewChordProgression(sectionIndex)}>Add New Progression</button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .input-section {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input[type="text"] {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
