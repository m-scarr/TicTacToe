import { Socket } from "socket.io-client";
import { currentViewStore, playerStore, updateGame, userStore, waitingForOpponentStore } from "../../store";
import { View } from "../../types";
import { get } from "svelte/store";
//import messageSocketHandlers from "./message.js";

export default (socket: Socket) => {
    //const message = messageSocketHandlers(socket);
    socket.on("exampleActionResponse", (res: any) => {
        alert(res);
    });

    socket.on("newLogIn", () => {
        userStore.set(null);
        alert("This user has logged in in another location!");
        window.location.href = "/";
    });

    socket.on("gameFound", (game) => {
        waitingForOpponentStore.set(false);
        updateGame(game);
        currentViewStore.set(View.Game);
    });

    socket.on("updateGame", (game) => {
        updateGame(game);
    })

    socket.on("gameOver", (victory) => {
        alert(victory === true ? "You won!" : victory === false ? "You lost..." : "Cat's game!");
        currentViewStore.set(View.Lobby);
    })

    socket.on("error", (err) => {
        alert(err);
        if (err === "Your opponent left.") {
            currentViewStore.set(View.Lobby);
        }
    })

    const actions = {
        //...message
        testAction: () => {
            socket.emit("exampleAction", "Hello!");
        },
        readyForGame: () => {
            socket.emit("readyForGame", null);
            waitingForOpponentStore.set(true);

        },
        takeTurn: (x: number, y: number) => {
            const players = get(playerStore);
            socket.emit("takeTurn", { player1Id: players.X, player2Id: players.O, x, y })
        }
    }

    return actions;
}