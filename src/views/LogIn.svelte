<script lang="ts">
    import API from "../lib/API";
    export let changeView: Function;
    import { View } from "../lib/types";

    let username = "user1234567";
    let password = "pass1";
</script>

<main>
    <button on:click={() => {
        API.socketActions.testAction()
    }}>Test button</button>

    Tic Tac Toe
    <hr />
    <input type="text" bind:value={username} /><br />
    <input type="text" bind:value={password} /><br />
    <button
        on:click={() => {
            API.user.logIn(username, password);
        }}>Log In</button
    >
    <button
        on:click={() => {
            changeView(View.Register);
        }}>Create an Account</button
    >
</main>

<style>
</style>
