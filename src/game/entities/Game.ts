import { Room } from "../../room/entities/Room";
import { Board } from "./Board";

export enum GameStates {
    WAITING, PLAYING
}

export interface Game {
    id : String,
    state: GameStates,
    room: Room,
    board: Board
}