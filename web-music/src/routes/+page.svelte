<script lang="ts">
import { splitChord } from '$lib/chord-splitter';

// Example usage
console.log(splitChord('Am7/G'));
</script>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<p>{JSON.stringify(splitChord('Am7/G'))}</p>
<p>{JSON.stringify(splitChord('Em'))}</p>
<p>{JSON.stringify(splitChord('Asus2'))}</p>
