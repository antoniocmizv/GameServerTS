import { Socket } from "socket.io";
import { Directions, Player, PlayerStates } from "../player/entities/Player";
import { Room } from "../room/entities/Room";
import { RoomService } from "../room/RoomService";
import { Game, GameStates } from "./entities/Game";
import { BoardBuilder } from "./BoardBuilder";
import { ServerService } from "../server/ServerService";

export class GameService {
    private games: Game[];

    private static instance: GameService;
    private constructor() {
        this.games = [];
    };

    static getInstance(): GameService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new GameService();
        return this.instance;
    }

    public buildPlayer(socket: Socket): Player {
        return {
            id: socket,
            x: 0,
            y: 0,
            state: PlayerStates.Idle,
            direction: Directions.Up,
            visibility: true
        }
    }

    public addPlayer(player: Player): boolean {
        const room: Room = RoomService.getInstance().addPlayer(player);
        const genRanHex = (size: Number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

        if (room.players.length == 1) {

            const game: Game = {
                id: "game" + genRanHex(128),
                state: GameStates.WAITING,
                room: room,
                board: new BoardBuilder().getBoard()
            }
            room.game = game;
            this.games.push(game);
            console.log("Game created: ", game.id);

        }

        if (room.occupied) {
            if (room.game) {
                room.game.state = GameStates.PLAYING;
                if (ServerService.getInstance().isActive()) {
                    ServerService.getInstance().gameStartMessage(room.name);
                    //enviar a los jugadores el mensaje de inicio de juego con el tablero
                    console.log(JSON.stringify(room.game.board.elements));
                    const boardAsString = JSON.stringify(room.game.board.elements);
                    ServerService.getInstance().sendMessageToRoom(room.name, JSON.stringify(room.game.board.elements));

                    console.log(this.serializeGame(room.game));


                }
            }
            return true;
        }

        return false;
    }

    public serializeGame(game: Game): Game {
        return {
            id: game.id,
            state: game.state,
            room: game.room,
            board: {
                size: game.board.size,
                elements: game.board.elements.map(element => ({
                    x: element.x,
                    y: element.y
                }))
            }
        };
    }

}