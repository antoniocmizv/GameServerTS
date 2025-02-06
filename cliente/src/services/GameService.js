import { Board } from "../entities/Board.js";
import { Player } from "../entities/Player.js";
import { PrintInterface } from "../interfaces/PrintInterface.js";

export class GameService {
    #states = {
        WAITING: 0,
        PLAYING: 1,
        ENDED: 2
    };
    #player = null;
    #players = [];
    #board = null;
    #state = null;
    #actionsList = {};

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
        this.#player = player;
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
        console.log("soy el jugador desde el gameService "+ this.#player);
        const boardInstance = new Board(content, this.#player);
        boardInstance.print();
        boardInstance.printInHtml();
    };

    do_gameStart(content) {
        console.log("Iniciando juego con estado:", content);
        const boardInstance = new Board(content.board, this.#player);
        // Almacenar jugadores en el servicio
        this.#players = content.room.players;
        // Pintar tablero con jugadores
        boardInstance.print(this.#players);
        boardInstance.printInHtml(this.#players);
    };

  


    




    
    
}

