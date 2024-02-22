import { writable } from "svelte/store";
import { View, type GameGrid, type User, type Symbol } from "./types";
import { get } from "svelte/store";

export const currentViewStore = writable<View>(View.LogIn);

export const gridStore = writable<GameGrid>([
    [null, null, null],
    [null, null, null],
    [null, null, null]
]);

export const waitingForOpponent = writable<boolean>(false);

export const playerSymbolStore = writable<Symbol | null>(null);

<<<<<<< HEAD
=======
export const playerStore = writable<{ X: number, O: number }>({ X: -1, O: -1 })

>>>>>>> 3d112c30f8f5c833ac93d95cc32064f736339ffe
export const turnStore = writable<Symbol | null>(null);

export const userStore = writable<null | User>(null);

export const updateGame = (game: any) => {
    gridStore.set(game.grid);
    const user = get(userStore);
    if (user && game.players.X === user.id) {
        playerSymbolStore.set("X");
    } else if (user && game.players.O === user.id) {
        playerSymbolStore.set("O");
    }
<<<<<<< HEAD
=======
    playerStore.set(game.players);
>>>>>>> 3d112c30f8f5c833ac93d95cc32064f736339ffe
    turnStore.set(game.turn);
}

