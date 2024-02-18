<script lang="ts">
    import API from "../lib/API";

    export let user;
    export let changeView;
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
