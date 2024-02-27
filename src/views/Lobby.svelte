<script lang="ts">
    import { onMount } from "svelte";
    import API from "../lib/API";
    import {
        highScoresStore,
        userStore,
        waitingForOpponentStore,
    } from "../lib/store";

    onMount(async () => {
        await API.user.isLoggedIn()
        await API.read.highScores();
    });
</script>

<main>
    <button
        on:click={API.socketActions.readyForGame}
        disabled={$waitingForOpponentStore}
        >{$waitingForOpponentStore
            ? "Waiting for Opponent's move..."
            : "Ready for Game!"}</button
    ><br />
    Current Score: {$userStore?.currentScore}<br />
    High Score: {$userStore?.highScore}<br />
    Alltime Highscores:<br />
    {#each $highScoresStore as item (item.username)}
        <li>{item.username} : {item.streak}</li>
    {/each}
    <button on:click={API.user.logOut}>Log Out</button>
</main>

<style>
</style>
