import { PrintInterface } from "../interfaces/PrintInterface.js";

export class Board {
    constructor(data) {
        this.size = data.size;
        this.elements = data.elements;
    }

    addElement(element) {
        this.elements.push(element);
    }

        // Modificar el método print() para incluir jugadores
    print(players = []) {
        const size = this.size;
        let board = Array(size).fill().map(() => Array(size).fill(0));
    
        // Colocar arbustos
        this.elements.forEach(bush => {
            board[bush.x][bush.y] = 1;
        });
    
        // Colocar jugadores
        players.forEach(player => {
            if (player.visibility) {
                board[player.x][player.y] = 2; // 2 representa jugador
            }
        });
    
        // Construir string
        let boardString = "";
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 1) {
                    boardString += "🌳"; // Arbusto
                } else if (board[i][j] === 2) {
                    boardString += "👤"; // Jugador
                } else {
                    boardString += "⬜"; // Celda vacía
                }
            }
            boardString += "\n";
        }
        console.log(boardString);
    }
    
    // Modificar printInHtml para incluir jugadores y controles
    printInHtml(players = []) {
        const size = this.size;
        let board = Array(size).fill().map(() => Array(size).fill(0));
    
        this.elements.forEach(bush => {
            board[bush.x][bush.y] = 1;
        });
    
        players.forEach(player => {
            if (player.visibility) {
                board[player.x][player.y] = 2;
            }
        });
    
        const boardContainer = document.getElementById('board-container');
        boardContainer.innerHTML = '';
    
        // Agregar tablero
        for (let i = 0; i < size; i++) {
            const row = document.createElement('div');
            row.className = 'board-row';
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('div');
                cell.className = 'board-cell';
                if (board[i][j] === 1) {
                    cell.classList.add('bush');
                } else if (board[i][j] === 2) {
                    cell.classList.add('player');
                }
                row.appendChild(cell);
            }
            boardContainer.appendChild(row);
        }
    
        // Agregar controles
        const controls = document.createElement('div');
        controls.className = 'controls';
        controls.innerHTML = `
            <button id="up">↑</button>
            <button id="left">←</button>
            <button id="right">→</button>
            <button id="down">↓</button>
            <button id="hide">Esconderse</button>
        `;
        boardContainer.appendChild(controls);
    }
}