import { findSocketByUser, io } from "../server.js";
import scoreController from "../controllers/score.js";
import { Game } from "./game.js";

export default (socket) => {
    socket.on("exampleAction", (string) => {
        socket.emit("exampleActionResponse", `You said "${string}" to the server and the server and the server just wanted to say hi back.`)
    });

    socket.on("readyForGame", async () => {
        await socket.join("lobby");
        const lobbySockets = await io.in("lobby").fetchSockets();
        for (let i = 0; i < lobbySockets.length; i++) {
            const _socket = lobbySockets[i];
            if (_socket.id !== socket.id) {
                //check to make sure neither player already has a game
                await _socket.leave("lobby");
                await socket.leave("lobby");
                const newGame = await Game.create(
                    { id: _socket.request.user.id, username: _socket.request.user.username, displayName: _socket.request.user.displayName },
                    { id: socket.request.user.id, username: socket.request.user.username, displayName: socket.request.user.displayName });
                _socket.emit("gameFound", newGame);
                socket.emit("gameFound", newGame);
                break;
            }
        }
    });

    socket.on("takeTurn", async ({ x, y }) => {
        const game = await Game.get(socket.request.user.id);
        if (game.checkForTurn(socket.request.user.id)) {
            if (await game.placeSymbol(x, y)) {
                const victor = game.checkForVictor();
                const otherSocket = await findSocketByUser(game.players.X.id === socket.request.user.id ? game.players.O.id : game.players.X.id);
                if (victor !== null) {
                    socket.emit("gameOver", victor === -1 ? null : (victor.id === socket.request.user.id));
                    otherSocket.emit("gameOver", victor === -1 ? null : (victor.id === otherSocket.request.user.id));
                    if (victor !== -1) {
                        scoreController.incrementStreak(victor.id);
                        scoreController.endStreak(victor.id === socket.request.user.id ? otherSocket.request.user.id : socket.request.user.id);
                    }
                    await game.delete();
                } else {
                    socket.emit("updateGame", game);
                    otherSocket.emit("updateGame", game);
                }
            } else {
                //invalid move
                socket.emit("error", "Invalid move.");
            }
        } else {
            //not your turn
            socket.emit("error", "Not your turn.");
        }

    });
}
