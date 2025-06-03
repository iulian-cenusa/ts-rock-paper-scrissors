import Phaser from 'phaser';
import { ShipType } from '../gameLogic/ShipType';
import { determineWinner } from '../gameLogic/GameRules';
import { buttonStyle, buttonHoverStyle, buttonPressedStyle } from '../ui/ButtonStyles';

export class GameScene extends Phaser.Scene {
    private playerChoiceText!: Phaser.GameObjects.Text;
    private aiChoiceText!: Phaser.GameObjects.Text;
    private resultText!: Phaser.GameObjects.Text;
    private scoreText!: Phaser.GameObjects.Text;
    private playerWins: number = 0;
    private aiWins: number = 0;
    private ties: number = 0;

    private playerCanChoose: boolean = true;
    private playAgainButton!: Phaser.GameObjects.Text;

    constructor() {
        super('GameScene'); // Name of this scene
    }

    preload() {
        // No assets for this simple game, but this is where you'd load them
        // this.load.image('battleship', 'assets/battleship.png');
    }

    create() {
        // Game Title
        this.add.text(this.cameras.main.centerX, 50, 'Naval Rock, Paper, Scissors', {
            fontSize: '40px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Player Choice Buttons
        const addShipButton = (x: number, y: number, shipType: ShipType) => {
            const button = this.add.text(x, y, shipType, buttonStyle)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            button.on('pointerdown', () => {
                if (this.playerCanChoose) {
                    button.setStyle(buttonPressedStyle);
                    this.handlePlayerChoice(shipType); // Call instance method
                }
            });

            button.on('pointerover', () => {
                if (this.playerCanChoose) {
                    button.setStyle(buttonHoverStyle);
                }
            });

            button.on('pointerout', () => {
                if (this.playerCanChoose) {
                    button.setStyle(buttonStyle);
                }
            });

            return button;
        };

        addShipButton(this.cameras.main.centerX - 200, 200, 'Battleship');
        addShipButton(this.cameras.main.centerX, 200, 'Cruiser');
        addShipButton(this.cameras.main.centerX + 200, 200, 'Destroyer');

        // Display areas
        this.playerChoiceText = this.add.text(this.cameras.main.centerX, 300, 'Your Choice: -', {
            fontSize: '28px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.aiChoiceText = this.add.text(this.cameras.main.centerX, 350, 'AI Choice: -', {
            fontSize: '28px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.resultText = this.add.text(this.cameras.main.centerX, 420, 'Choose your vessel!', {
            fontSize: '36px',
            color: '#ff0', // Bright yellow for results
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.scoreText = this.add.text(this.cameras.main.centerX, 500, `Score: Player ${this.playerWins} | AI ${this.aiWins} | Ties ${this.ties}`, {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Play Again button (initially hidden)
        this.playAgainButton = this.add.text(this.cameras.main.centerX, 550, 'Play Again', buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setVisible(false) // Hide until a round is finished
            .setName('PlayAgainButton');

        this.playAgainButton.on('pointerdown', () => {
            this.playAgainButton.setStyle(buttonPressedStyle);
            this.resetGame(); // Call instance method
        });

        this.playAgainButton.on('pointerover', () => {
            this.playAgainButton.setStyle(buttonHoverStyle);
        });

        this.playAgainButton.on('pointerout', () => {
            this.playAgainButton.setStyle(buttonStyle);
        });
    }

    update() {
        // Runs every frame - no continuous updates needed for this game.
    }

    private handlePlayerChoice(playerShip: ShipType) {
        if (!this.playerCanChoose) return;
        this.playerCanChoose = false;

        const aiShip = this.getAiChoice();

        this.playerChoiceText.setText(`Your Choice: ${playerShip}`);
        this.aiChoiceText.setText(`AI Choice: ${aiShip}`);

        const result = determineWinner(playerShip, aiShip); // Use imported function
        this.displayResult(result);

        this.time.delayedCall(1500, () => {
            this.playAgainButton.setVisible(true);
        });
    }

    private getAiChoice(): ShipType {
        const ships: ShipType[] = ['Battleship', 'Cruiser', 'Destroyer'];
        const randomIndex = Phaser.Math.Between(0, ships.length - 1);
        return ships[randomIndex];
    }

    private displayResult(result: 'player' | 'ai' | 'tie') {
        let message: string;
        let color: string;

        switch (result) {
            case 'player':
                this.playerWins++;
                message = 'You Win! Your fleet is victorious!';
                color = '#00ff00'; // Green
                break;
            case 'ai':
                this.aiWins++;
                message = 'You Lose! The enemy fleet prevails!';
                color = '#ff0000'; // Red
                break;
            case 'tie':
                this.ties++;
                message = 'It\'s a Tie! A stalemate.';
                color = '#ffff00'; // Yellow
                break;
        }
        this.resultText.setText(message);
        this.resultText.setColor(color);
        this.updateScoreText();
    }

    private updateScoreText() {
        this.scoreText.setText(`Score: Player ${this.playerWins} | AI ${this.aiWins} | Ties ${this.ties}`);
    }

    private resetGame() {
        this.playerCanChoose = true;
        this.playerChoiceText.setText('Your Choice: -');
        this.aiChoiceText.setText('AI Choice: -');
        this.resultText.setText('Choose your vessel!');
        this.resultText.setColor('#ff0');

        this.playAgainButton.setVisible(false);

        // Reset button styles
        this.children.getAll().forEach(child => {
            if (child instanceof Phaser.GameObjects.Text && (child.text === 'Battleship' || child.text === 'Cruiser' || child.text === 'Destroyer')) {
                child.setStyle(buttonStyle); // Apply the standard button style
            }
        });
    }
}