<script lang="ts">
    import API from "../lib/API";

    export let user;
    export let changeView;

</script>

<main>
    lobby
    <button on:click={API.user.logOut}>Log Out</button>
</main>

<style>
</style>
