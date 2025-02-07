import { PrintInterface } from "../interfaces/PrintInterface.js";
import { ConnectionHandler } from "../services/ConectionHandler.js";

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
                // Verificamos si en esta celda hay un arbusto
                const isBush = this.elements.some(bush => bush.x === i && bush.y === j);
                // Verificamos si hay un jugador en esta celda
                const matchingPlayer = players.find(player => player.x === i && player.y === j);
                
                if (isBush && matchingPlayer) {
                    // Si hay un jugador dentro de un arbusto, aplicamos un estilo especial
                    cell.classList.add('player-in-bush');
                } else if (isBush) {
                    cell.classList.add('bush');
                } else if (matchingPlayer) {
                    cell.classList.add('player');
                    cell.classList.add(matchingPlayer.direction); // agrega la dirección, ejemplo 'up', 'down', etc.
                }
                row.appendChild(cell);
            }
            boardContainer.appendChild(row);
        }

        // Agregar controles
               // Dentro de printInHtml() reemplaza el contenido de controls:
        const controls = document.createElement('div');
        controls.className = 'controls';
        controls.innerHTML = `
            <button id="advance">Avanzar</button>
            <button id="rotate">Rotar</button>
            <button id="shoot">Disparar</button>
        `;
        boardContainer.appendChild(controls);
        
        // Agrego listener a los nuevos botones
        document.getElementById('advance').addEventListener('click', () => {
            console.log("El jugador " + this.player + " avanza");
            // Emitir "movePlayer" con acción "advance"
            ConnectionHandler.socket.emit("movePlayer", { direction: "advance", playerId: this.player });
        });
        document.getElementById('rotate').addEventListener('click', () => {
            console.log("El jugador " + this.player + " rota (horario)");
            // Emitir "rotatePlayer" con dirección forzada a "right"
            ConnectionHandler.socket.emit("rotatePlayer", { direction: "right", playerId: this.player });
        });
        document.getElementById('shoot').addEventListener('click', () => {
            console.log("El jugador " + this.player + " ha disparado");
            ConnectionHandler.socket.emit("shoot", { playerId: this.player });
        });
        

    }
}