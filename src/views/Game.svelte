<script lang="ts">
    import API from "../lib/API";
    import { gridStore, playerStore, userStore, turnStore } from "../lib/store";
</script>

<main>
    game<br />
    opponent: {$playerStore.O.id === $userStore?.id
        ? $playerStore.X.username
        : $playerStore.O.username}<br />
    {$turnStore !== null && $playerStore[$turnStore].id === $userStore?.id
        ? "Your turn!"
        : "Waiting for opponent's turn"}
    <div class="board">
        {#each $gridStore as row, x}
            <div class="row" style="display: flex; flex-direction:row">
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                {#each row as cell, y}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                        class="cell"
                        on:click={() => {
                            API.socketActions.takeTurn(x, y);
                        }}
                    >
                        {cell === null ? "" : cell}
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</main>

<style>
    .cell {
        height: calc(96px);
        width: 96px;
        border: 1px solid black;
        text-align: center;
        font-size: 64px;
        color: black;
    }
</style>
