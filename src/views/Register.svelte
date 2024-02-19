<script lang="ts">
    import API from "../lib/API";
    import { currentViewStore } from "../lib/store";
    import { View } from "../lib/types";

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
    <input type="text" placeholder="Username" bind:value={username} /><br />
    <input type="password" placeholder="Password" bind:value={password} /><br />
    <input
        type="password"
        placeholder="Verify Password"
        bind:value={verifyPassword}
    /><br />
    <input type="text" placeholder="E-mail" bind:value={email} /><br />
    <button on:click={handleRegister}>Create Account</button>
    <button
        on:click={() => {
            currentViewStore.set(View.LogIn);
        }}>I already have an account!</button
    >
</main>

<style>
</style>
