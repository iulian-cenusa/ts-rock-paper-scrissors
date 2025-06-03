import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene'; // Import your new scene

// Game configuration
const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO, // Use WebGL if available, otherwise Canvas
    width: 1200,
    height: 540,
    backgroundColor: '#0a1a2a', // Dark blue, like the ocean
    parent: 'game-container', // ID of the div in index.html
    scene: GameScene // Reference your GameScene class here
};

// Phaser game instance
new Phaser.Game(gameConfig);