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

export const playerStore = writable<{ X: number, O: number }>({ X: -1, O: -1 })

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
    playerStore.set(game.players);
    turnStore.set(game.turn);
}

export const updateUser = (user: any) => {
    console.log(user);
    let highScore;
    let currentScore;
    for (let i = 0; i < 2; i++) {
        if (user.scores[i].highScore === 1) {
            highScore = user.scores[i].streak;
        } else {
            currentScore = user.scores[i].streak;
        }
    }
    userStore.set({
        id: user.id,
        username: user.username,
        profilePic: user.profilePic,
        highScore,
        currentScore
    });
}

