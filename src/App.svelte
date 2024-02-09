<script lang="ts">
    import Lobby from "./views/Lobby.svelte";
    import LogIn from "./views/LogIn.svelte";
    import Register from "./views/Register.svelte";
    import Game from "./views/Game.svelte";
    import API from "./lib/API";
    import { onMount } from "svelte";
    import { type User, View } from "./lib/types";

    let currentView: View = View.LogIn;
    let user: null | User = null;

    const changeView = (view: View) => {
        currentView = view;
    };

    onMount(async () => {
        const result = await API.user.isLoggedIn();
        if (result.data.success) {
            user = result.data.user;
        }
    });
    
    $: {
        if (user !== null) {
            if (currentView === View.LogIn || currentView === View.Register) {
                currentView = View.Lobby;
            }
        }
    }
</script>

<main>
    {#if currentView === View.LogIn}
        <LogIn {changeView} />
    {:else if currentView === View.Register}
        <Register {changeView} />
    {:else if currentView === View.Lobby}
        <Lobby {user} {changeView} />
    {:else if currentView === View.Game}
        <Game {user} {changeView} />
    {/if}
</main>

<style>
</style>
