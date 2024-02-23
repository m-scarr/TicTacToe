<script lang="ts">
    import API from "../lib/API";
    import { currentViewStore } from "../lib/store";
    import { View } from "../lib/types";

    let username = "";
    let password = "";
    let verifyPassword = "";
    let email = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleRegister = async () => {
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
        const result = await API.user.create(username, password, email);
        if (result) {
            alert("Register successful!");
            currentViewStore.set(View.LogIn);
        } else {
            alert("Register failed, the username or email may already be in use!");
        }
    };
</script>

<main>
    <div class="register-container">
        <i>Welcome!</i><br />
        <input type="text" placeholder="Username" bind:value={username} />
        <input
            type="password"
            placeholder="Password"
            bind:value={password}
        />
        <input
            type="password"
            placeholder="Verify Password"
            bind:value={verifyPassword}
        />
        <input type="text" placeholder="E-mail" bind:value={email} />
        <hr/>
        <button on:click={handleRegister}>Create Account</button>
        <button
            on:click={() => {
                currentViewStore.set(View.LogIn);
            }}>I already have an account!</button
        >
    </div>
</main>

<style>
    .register-container {
        display: flex;
        flex-direction: column;
        padding: 16px;
    }
    .register-container button {
        margin: 8px auto 8px auto;
        width: 60%;
        min-width: 320px;
    }
    .register-container input {
        margin: 8px auto 8px auto;
        width: 60%;
        min-width: 320px;
    }
    .register-container hr {
        margin: 8px auto 8px auto;
        width: 60%;
        min-width: 320px;
    }
</style>
