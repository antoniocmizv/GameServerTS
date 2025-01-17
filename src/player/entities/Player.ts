import { Socket } from "socket.io";

export enum Directions {
    Up = "up", 
    Down = "down",
    Left = "left",
    Right = "right",
    Idle = "idle"
}

export enum PlayerStates {
    No_Connected, Idle, Moving, Hidden, Dead
}

export interface Player {
    id: Socket;
    x: Number;
    y: Number;
    state: PlayerStates;
    direction: Directions;
    visibility: Boolean;
}
