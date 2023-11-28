<script lang="ts">
	import { onMount } from 'svelte';
	import { fmtNashvilleNotation } from '$lib/nashville-chord';
	import { SongAnalyzer } from '$lib/song-analyzer';
	import { storeData, retrieveData } from '$lib/indexdb'; // Adjust the path as needed

	let chord_progression = '';
	let key = '';

	// Function to load data from IndexedDB
	async function loadData() {
		key = (await retrieveData('key')) || '';
		chord_progression = (await retrieveData('chord_progression')) || '';
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
