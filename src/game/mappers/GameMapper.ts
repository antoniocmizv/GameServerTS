import { Room } from "../../room/entities/Room";
import { Game } from "../entities/Game";
import { Player } from "../../player/entities/Player";

export class GameMapper {
    public static mapRoom(room: Room): any {
        return {
            name: room.name,
            occupied: room.occupied,
            players: room.players.map((player: Player) => ({
                socketId: player.id.id,
                x: player.x,
                y: player.y,
                state: player.state,
                direction: player.direction,
                visibility: player.visibility
            }))
        };
    }

    public static mapGame(game: Game): any {
        return {
            type: "game",
            content: {
                id: game.id,
                state: game.state,
                room: GameMapper.mapRoom(game.room),
                board: {
                    type: game.board.type,
                    size: game.board.size,
                    elements: game.board.elements
                }
            }
        };
    }
}