<script lang="ts">
    import API from "../lib/API";
    import { View } from "../lib/types";
    export let changeView: Function;

    let username = "";
    let password = "";
    let verifyPassword = "";
    let email = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleRegister = () => {
        if (username.length < 8) {
            alert("Your username must be atleast 8 characters!");
        }
        if (username.length > 255) {
            alert("Your username cannot exceed 255 characters!");
        }
        if (username.includes(" ")) {
            alert("Your username cannot contain spaces.");
        }
        if (password.length < 8) {
            alert("Your password must be atleast 8 characters!");
        }
        if (password !== verifyPassword) {
            alert("Your passwords don't match!");
            return;
        }
        if (!emailRegex.test(email)) {
            alert("You didn't enter a valid e-mail!");
            return;
        }
        API.user.create(username, password, email);
    };
</script>

<main>
    Tic Tac Toe
    <hr />
    username<input type="text" bind:value={username} /><br />
    password<input type="password" bind:value={password} /><br />
    verifyPassword<input type="password" bind:value={verifyPassword} /><br />
    email<input type="text" bind:value={email} /><br />
    <button on:click={handleRegister}>Create Account</button>
    <button
        on:click={() => {
            changeView(View.LogIn);
        }}>I already have an account!</button
    >
</main>

<style>
</style>
