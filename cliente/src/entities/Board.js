import { PrintInterface } from "../interfaces/PrintInterface.js";

export class Board {
    constructor(data) {
        this.size = data.size;
        this.elements = data.elements;
    }

    addElement(element) {
        this.elements.push(element);
    }

    print() {
        const size = this.size;
        const bushs = this.elements;

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

    // Implementar la función para imprimir el tablero en el html
    printInHtml() {
        const size = this.size;
        const bushs = this.elements;

        // Crear tablero vacío
        let board = Array(size).fill().map(() => Array(size).fill(0));

        // Colocar barcos
        bushs.forEach(bush => {
            board[bush.x][bush.y] = 1;
        });

        // Obtener el contenedor del tablero en el HTML
        const boardContainer = document.getElementById('board-container');
        boardContainer.innerHTML = ''; // Limpiar el contenedor

        // Construir el tablero en el HTML
        for (let i = 0; i < size; i++) {
            const row = document.createElement('div');
            row.className = 'board-row';
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('div');
                cell.className = 'board-cell';
                if (board[i][j] === 1) {
                    cell.classList.add('bush');
                }
                row.appendChild(cell);
            }
            boardContainer.appendChild(row);
        }
    }
}