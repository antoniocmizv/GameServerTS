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
        const player = room.players.find((p) => p.id.id === data.playerId);
        if (!player) return;

        let newX = player.x;
        let newY = player.y;

        if (data.direction === "advance") {
            // Calcular nueva posición según la dirección actual
            switch (player.direction) {
                case Directions.Up:
                    newX = player.x - 1;
                    break;
                case Directions.Right:
                    newY = player.y + 1;
                    break;
                case Directions.Down:
                    newX = player.x + 1;
                    break;
                case Directions.Left:
                    newY = player.y - 1;
                    break;
            }

            // Validar límites del tablero
            if (newX < 0 || newX >= boardSize || newY < 0 || newY >= boardSize) {
                return; // Impedir moverse fuera del mapa
            }

            // Comprobar que ningún otro jugador ya ocupa la casilla destino
            const occupied = room.players.some(p => p.id.id !== data.playerId && p.x === newX && p.y === newY);
            if (occupied) {
                return; // No se mueve si la casilla está ocupada
            }

            // Actualizar posición si todo es correcto
            player.x = newX;
            player.y = newY;
        }

        ServerService.getInstance().sendMessageToRoom(room.name, this.serializeGame(room.game));
    }

    public rotatePlayer(data: any) {
        const room = RoomService.getInstance().getRoomByPlayerId(data.playerId);
        if (!room || !room.game) return;

        const player = room.players.find((p) => p.id.id == data.playerId);
        if (!player) return;

        // Rotar solo en sentido horario (derecha)
        const dirOrder = [Directions.Up, Directions.Right, Directions.Down, Directions.Left];
        const currentIndex = dirOrder.indexOf(player.direction);
        const newIndex = (currentIndex + 1) % dirOrder.length;
        player.direction = dirOrder[newIndex];

        ServerService.getInstance().sendMessageToRoom(room.name, this.serializeGame(room.game));
    }

    public shootPlayer(data: any) {
        const room = RoomService.getInstance().getRoomByPlayerId(data.playerId);
        if (!room || !room.game) return;

        const boardSize = room.game.board.size;
        const shooter = room.players.find(p => p.id.id === data.playerId);
        if (!shooter) return;

        // Calcular la casilla objetivo en base a la dirección del jugador que dispara
        let targetX = shooter.x;
        let targetY = shooter.y;
        switch (shooter.direction) {
            case Directions.Up:
                targetX = shooter.x - 1;
                break;
            case Directions.Right:
                targetY = shooter.y + 1;
                break;
            case Directions.Down:
                targetX = shooter.x + 1;
                break;
            case Directions.Left:
                targetY = shooter.y - 1;
                break;
        }

        // Validar que el objetivo esté dentro del mapa
        if (targetX < 0 || targetX >= boardSize || targetY < 0 || targetY >= boardSize) {
            return;
        }

        // Buscar si hay algún jugador en la casilla objetivo
        const targetPlayer = room.players.find(p => p.x === targetX && p.y === targetY);
        if (targetPlayer) {
            // Si se detecta un jugador, se lo "mata" actualizando su estado
            targetPlayer.state = PlayerStates.Dead;
            console.log(`Jugador ${targetPlayer.id.id} fue eliminado por ${shooter.id.id}`);
        }

        // Notificar a todos los jugadores en la sala con la actualización del juego
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