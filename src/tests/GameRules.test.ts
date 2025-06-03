import { determineWinner } from '../gameLogic/GameRules';
import { ShipType } from '../gameLogic/ShipType';

describe('determineWinner', () => {
  // Test cases for player winning
  it('should return "player" when Battleship beats Cruiser', () => {
    const player: ShipType = 'Battleship';
    const ai: ShipType = 'Cruiser';
    expect(determineWinner(player, ai)).toBe('player');
  });

  it('should return "player" when Cruiser beats Destroyer', () => {
    const player: ShipType = 'Cruiser';
    const ai: ShipType = 'Destroyer';
    expect(determineWinner(player, ai)).toBe('player');
  });

  it('should return "player" when Destroyer beats Battleship', () => {
    const player: ShipType = 'Destroyer';
    const ai: ShipType = 'Battleship';
    expect(determineWinner(player, ai)).toBe('player');
  });

  // Test cases for AI winning
  it('should return "ai" when Cruiser loses to Battleship (AI wins)', () => {
    const player: ShipType = 'Cruiser';
    const ai: ShipType = 'Battleship';
    expect(determineWinner(player, ai)).toBe('ai');
  });

  it('should return "ai" when Destroyer loses to Cruiser (AI wins)', () => {
    const player: ShipType = 'Destroyer';
    const ai: ShipType = 'Cruiser';
    expect(determineWinner(player, ai)).toBe('ai');
  });

  it('should return "ai" when Battleship loses to Destroyer (AI wins)', () => {
    const player: ShipType = 'Battleship';
    const ai: ShipType = 'Destroyer';
    expect(determineWinner(player, ai)).toBe('ai');
  });

  // Test cases for ties
  it('should return "tie" when both choose Battleship', () => {
    const player: ShipType = 'Battleship';
    const ai: ShipType = 'Battleship';
    expect(determineWinner(player, ai)).toBe('tie');
  });

  it('should return "tie" when both choose Cruiser', () => {
    const player: ShipType = 'Cruiser';
    const ai: ShipType = 'Cruiser';
    expect(determineWinner(player, ai)).toBe('tie');
  });

  it('should return "tie" when both choose Destroyer', () => {
    const player: ShipType = 'Destroyer';
    const ai: ShipType = 'Destroyer';
    expect(determineWinner(player, ai)).toBe('tie');
  });
});