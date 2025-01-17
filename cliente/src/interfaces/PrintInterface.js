
export const PrintInterface = {
    printInterface: (data) => {
        const size = data.size;
        const bushs = data.elements;
        
        // Crear tablero vacío
        let board = Array(size).fill().map(() => Array(size).fill(0));
        
        // Colocar barcos
        bushs.forEach(bush => {
            board[bush.x][bush.y] = 1;
        });
        
        // Construir string para imprimir
        let boardString = "";
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 1) {
                    boardString += "X ";
                } else {
                    boardString += "0 ";
                }
            }
            boardString += "\n";
        }
        console.log(boardString);
    }
}