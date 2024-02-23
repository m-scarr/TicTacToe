import { findSocketByUser, io } from "../server.js";
import { redisClient } from "../server.js";
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
                const newGame = await Game.create(_socket.request.user.id, socket.request.user.id);
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
                const otherSocket = await findSocketByUser(game.players.X === socket.request.user.id ? game.players.O : game.players.X);
                if (victor !== null) {
                    socket.emit("gameOver", victor === -1 ? null : (victor === socket.request.user.id));
                    otherSocket.emit("gameOver", victor === -1 ? null : (victor === otherSocket.request.user.id));
                    //add db interaction
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
