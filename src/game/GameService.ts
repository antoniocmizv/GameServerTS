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
        console.log("Room: ", room?.name);
        //consigo el jugador de la sala
        const player = room?.players.find((player) => player.id.id == data.playerId);
        console.log("Player: ", player?.id.id);
        //cambio la posición del jugador haciendo un switch de la dirección
        if (player != undefined ) {
            switch (data.direction) {
                case "up":
                    console.log(player?.y);
                    console.log("Move up");
                    player.x = player.x - 1;
                    console.log(player?.y);
                    //mando al cliente la nueva posición del jugador
                    if(room != undefined && room.game != undefined)
                    ServerService.getInstance().sendMessageToRoom(room.name, this.serializeGame(room.game));
                    break;
                case "down":
                    console.log(player?.y);
                    console.log("Move down");
                    player.x = player.x + 1;
                    console.log(player?.y);
                    if(room != undefined && room.game != undefined)
                    ServerService.getInstance().sendMessageToRoom(room.name, this.serializeGame(room.game));
                    break;
                case "left":
                    console.log(player?.x);
                    console.log("Move left");
                    player.y = player.y - 1;
                    console.log(player?.x);
                    if(room != undefined && room.game != undefined)
                    ServerService.getInstance().sendMessageToRoom(room.name, this.serializeGame(room.game));
                    break;
                case "right":
                    console.log(player?.x);
                    console.log("Move right");
                    player.y = player.y + 1;
                    console.log(player?.x);
                    if(room != undefined && room.game != undefined)
                    ServerService.getInstance().sendMessageToRoom(room.name, this.serializeGame(room.game));
                    break;


            }
        }

        // switch (data.direction) {
        //     case "up":
        //         console.log(player?.y);
        //         console.log("Move up");
        //         if (player != undefined) {
        //             player.y = 2;
        //         }
        //         console.log(player?.y);


        // }


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