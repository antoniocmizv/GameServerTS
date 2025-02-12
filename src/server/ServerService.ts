import { DefaultEventsMap, Server, Socket } from 'socket.io';
import http from 'http';
import { Directions, Player, PlayerStates } from '../player/entities/Player';
import { GameService } from '../game/GameService';
import { BoardBuilder } from '../game/BoardBuilder';
import { Room } from '../room/entities/Room';
import { RoomService } from '../room/RoomService';
import { GameStates } from '../game/entities/Game';

export class ServerService {
    private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null;
    private active: boolean;
    private messages = [
        ""
    ]

    private static instance: ServerService;
    private constructor() {
        this.io = null;
        this.active = false;
    };

    static getInstance(): ServerService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ServerService();
        return this.instance;
    }

    public init(httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
        this.io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });
        this.active = true;

        this.io.on('connection', (socket) => {
            socket.emit("connectionStatus", {
                status: true,
                message: {
                    conexion: "Conexión establecida",
                    jugador: socket.id
                }
            });
            console.log('Un cliente se ha conectado:', socket.id);
            GameService.getInstance().addPlayer(GameService.getInstance().buildPlayer(socket, 10));

            socket.on('disconnect', () => {
                console.log('Un cliente se ha desconectado:', socket.id);
            });

            socket.on("movePlayer", (data) => {
                // GameService.getInstance().movePlayer(socket, data);
                console.log("Move player", data);

                GameService.getInstance().movePlayer(data);
            });


            socket.on("shoot", (data) => {
                console.log("Shoot", data);
                GameService.getInstance().shootPlayer(data);
            });

            socket.on("rotatePlayer", (data) => {
                console.log("Rotate player", data);
                GameService.getInstance().rotatePlayer(data);
            });
                       socket.on("restartGame", (data) => {
                console.log("Restart game", data);
                // 1. Obtener la sala del jugador
                const room = RoomService.getInstance().getRoomByPlayerId(data.playerId);
                if (!room) return;
            
                // 2. Reinicializar el estado del juego y de los jugadores
                room.players.forEach(player => {
                    player.state = PlayerStates.Idle;
                    player.visibility = true;
                });
            
                if (room.game) {
                    console.log("Game restarted");
                    room.game.board = new BoardBuilder().getBoard();
                    room.game.state = GameStates.PLAYING;
            
                    // Validar que existan esquinas para asignar spawn points.
                    const gameService = GameService.getInstance();
                    if (!gameService.corners || gameService.corners.length === 0) {
                        // Asignar esquinas por defecto en función del tamaño del tablero
                        const size = room.game.board.size;
                        gameService.corners = [
                            [0, 0],
                            [0, size - 1],
                            [size - 1, 0],
                            [size - 1, size - 1]
                        ];
                    }
            
                    room.players.forEach(player => {
                        const randomIndex = Math.floor(Math.random() * gameService.corners.length);
                        const spawn = gameService.corners[randomIndex];
                        if (spawn) {
                            const [spawnX, spawnY] = spawn;
                            player.x = spawnX;
                            player.y = spawnY;
                        }
                        // Reiniciar dirección a "Up"
                        player.direction = Directions.Up;
                    });
            
                    // Notificar a todos los clientes con el juego reiniciado
                    ServerService.getInstance().sendMessageToRoom(room.name, gameService.serializeGame(room.game));
                }
            });


        });
    }

    public addPlayerToRoom(player: Socket, room: String) {
        player.join(room.toString());
    }

    public gameStartMessage(room: String) {
        console.log("Game started");
        //enviar a los jugadores el mensaje de inicio de juego con el tablero
        const board = new BoardBuilder().serializeBoard();
        console.log(board);
        this.io?.to(room.toString()).emit('board', board);

    }

    public isActive() {
        return this.active;
    }

    //mandar un mensaje a todos los jugadores de una sala, a la función le llega el id de la sala y el mensaje
    public sendMessageToRoom(room: String, message: String) {
        this.io?.to(room.toString()).emit('message', message);
    }



}