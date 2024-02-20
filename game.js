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

    static create(player1Id, player2Id) {
        const newGame = new Game();
        newGame.turn = Math.random() < .5 ? "X" : "O";
        if (Math.random < .5) {
            newGame.players.X = player1Id;
            newGame.players.O = player2Id;
        } else {
            newGame.players.X = player2Id;
            newGame.players.O = player1Id;
        }
        return newGame;
    }

    static parse(gameString) {
        const gameData = JSON.parse(gameString);
        const newGame = new Game();
        newGame.turn = gameData.turn;
        newGame.grid = gameData.grid;
        newGame.players = gameData.players;
        return newGame;
    }

    placeSymbol(x, y) {
        if (x >= 0 && y >= 0 && x < 3 && y < 3 && this.grid[x][y] === null) {
            this.grid[x][y] = this.turn;
            this.turn = (this.turn === "X" ? "O" : "X");
            return true;
        }
        return false;
    }

    checkForTurn(playerId) {
        return ((this.players.X === playerId && this.turn === "X") || (this.players.O === playerId && this.turn === "O"))
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
}
