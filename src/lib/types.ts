export type User = { id: number; username: string; profilePic: string }

export enum View {
    LogIn,
    Register,
    Lobby,
    Game,
    Leaderboard
}