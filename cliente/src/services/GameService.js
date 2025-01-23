import { Board } from "../entities/Board.js";
import { Player } from "../entities/Player.js";
import { PrintInterface } from "../interfaces/PrintInterface.js";
export class GameService {
    #states = {
        WAITING : 0,
        PLAYING : 1,
        ENDED : 2
    };
    #players = [];
    #board = null;
    #state = null;
    #actionsList = {
        "NEW_PLAYER" : this.do_newPlayer,
        "board" : this.do_start,
    };
    constructor(){
        this.#state = this.#states.WAITING
    }
    do (data) {
        this.#actionsList[data.type](data.content)
    };
    do_newPlayer (content) {
        console.log("ha llegado un jugador nuevo");
    };
    do_start (content) {
        console.log(content);
        console.log("ha llegado un start");
        PrintInterface.printInterface(content);
    };
    
}

