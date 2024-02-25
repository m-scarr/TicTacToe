<script lang="ts">
    import { onMount } from "svelte";
    import API from "../lib/API";
    import { highScoresStore, updateHighScores, userStore } from "../lib/store";

    onMount(async () => {
        const result = await API.read.highScores();
        updateHighScores(result);
    });
</script>

<main>
    <button
        on:click={() => {
            API.socketActions.readyForGame();
        }}>Ready For Game</button
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
