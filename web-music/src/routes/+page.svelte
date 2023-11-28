<script lang="ts">
import { splitChord } from '$lib/chord-splitter';
import { getScale, getNashvilleNumber, chordToNashvilleChord, fmtNashvilleNotation} from '$lib/nashville-chord';
import { SongAnalyzer } from '$lib/song-analyzer';

let chord_progression = '';
let key = '';
</script>
<h1>Welcome to Chord Analyzer</h1>
<input bind:value={key} placeholder="Key" />
<input bind:value={chord_progression} placeholder="Chord Progression" />

<ul>
    {#each new SongAnalyzer(key).splitChordProgression(chord_progression).nashvilleChords.map((x) => fmtNashvilleNotation(x)) as nashville_chord}
		<li>
			<p>
			{nashville_chord} 
			</p>
		</li>
	{/each}
</ul>

