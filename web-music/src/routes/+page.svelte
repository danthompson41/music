<script lang="ts">
	import { onMount } from 'svelte';
	import { fmtNashvilleNotation } from '$lib/nashville-chord';
	import { SongAnalyzer } from '$lib/song-analyzer';
	import { storeData, retrieveData } from '$lib/indexdb'; // Adjust the path as needed
	import { getSongs } from '$lib/get-songs';
	import { getSongDetails } from '$lib/get-song-details';
	import { get } from 'svelte/store';
	import type { Song } from '$lib/interfaces';
	let chord_progression = '';
	let key = '';
	let songs = [];
	let songId = 'your-song-id'; // Replace with actual song ID or fetch from route parameters
	let song: Song | null = null;
	let loading = true;
	let error: string | null = null;

	// Function to load data from IndexedDB
	async function loadData() {
		key = (await retrieveData('key')) || '';
		chord_progression = (await retrieveData('chord_progression')) || '';
		songs = (await getSongs()) || [];
	}

	async function fetchSongDetails(song_input: Song) {
		// Implementation of getting song details
		console.log(`Getting details for song with ID: ${song_input?.song_id}`);
		try {
			const res = getSongDetails(song_input?.song_id);
			console.log(res);
			song = await res;
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	// Load data on component mount
	onMount(() => {
		loadData();
	});

	// Reactively store data whenever key or chord_progression changes
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
		<!-- <h3>Band ID: {song.band_id}</h3> -->
		{#each song.sections as section (section.order_in_song)}
			<h4>Section: {section.name}</h4>
			{#each section.chord_progressions as progression, i (i)}
				<p>Progression {progression.progression_id}:</p>
                <ul>
                    {#each progression.chords as chord, i(i)}
                        <li> {fmtNashvilleNotation(chord)}</li>
                    {/each}
                </ul>
			{/each}
		{/each}
		<!-- {#each song.sections as section (section.order_in_song)}
            <div>
                <h4>Section: {section.name} (Order: {section.order_in_song})</h4>
                {#each section.chord_progressions as progression, i (i)}
                    <div>
                        <p>Progression {progression.order_in_section}:</p>
                        <ul>
                            {#each progression.chords as chord (chord.order_in_progression)}
                                <li>Chord {chord.degree} {chord.chord_type} (Order: {chord.order_in_progression})</li>
                            {/each}
                        </ul>
                    </div>
                {/each}
            </div>
        {/each} -->
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
