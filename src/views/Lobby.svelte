<script lang="ts">
    import API from "../lib/API";
    import { userStore } from "../lib/store";
</script>

<main>
    <button
        on:click={() => {
            API.socketActions.readyForGame();
        }}>Ready For Game</button
    ><br />
    Current Score: {$userStore?.currentScore}<br />
    High Score: {$userStore?.highScore}<br />
    <button on:click={API.user.logOut}>Log Out</button>
</main>

<style>
</style>
