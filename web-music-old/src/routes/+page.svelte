<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { fmtNashvilleNotation } from '$lib/nashville-chord';
    import { SongAnalyzer } from '$lib/song-analyzer';
    import { storeData, retrieveData } from '$lib/indexdb';
    import { getSongs, addSong, updateSong } from '$lib/song-operations'; // Include add and update operations
    import { getSongDetails } from '$lib/get-song-details';
    import type { Song, Section, ChordProgression } from '$lib/interfaces';
    import EditableText from '$lib/EditableText.svelte'; // Custom component for editable text
    import { v4 as uuidv4 } from "uuid"

    let chord_progression = '';
    let key = '';
    let songs: any[] = [];
    let song: Song | null = null;
    let loading = true;
    let error: string | null = null;

    const dispatch = createEventDispatcher();

    // Function to load data from IndexedDB
    async function loadData() {
        key = (await retrieveData('key')) || '';
        chord_progression = (await retrieveData('chord_progression')) || '';
        songs = await getSongs();
        loading = false;
    }

    // Function to add a new song
    async function addNewSong() {
        const newSong: Song = {
            title: 'New Song', // Default title
            sections: [],
            song_id: '',
            key: 'C'
        };
        try {
            const new_song_id = await addSong({
                title: newSong.title,
                key: newSong.key,
                mode: 'Aeloian',
            });
            newSong.song_id = new_song_id;
            songs = [...songs, newSong];
            song = newSong;
        } catch (e) {
            error = (e as Error).message;
        }
    }

    async function fetchSongDetails(song_input: Song) {
        console.log(`Getting details for song with ID: ${song_input?.song_id}`);
        loading = true;
        try {
            const res = await getSongDetails(song_input?.song_id);
            song = res;
        } catch (e) {
            error = (e as Error).message;
        } finally {
            loading = false;
        }
    }

    async function saveSong() {
        if (song) {
            try {
                await updateSong(song);
                dispatch('update', song);
                song = {...song}; // Trigger reactivity
            } catch (e) {
                error = (e as Error).message;
            }
        }
    }

    function addSection() {
        if (song) {
            song.sections.push({
                name: 'Section',
                chord_progressions: [],
                order_in_song: song.sections.length,
                section_id: uuidv4(),
                key: song.key,
                mode: "Ionian"
            });
            song = {...song}; // Trigger reactivity
        }
    }

    function addProgression(section: Section) {
        if (song) {
            section.chord_progressions.push({ chords: [], progression_id: uuidv4() });
            song = {...song}; // Trigger reactivity
        }
    }

    function addChord(progression: ChordProgression) {
        // Implement addChord logic
    }

    // Load data on component mount
    onMount(() => {
        loadData();
    });

    // Reactively store data whenever key or chord_progression changes
    $: if (song) storeData('song', song);
    $: if (key) storeData('key', key);
    $: if (chord_progression) storeData('chord_progression', chord_progression);
</script>

<h1>Welcome to Chord Analyzer</h1>
<input bind:value={key} placeholder="Key" />
<input bind:value={chord_progression} placeholder="Chord Progression" />
{#if error}
	<p>{error}</p>
{:else if loading}
	<p>Loading song details...</p>
{:else if song}
	<div>
		<h1>{song.title}</h1>
		<!-- <h2>Key: {song.key}</h2> -->
        <p>{JSON.stringify(song)}</p>
		{#each song.sections as section (section.order_in_song)}
			<h4>Section: {section.name}</h4>
			<button on:click={() => addProgression(section)}>Add Progression</button>
			{#each section.chord_progressions as progression, i (i)}
				<h5>Progression {progression.progression_id}</h5>
				<button on:click={() => addChord(progression)}>Add Chord</button>
				{#each progression.chords as chord, i (i)}
					<p>Chord {i}: {chord.degree} {chord.chord_type}</p>
				{/each}
			{/each}

			<!-- {#each section.chord_progressions as progression, i (i)}
				<p>Progression {progression.progression_id}:</p>
				<ul>
					{#each progression.chords as chord, i (i)}
						<li>{fmtNashvilleNotation(chord)}</li>
					{/each}
				</ul>
			{/each} -->
		{/each}
	</div>
{:else}
	<p>Song not found.</p>
{/if}
<ul>
	{#each songs as song}
		<li>
			<button on:click={() => fetchSongDetails(song)}>
				{song.title} - {song.key}
			</button>
		</li>
	{/each}
</ul>
<ul>
	{#each new SongAnalyzer(key)
		.splitChordProgression(chord_progression)
		.nashvilleChords.map((x) => fmtNashvilleNotation(x)) as nashville_chord}
		<li>
			<p>
				{nashville_chord}
			</p>
		</li>
	{/each}
</ul>
<button on:click={addNewSong}>Add New Song</button>
<button on:click={addSection}>Add Section</button>
<button on:click={saveSong}>Save Song</button>
