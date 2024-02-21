import { findSocketByUser, io } from "../server.js";
import { redisClient } from "../server.js";
import { Game } from "./game.js";

export default (socket) => {
    socket.on("exampleAction", (string) => {
        socket.emit("exampleActionResponse", `You said "${string}" to the server and the server and the server just wanted to say hi back.`)
    })

    socket.on("readyForGame", async () => {
        await socket.join("lobby");
        const lobbySockets = await io.in("lobby").fetchSockets();
        for (let i = 0; i < lobbySockets.length; i++) {
            const _socket = lobbySockets[i];
            if (_socket.id !== socket.id) {
                //check to make sure neither player already has a game
                const gameName = socket.request.user.id > _socket.request.user.id ? `${socket.request.user.id}_${_socket.request.user.id}` : `${_socket.request.user.id}_${socket.request.user.id}`;
                await _socket.leave("lobby");
                await socket.leave("lobby");
                const newGame = Game.create(_socket.request.user.id, socket.request.user.id);
                _socket.emit("gameFound", newGame);
                socket.emit("gameFound", newGame);
                await redisClient.set(`/games/${gameName}`, newGame.toString());
                await redisClient.set(`/users/gameRef/${_socket.request.user.id}`, gameName);
                await redisClient.set(`/users/gameRef/${socket.request.user.id}`, gameName);
                break;
            }
        }
    })
    socket.on("takeTurn", async ({ x, y }) => {
        const gameName = await redisClient.get(`/users/gameRef/${socket.request.user.id.toString()}`);
        if (gameName !== null) {
            const gameData = await redisClient.get(`/games/${gameName}`);
            if (gameData !== null) {
                const game = Game.parse(gameData);
                if (game.checkForTurn(socket.request.user.id)) {
                    if (game.placeSymbol(x, y)) {
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
                            redisClient.set(`/games/${gameName}`, game.toString());
                        }
                    } else {
                        //invalid move
                        socket.emit("error", "Invalid move.");
                    }
                } else {
                    //not your turn
                    socket.emit("error", "Not your turn.");
                }
            } else {
                //game not found
                socket.emit("error", "Game not found.");
            }
        } else {
            socket.emit("error", "Game reference not found.");
        }
    });
}
