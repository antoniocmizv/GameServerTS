import { Board } from "../entities/Board.js";
import { Player } from "../entities/Player.js";
import { PrintInterface } from "../interfaces/PrintInterface.js";
import { ConnectionHandler } from "./ConectionHandler.js";

export class GameService {
    #states = {
        WAITING: 0,
        PLAYING: 1,
        ENDED: 2
    };
    player = null;
    #players = [];
    #board = null;
    #state = null;
    #actionsList = {};
    #gameOverShown = false; // bandera para controlar el GameOver


    constructor() {
        this.#state = this.#states.WAITING
        this.#players = [];
        this.#actionsList = {
            "NEW_PLAYER": (content) => this.do_newPlayer(content),
            "board": (content) => this.do_start(content),
            "game": (content) => this.do_gameStart(content),

        };
    }

    //setear el jugador actual
    setPlayer(player) {
        this.player = player;
    }

    do(data) {
        this.#actionsList[data.type](data.content)
    };

    do_newPlayer(content) {
        console.log("ha llegado un jugador nuevo");
    };

    do_start(content) {
        console.log(content);
        console.log("ha llegado un start");
        // Genero un nuevo tablero con los datos que llegan y lo imprimo
        console.log("soy el jugador desde el gameService " + this.player);
        const boardInstance = new Board(content, this.player);
        boardInstance.print();
        boardInstance.printInHtml();
    };



    do_gameStart(content) {
        console.log("Iniciando juego con estado:", content);
        const boardInstance = new Board(content.board, this.player);

        // Filtrar jugadores vivos (asumiendo que 4 representa Dead)
        const alivePlayers = content.room.players.filter(player => player.state !== 4);
        this.#players = alivePlayers;

        // Si el jugador actual está muerto y aún no se ha mostrado el mensaje
        if (!alivePlayers.find(p => p.socketId === this.player)) {
            if (!this.#gameOverShown) {
                Board.showGameOver();
                this.#gameOverShown = true;
            }
            return;
        }

        // Reiniciar la bandera si todavía está vivo
        this.#gameOverShown = false;

        // Si el estado del juego es ENDED, mostrar botón de reinicio solo una vez
        if (content.state === 2) { // 2 representa ENDED
            this.#state = this.#states.ENDED;
            Board.showRestartButton();
        }
        

        boardInstance.print(alivePlayers);
        boardInstance.printInHtml(alivePlayers);
    }
    /* ... */
}













