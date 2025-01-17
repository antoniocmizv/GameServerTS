import { Board } from "../entities/Board.js";
const States = {
    WAITING: 0,
    PLAYING: 1,
    FINISHED: 2
};
export const GameService = {
        States,
        state: States.WAITING,
        players: [],
        board: null,
        action: (message) => {
            switch (message.action) {
                case "start":
                    GameService.state = GameService.States.PLAYING;
                    
                    console.log("Game started");
                    //arranco el tablero
                    Board.init();
                    break;
                case "end":
                    GameService.state = GameService.States.FINISHED;
                    console.log("Game finished");
                break;
            case "update":
                GameService.players = message.players;
                break;
            case "board":
                GameService.board = message.board;
                break;
        }

    }
}