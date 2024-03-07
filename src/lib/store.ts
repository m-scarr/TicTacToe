import { writable } from "svelte/store";
import { View, type GameGrid, type User, type Symbol } from "./types";
import { get } from "svelte/store";

export const currentViewStore = writable<View>(View.LogIn);

export const gridStore = writable<GameGrid>([
    [null, null, null],
    [null, null, null],
    [null, null, null]
]);

export const waitingForOpponentStore = writable<boolean>(false);

export const playerSymbolStore = writable<Symbol | null>(null);

export const playerStore = writable<{ X: { id: number, username: string }, O: { id: number, username: string } }>({ X: { id: -1, username: "" }, O: { id: -1, username: "" } });

export const turnStore = writable<Symbol | null>(null);

export const userStore = writable<null | User>(null);

export const highScoresStore = writable<{ username: string, streak: number }[]>([]);

export const updateHighScores = (highScores: any[]) => {
    highScoresStore.set([]);
    highScores.forEach((highScore) => {
        console.log(highScore);
        highScoresStore.update((val: any) => {
            return [...val, { username: highScore.user.username, streak: highScore.streak }];
        })
    })
}

export const updateGame = (game: any) => {
    gridStore.set(game.grid);
    const user = get(userStore);
    if (user && game.players.X.id === user.id) {
        playerSymbolStore.set("X");
    } else if (user && game.players.O.id === user.id) {
        playerSymbolStore.set("O");
    }
    playerStore.set(game.players);
    turnStore.set(game.turn);
}

export const updateUser = (user: any) => {
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

