<script lang="ts">
    import Lobby from "./views/Lobby.svelte";
    import LogIn from "./views/LogIn.svelte";
    import Register from "./views/Register.svelte";
    import Game from "./views/Game.svelte";
    import API from "./lib/API";
    import { onMount } from "svelte";
    import { View } from "./lib/types";
    import { currentViewStore, userStore } from "./lib/store";
    import { get } from "svelte/store";

    $: user = $userStore;

    onMount(async () => {
        await API.init();
    });
    $: {
        if (
            user !== null &&
            (get(currentViewStore) === View.LogIn ||
                get(currentViewStore) === View.Register)
        ) {
            currentViewStore.set(View.Lobby);
        }
    }
</script>

<main>
    {#if $currentViewStore === View.LogIn}
        <LogIn />
    {:else if $currentViewStore === View.Register}
        <Register />
    {:else if $currentViewStore === View.Lobby}
        <Lobby />
    {:else if $currentViewStore === View.Game}
        <Game />
    {/if}
</main>

<style>
</style>
