<script lang="ts">
    import API from "../lib/API";
    import { currentViewStore } from "../lib/store";
    import { View } from "../lib/types";

    let username = "user1234567";
    let password = "password";
</script>

<main>
    <div class="log-in-container">
        <i>Welcome Back!</i><br/>
        <input type="text" bind:value={username} />
        <input type="password" bind:value={password} />
        <hr />
        <button
            class="log-in-button"
            on:click={() => {
                API.user.logIn(username, password);
            }}>Log In</button
        >
        <button
            class="create-account-button"
            on:click={() => {
                currentViewStore.set(View.Register);
            }}>Create an Account</button
        >
    </div>
</main>

<style>
    .log-in-container {
        display: flex;
        flex-direction: column;
        padding: 16px;
    }
    .log-in-container button {
        margin: 8px auto 8px auto;
        width: 60%;
        min-width: 320px;
    }
    .log-in-container input {
        margin: 8px auto 8px auto;
        width: 60%;
        min-width: 320px;
    }
    .log-in-container hr {
        margin: 8px auto 8px auto;
        width: 60%;
        min-width: 320px;
    }
</style>
