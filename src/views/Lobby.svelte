<script lang="ts">
    import API from "../lib/API";

</script>

<main>
    <button
        on:click={() => {
            API.socketActions.testAction();
        }}>Test button</button
    >
    lobby
    <button on:click={API.user.logOut}>Log Out</button>
</main>

<style>
</style>
