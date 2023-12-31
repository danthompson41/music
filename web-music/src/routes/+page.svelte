<script lang="ts">
  import { writable } from "svelte/store";
  import { ChordStreamAnalyzer } from "$lib/chord-input-analyzer";
  import { fmtNashvilleNotation } from "$lib/nashville-chord";
  import EditableText from "$lib/EditableText.svelte";
  import type { Song, SongSection, Chord } from "$lib/types";
  import { v4 as uuidv4 } from "uuid";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  // Stores
  const songs = writable<Song[]>([]);
  const currentSongIndex = writable<number | null>(null);
  const currentSong = writable<Song | null>(null);

  onMount(async () => {
    if (browser) {
      const response = await fetch("/api/songs");
      const data = await response.json();
      songs.update((allSongs) => {
        data.forEach((song: Song) => {
          for (let i = 0; i < song.sections.length; i++) {
            song.sections[i].progressions.forEach((progression, j) => {
              song.sections[i].progressions[j] = new ChordStreamAnalyzer(
                progression.chord_input,
                song.song_key,
                song.song_mode,
                progression.chord_progression_id
              );
            });
          }
          allSongs.push(song);
        });
        // allSongs = data;
        console.log(allSongs);
        return allSongs;
      });
    }
  });
  // Reactive variables
  let song_title = "";

  $: if ($currentSong) {
    song_title = $currentSong.title;
    $currentSong.sections.forEach((section) => {
      if (!section.progressions) return;
      section.progressions.forEach((progression, i) => {
        section.progressions[i] = new ChordStreamAnalyzer(
          progression.chord_input,
          $currentSong?.song_key,
          $currentSong?.song_mode,
          progression.chord_progression_id
        );
        return progression;
      });
    });
    console.log("Debug currentSong:", $currentSong);
  }

  $: if ($currentSong?.song_key) {
    console.log($currentSong);
    $currentSong.sections.forEach((section) => {
      if (!section.progressions) return;
      section.progressions.forEach((progression) => {
        progression = new ChordStreamAnalyzer(
          progression.chord_input,
          $currentSong?.song_key,
          $currentSong?.song_mode
        );
        progression.key = $currentSong?.song_key;
        console.log("Debug progressions:", progression);
        progression.update();
      });
    });
  }

  // Functions
  async function addNewSong() {
    const newSong: Song = {
      title: "New Song",
      sections: [],
      song_id: uuidv4(),
      song_key: "C",
      song_mode: "Ionian",
    };
    const response = fetch("/api/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSong),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res;
      })
      .then((res) => res.json());
    songs.update((allSongs) => {
      allSongs.push(newSong);
      console.log(allSongs);
      return allSongs;
    });

    currentSongIndex.set($songs.length - 1);
    currentSong.set(newSong);
  }

  function chooseSong(index: number) {
    currentSongIndex.set(index);
    currentSong.set($songs[index]);
    console.log("Current song---", $currentSong);
  }

  function deleteProgression(id: string) {
    console.log("Delete progression", id);
    const response = fetch("/api/progressions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({"chord_progression_id":id}),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res;
      })
      .then((res) => res.json());
  }

  function deleteSection(id: string) {
    console.log("Delete section", id);
    const response = fetch("/api/sections", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({"section_id":id}),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res;
      })
      .then((res) => res.json());
  }

  function updateTitle(newTitle: string) {
    currentSong.update((song) => {
      if (song) {
        song.title = newTitle;
      }
      const response = fetch("/api/songs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(song),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          return res;
        })
        .then((res) => res.json());
      return song;
    });

    songs.update((allSongs) => {
      if (!$currentSongIndex) return allSongs;
      if (allSongs[$currentSongIndex]) {
        allSongs[$currentSongIndex].title = newTitle;
      }
      return allSongs;
    });
  }

  function addNewSection() {
    currentSong.update((song) => {
      if (song) {
        let newSection: SongSection = {
          section_id: uuidv4(),
          name: "New Section",
          progressions: [],
          section_order: song.sections.length,
        };
        song.sections.push(newSection);
        addNewChordProgression(song.sections.length - 1);
      }
      return song;
    });
  }

  function updateSection(newName: string, sectionIndex: number) {
    currentSong.update((song) => {
      if (song && song.sections[sectionIndex]) {
        song.sections[sectionIndex].name = newName;
      }
      return song;
    });
  }

  function addNewChordProgression(sectionIndex: number) {
    currentSong.update((song) => {
      if (song && song.sections[sectionIndex]) {
        let newProgression = new ChordStreamAnalyzer(
          "",
          $currentSong?.song_key,
          $currentSong?.song_mode,
          null
        );
        song.sections[sectionIndex].progressions.push(newProgression);
      }
      return song;
    });
  }

  function updateChordProgressionKey(
    newKey: string,
    sectionIndex: number,
    progressionIndex: number
  ) {
    currentSong.update((song) => {
      if (song && song.sections[sectionIndex]?.progressions[progressionIndex]) {
        let progression =
          song.sections[sectionIndex].progressions[progressionIndex];
        progression.key = newKey;
        progression.update(); // Assuming update is a method of ChordStreamAnalyzer
      }
      return song;
    });
  }

  function updateChordProgression(
    chordInput: string,
    sectionIndex: number,
    progressionIndex: number
  ) {
    currentSong.update((song) => {
      if (song && song.sections[sectionIndex]?.progressions[progressionIndex]) {
        let progression =
          song.sections[sectionIndex].progressions[progressionIndex];
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
  <EditableText value={song_title} on:save={(e) => updateTitle(e.detail)}
  ></EditableText>
  {#if $currentSong}
    <p>input key: <input type="text" bind:value={$currentSong.song_key} /></p>
    <p>input mode: <input type="text" bind:value={$currentSong.song_mode} /></p>
    <ul>
      <li><button on:click={addNewSection}>Add Section</button></li>
      {#each $currentSong.sections as section, sectionIndex}
        <li>
          <EditableText
            value={section.name}
            on:save={(e) => updateSection(e.detail, sectionIndex)}
          ></EditableText>
          <button
          on:click={() =>
            deleteSection(section.section_id)}
        >
          Delete {section.section_id}
        </button>
          {#if section.progressions.length != 0}
            {#each section.progressions as progression, progressionIndex}
              <ul>
                <li>
                  <p>Progression id: {progression.chord_progression_id}</p>
                  <p>Section id: {section.section_id}</p>
                  <input
                    type="text"
                    bind:value={progression.chord_input}
                    on:blur={() =>
                      updateChordProgression(
                        progression.chord_input,
                        sectionIndex,
                        progressionIndex
                      )}
                  />
                  <button
                    on:click={() =>
                      deleteProgression(progression.chord_progression_id)}
                  >
                    Delete {progression.chord_progression_id}
                  </button>
                </li>
              </ul>
              {#each progression.derived_nashville_chords as notation}
                <ul>
                  <li>{fmtNashvilleNotation(notation)}</li>
                </ul>
              {/each}
            {/each}
          {/if}
          <button on:click={() => addNewChordProgression(sectionIndex)}>
            Add New Progression
          </button>
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
