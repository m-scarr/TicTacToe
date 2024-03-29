export type User = { 
    id: number;
    username: string;
    profilePic: string
    highScore: number;
    currentScore: number;
}

export enum View {
    LogIn,
    Register,
    Lobby,
    Game
}

export type Symbol = "X" | "O";

export type GameGrid = [[null | Symbol, null | Symbol, null | Symbol], [null | Symbol, null | Symbol, null | Symbol], [null | Symbol, null | Symbol, null | Symbol]];