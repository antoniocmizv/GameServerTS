import { Board } from "../entities/Board.js";
import { Ui } from "../views/Ui.js";

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
        //lo añado al array de jugadores
        this.#players.push(player);
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

    };



    do_gameStart(content) {
        console.log("Iniciando juego con estado:", content);
        const boardInstance = new Board(content.board, this.player);
        const ui = new Ui(content.board, content.room.players, this.player);

        // Filtrar jugadores vivos (asumiendo que 4 representa Dead)
        const alivePlayers = content.room.players.filter(player => player.state !== 4);
        this.#players = alivePlayers;

        // Comprobar si el jugador actual está vivo
        let controlsEnabled = true;
        const currentAlive = alivePlayers.find(p => p.socketId === this.player);
        if (!currentAlive) {
            controlsEnabled = false;
            if (!this.#gameOverShown) {
                Ui.showGameOver();
                this.#gameOverShown = true;
            }
        } else {
            // Reiniciar la bandera si el jugador está vivo
            this.#gameOverShown = false;
        }

        // Si el estado del juego es ENDED, mostrar botón de reinicio
        if (content.state === 2) { // 2 representa ENDED
            this.#state = this.#states.ENDED;
            // Mostrar restartButton solo si el jugador actual es el último vivo
            if (alivePlayers.length === 1 && alivePlayers[0].socketId === this.player) {
                Ui.showRestartButton();
            }
        }

        ui.renderBoard(alivePlayers, controlsEnabled);
    }
    /* ... */
}













