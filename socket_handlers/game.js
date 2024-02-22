import { redisClient } from "../server.js";

export class Game {
    turn;
    grid = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];
    players = {
        X: null,
        O: null
    }

    static async create(player1Id, player2Id) {
        const gameName = (player1Id > player2Id) ? `${player1Id}_${player2Id}` : `${player2Id}_${player1Id}`;
        const newGame = new Game();
        newGame.turn = Math.random() < .5 ? "X" : "O";
        if (Math.random < .5) {
            newGame.players.X = player1Id;
            newGame.players.O = player2Id;
        } else {
            newGame.players.X = player2Id;
            newGame.players.O = player1Id;
        }
        console.log("turn: " + newGame.turn);
        await redisClient.set(`/games/${gameName}`, newGame.toString());
        await redisClient.set(`/users/gameRef/${player1Id}`, gameName);
        await redisClient.set(`/users/gameRef/${player2Id}`, gameName);
        return newGame;
    }

    static async get(userId) {
        const gameName = await redisClient.get(`/users/gameRef/${userId}`)
        if (gameName !== null) {
            const gameString = await redisClient.get(`/games/${gameName}`);
            if (gameString !== null) {
                const gameData = JSON.parse(gameString);
                const newGame = new Game();
                newGame.turn = gameData.turn;
                newGame.grid = gameData.grid;
                newGame.players = gameData.players;
                return newGame;
            } else {
                return null;
            }
        } else {
            return null
        }
    }

    async placeSymbol(x, y) {
        if (x >= 0 && y >= 0 && x < 3 && y < 3 && this.grid[x][y] === null) {
            this.grid[x][y] = this.turn;
            this.turn = (this.turn === "X" ? "O" : "X");
            const gameName = this.players.O > this.players.X ? `${this.players.O}_${this.players.X}` : `${this.players.X}_${this.players.O}`;
            await redisClient.set(`/games/${gameName}`, this.toString());
            return true;
        }
        return false;
    }

    checkForTurn(playerId) {
        return ((this.players.X.toString() === playerId.toString() && this.turn === "X") || (this.players.O.toString() === playerId.toString() && this.turn === "O"))
    }

    checkForVictor() {
        let spacesAvailable = false;
        for (let i = 0; i < 2; i++) {
            const symbol = (i === 0 ? "X" : "O");
            for (let x = 0; x < 3; x++) {
                if (this.grid[x][0] === symbol && this.grid[x][1] === symbol && this.grid[x][2] === symbol) {
                    return this.players[symbol];
                }
                if (!spacesAvailable && (this.grid[x][0] === null || this.grid[x][1] === null || this.grid[x][2] === null)) {
                    spacesAvailable = true;
                }
            }
            for (let y = 0; y < 3; y++) {
                if (this.grid[0][y] === symbol && this.grid[1][y] === symbol && this.grid[2][y] === symbol) {
                    return this.players[symbol];
                }
            }
            if (this.grid[1][1] === symbol && ((this.grid[0][0] === symbol && this.grid[2][2] === symbol) || (this.grid[2][0] === symbol && this.grid[0][2] === symbol))) {
                return this.players[symbol];
            }
        }
        return spacesAvailable ? null : -1;
    }

    toString() {
        return JSON.stringify({ grid: this.grid, turn: this.turn, players: this.players });
    }

    async delete() {
        const gameName = this.players.O > this.players.X ? `${this.players.O}_${this.players.X}` : `${this.players.X}_${this.players.O}`;
        await redisClient.del(`/games/${gameName}`);
        await redisClient.del(`/players/gameRef/${this.players.X.toString()}`);
        await redisClient.del(`/players/gameRef/${this.players.O.toString()}`);
    }
    static async delete(gameName) {
        const gameData = await redisClient.get(`/games/${gameName}`);
        const game = Game.parse(gameData);
        await redisClient.del(`/games/${gameName}`);
        await redisClient.del(`/players/gameRef/${game.players.X.toString()}`);
        await redisClient.del(`/players/gameRef/${game.players.O.toString()}`);
    }
}