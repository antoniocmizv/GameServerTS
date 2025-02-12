import { Board } from "./entities/Board";

export class BoardBuilder {
    private board: Board;

    constructor() {
        this.board = {
            type: "board",
            size: 10,
            elements: []
        };

        const size = this.board.size;
        const bushProbability = 0.2; // Probabilidad de colocar un arbusto en una celda válida
        // Iterar por todas las celdas del tablero
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                // Excluir las esquinas del tablero
                if (
                    (i === 0 && j === 0) ||
                    (i === 0 && j === size - 1) ||
                    (i === size - 1 && j === 0) ||
                    (i === size - 1 && j === size - 1)
                ) {
                    continue;
                }

                // Verificar que no exista ya un arbusto en las celdas adyacentes (incluyendo la actual)
                let canPlace = true;
                for (const bush of this.board.elements) {
                    if (Math.abs(bush.x - i) <= 1 && Math.abs(bush.y - j) <= 1) {
                        canPlace = false;
                        break;
                    }
                }

                // Si se puede colocar y se supera la probabilidad, agregar el arbusto
                if (canPlace && Math.random() < bushProbability) {
                    this.board.elements.push({ x: i, y: j });
                }
            }
        }
    }

    public getBoard(): Board {
        return this.board;
    }

    public serializeBoard(): any {
        return {
            type: this.board.type,
            content: {
                size: this.board.size,
                elements: this.board.elements.map(element => ({
                    x: element.x,
                    y: element.y
                }))
            }
        };
    }
}