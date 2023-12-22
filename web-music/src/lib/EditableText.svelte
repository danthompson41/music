<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { writable } from 'svelte/store';
    export let value: string = '';
    const editing = writable(false);
    const dispatcher = createEventDispatcher<{
        save: string;
    }>();

    function handleBlur(): void {
        editing.set(false);
        if (value.length == 0) {value = "-Input here please-"}
        dispatcher('save', value);
    }

    function handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            editing.set(false);
            if (value.length == 0) {value = "-Input here please-"}
            dispatcher('save', value);
        }
    }
</script>

{#if $editing}
    <input
        type="text"
        bind:value
        on:blur={handleBlur}
        on:keydown={handleKeyDown}
        class="border p-1 rounded"
        autofocus
        placeholder="Input here please"
    />
{:else}
    <span on:dblclick={() => editing.set(true)}>{value}</span>
{/if}
