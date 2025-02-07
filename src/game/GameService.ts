import { Socket } from "socket.io";
import { Directions, Player, PlayerStates } from "../player/entities/Player";
import { Room } from "../room/entities/Room";
import { RoomService } from "../room/RoomService";
import { Game, GameStates } from "./entities/Game";
import { BoardBuilder } from "./BoardBuilder";
import { ServerService } from "../server/ServerService";
import { publicDecrypt } from "crypto";

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



    // ...existing code...
    private corners: [number, number][] = [];

    // Método para inicializar esquinas
    private initCorners(boardSize: number): void {
        this.corners = [
            [0, 0],
            [0, boardSize - 1],
            [boardSize - 1, 0],
            [boardSize - 1, boardSize - 1]
        ];
    }

    public buildPlayer(socket: Socket, boardSize: number): Player {
        // Si el array de esquinas está vacío, lo inicializamos
        if (this.corners.length === 0) {
            this.initCorners(boardSize);
        }

        // Tomar una esquina aleatoria
        const randomIndex = Math.floor(Math.random() * this.corners.length);
        const [spawnX, spawnY] = this.corners[randomIndex];
        // Borrar la esquina ya usada
        this.corners.splice(randomIndex, 1);

        return {
            id: socket,
            x: spawnX,
            y: spawnY,
            state: PlayerStates.Idle,
            direction: Directions.Up,
            visibility: true
        };
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
                    ServerService.getInstance().sendMessageToRoom(room.name, this.serializeGame(room.game));
                    console.log(JSON.stringify(this.serializeGame(room.game)));




                }
            }
            return true;
        }

        return false;
    }

    public movePlayer(data: any) {
        const room = RoomService.getInstance().getRoomByPlayerId(data.playerId);
        if (!room || !room.game) return;

        const boardSize = room.game.board.size;
        const player = room.players.find((p) => p.id.id == data.playerId);
        if (!player) return;

        switch (data.direction) {
            case "up":
                if (player.x > 0) {
                    player.x--;
                }
                break;
            case "down":
                if (player.x < boardSize - 1) {
                    player.x++;
                }
                break;
            case "left":
                if (player.y > 0) {
                    player.y--;
                }
                break;
            case "right":
                if (player.y < boardSize - 1) {
                    player.y++;
                }
                break;
            default:
                break;
        }

        ServerService.getInstance().sendMessageToRoom(room.name, this.serializeGame(room.game));
    }

    public rotatePlayer(data: any) {
        const room = RoomService.getInstance().getRoomByPlayerId(data.playerId);
        if (!room || !room.game) return;

        const player = room.players.find((p) => p.id.id == data.playerId);
        if (!player) return;

        // Secuencia de direcciones en el orden: up -> right -> down -> left
        const dirOrder = [Directions.Up, Directions.Right, Directions.Down, Directions.Left];
        const currentIndex = dirOrder.indexOf(player.direction);

        switch (data.direction) {
            case "left": {
                const newIndex = (currentIndex + dirOrder.length - 1) % dirOrder.length;
                player.direction = dirOrder[newIndex];
                break;
            }
            case "right": {
                const newIndex = (currentIndex + 1) % dirOrder.length;
                player.direction = dirOrder[newIndex];
                break;
            }
            default:
                break;
        }

        ServerService.getInstance().sendMessageToRoom(room.name, this.serializeGame(room.game));
    }



    private serializeRoom(room: Room): any {
        return {
            name: room.name,
            occupied: room.occupied,
            players: room.players.map(player => ({
                socketId: player.id.id,  // Aquí usamos el id real del socket
                x: player.x,
                y: player.y,
                state: player.state,
                direction: player.direction,
                visibility: player.visibility
            }))
            // Omitimos "game" para evitar la referencia circular
        };
    }

    public serializeGame(game: Game): any {
        return {
            type: "game",
            content: {
                id: game.id,
                state: game.state,
                room: this.serializeRoom(game.room),
                board: {
                    type: game.board.type,
                    size: game.board.size,
                    elements: game.board.elements
                }
            }

        };
    }

}