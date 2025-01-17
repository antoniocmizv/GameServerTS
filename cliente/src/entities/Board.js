export const Board = {
    size: 16,
    bush: [],
    init: () => {
        for (let i = 0; i < Board.size; i++) {
            Board.bush[i] = [];
            let row = '';
            for (let j = 0; j < Board.size; j++) {
            Board.bush[i][j] = Math.random() < 0.2;
            row += Board.bush[i][j] ? 'B ' : '. ';
            }
            console.log(row.trim());
        }
    },
    isBush: (x, y) => {
        return Board.bush[x][y];
    },
    clear: () => {
        for (let i = 0; i < Board.size; i++) {
            for (let j = 0; j < Board.size; j++) {
                Board.bush[i][j] = false;
            }
        }
    }



}
