<script lang="ts">
    import API from "../lib/API";

</script>

<main>
    <button
        on:click={() => {
            API.socketActions.readyForGame();
        }}>Ready For Game</button
    >
    lobby
    <button on:click={API.user.logOut}>Log Out</button>
</main>

<style>
</style>
