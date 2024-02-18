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
    roomName;
    turn;
    grid = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];

    static create(roomName) {
        const newGame = new Game();
        newGame.roomName = roomName;
        newGame.turn = Math.random() < .5 ? "X" : "O";
        return newGame;
    }

    static parse(gameString) {
        const gameData = parseJSONRecursively(gameString);
        const newGame = new Game();
        newGame.roomName = gameData.roomName;
        newGame.turn = gameData.turn;
        newGame.grid = gameData.grid;//
        return newGame;
    }

    placeSymbol(x, y) {
        this.grid[x][y] = this.turn;
        this.turn = (this.turn === "X" ? "O" : "X");
    }

    toString() {
        return JSON.stringify({ grid: this.grid, turn: this.turn, roomName: this.roomName });
    }
}