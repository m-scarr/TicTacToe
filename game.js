function parseJSONRecursively(jsonString) {
    return JSON.parse(jsonString, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            return Object.entries(value).reduce((acc, [nestedKey, nestedValue]) => {
                acc[nestedKey] = parseJSONRecursively(nestedValue);
                return acc;
            }, {});
        } else if (Array.isArray(value)) {
            return value.map(element => parseJSONRecursively(element));
        } else {
            return value;
        }
    });
}


class Game {
    turn;
    grid = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];
    players = {
        X: null,
        Y: null
    }

    static create(player1Id, player2Id) {
        const newGame = new Game();
        newGame.turn = Math.random() < .5 ? "X" : "O";
        if (Math.random < .5) {
            newGame.players.X = player1Id;
            newGame.players.Y = player2Id;
        } else {
            newGame.players.X = player2Id;
            newGame.players.Y = player1Id;
        }
        return newGame;
    }

    static parse(gameString) {
        const gameData = parseJSONRecursively(gameString);
        const newGame = new Game();
        newGame.turn = gameData.turn;
        newGame.grid = gameData.grid;
        newGame.players = gameData.players;
        return newGame;
    }

    placeSymbol(x, y) {
        this.grid[x][y] = this.turn;
        this.turn = (this.turn === "X" ? "O" : "X");
    }

    checkForVictor() {
        for (let i = 0; i < 1; i++) {
            const symbol = (i === 0 ? "X" : "O");
            for (let x = 0; x < 2; x++) {
                if (this.grid[x][0] === symbol && this.grid[x][1] === symbol && this.grid[x][2] === symbol) {
                    return this.players[symbol];
                }
            }
            for (let y = 0; y < 2; y++) {
                if (this.grid[0][y] === symbol && this.grid[1][y] === symbol && this.grid[2][y] === symbol) {
                    return this.players[symbol];
                }
            }
            if (this.grid[1][1] === symbol && ((this.grid[0][0] === symbol && this.grid[2][2] === symbol) || (this.grid[2][0] === symbol && this.grid[0][2] === symbol))) {
                return this.players[symbol];
            }
        }
        return null;
    }

    toString() {
        return JSON.stringify({ grid: this.grid, turn: this.turn, players: this.players });
    }
}