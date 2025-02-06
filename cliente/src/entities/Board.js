import { PrintInterface } from "../interfaces/PrintInterface.js";

export class Board {
    constructor(data,player) {
        this.size = data.size;
        this.elements = data.elements;
        this.player = player;
        console.log("soy el jugador desde board "+ this.player);
    }

    addElement(element) {
        this.elements.push(element);
    }

    // Modificar el método print() para incluir jugadores
    print(players = []){
        console.log("soy el jugador "+this.player);
        const size = this.size;
        let board = Array(size).fill().map(() => Array(size).fill(0));

        console.log(this.elements);
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
            <button id="rotate-left">↺</button>
            <button id="rotate-right">↻</button>
            <button id="shoot">Disparar</button>
        `;
        boardContainer.appendChild(controls);

        // Agrego listener a los botones
        document.getElementById('up').addEventListener('click', () => {
           // PrintInterface.print('up');
           console.log("El jugador "+this.player+" se ha movido hacia arriba");
        });
        document.getElementById('left').addEventListener('click', () => {
            //PrintInterface.print('left');
            console.log("El jugador "+this.player+" se ha movido hacia la izquierda");
        });
        document.getElementById('right').addEventListener('click', () => {
            //PrintInterface.print('right');
            console.log("El jugador "+this.player+" se ha movido hacia la derecha");
        });
        document.getElementById('down').addEventListener('click', () => {
           // PrintInterface.print('down');
              console.log("El jugador "+this.player+" se ha movido hacia abajo");
        });
        document.getElementById('shoot').addEventListener('click', () => {
            //PrintInterface.print('shoot');
            console.log("El jugador "+this.player+" ha disparado");
        });
        document.getElementById('rotate-left').addEventListener('click', () => {
            //PrintInterface.print('rotate-left');
            console.log("El jugador "+this.player+" ha rotado a la izquierda");
        });
        document.getElementById('rotate-right').addEventListener('click', () => {
           // PrintInterface.print('rotate-right');
            console.log("El jugador "+this.player+" ha rotado a la derecha");
        });


        

    }
}