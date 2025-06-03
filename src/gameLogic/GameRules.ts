import { ShipType } from './ShipType';

/**
 * Determines the winner of a naval RPS round.
 * @param player - The player's chosen ship.
 * @param ai - The AI's chosen ship.
 * @returns 'player', 'ai', or 'tie'.
 */
export function determineWinner(player: ShipType, ai: ShipType): 'player' | 'ai' | 'tie' {
    if (player === ai) {
        return 'tie';
    }

    // Winning conditions:
    // Battleship > Cruiser
    // Cruiser > Destroyer
    // Destroyer > Battleship
    if (
        (player === 'Battleship' && ai === 'Cruiser') ||
        (player === 'Cruiser' && ai === 'Destroyer') ||
        (player === 'Destroyer' && ai === 'Battleship')
    ) {
        return 'player';
    } else {
        return 'ai';
    }
}