export const PrintInterface = {
    printInterface: (boardData, players) => {
        const size = boardData.size;
        let board = Array(size).fill().map(() => Array(size).fill(0));

        // Pintar arbustos
        boardData.elements.forEach(bush => {
            board[bush.x][bush.y] = 1;
        });

        // Pintar jugadores
        players.forEach(player => {
            board[player.x][player.y] = 2; // Usa otro número o símbolo para identificarlos
        });

        // Construir string
        let boardString = "";
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 1) {
                    boardString += "X ";
                } else if (board[i][j] === 2) {
                    boardString += "P "; // Representación de jugador
                } else {
                    boardString += "0 ";
                }
            }
            boardString += "\n";
        }
        console.log(boardString);
    }
};