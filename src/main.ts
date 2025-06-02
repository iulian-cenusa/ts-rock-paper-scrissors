import Phaser from 'phaser';

// Define the types of ships
type ShipType = 'Battleship' | 'Cruiser' | 'Destroyer';

// Game configuration
const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO, // Use WebGL if available, otherwise Canvas
    width: 800,
    height: 600,
    backgroundColor: '#0a1a2a', // Dark blue, like the ocean
    parent: 'game-container', // ID of the div in index.html
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Global variables for the game
let playerChoiceText: Phaser.GameObjects.Text;
let aiChoiceText: Phaser.GameObjects.Text;
let resultText: Phaser.GameObjects.Text;
let scoreText: Phaser.GameObjects.Text;
let playerWins = 0;
let aiWins = 0;
let ties = 0;

let playerCanChoose = true; // Flag to prevent multiple choices per round

// Declare playAgainButton as a global variable so it can be accessed by handlePlayerChoice and resetGame
let playAgainButton: Phaser.GameObjects.Text;

// Phaser game instance
new Phaser.Game(gameConfig);

function preload(this: Phaser.Scene) {
    // No assets (images, sounds) needed for this simple text-based game.
    // If you add images later, this is where you'd load them:
    // this.load.image('battleship', 'assets/battleship.png');
}

function create(this: Phaser.Scene) {
    // Game Title
    this.add.text(this.cameras.main.centerX, 50, 'Naval Rock, Paper, Scissors', {
        fontSize: '40px',
        color: '#fff',
        fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Player Choice Buttons
    const buttonStyle = {
        fontSize: '32px',
        color: '#ffdd00', // Yellow for buttons
        backgroundColor: '#005080', // Darker blue
        padding: { x: 20, y: 10 },
        fontFamily: 'Arial',
        align: 'center'
    };

    const buttonHoverStyle = {
        color: '#ffffff',
        backgroundColor: '#0070a0' // Lighter blue on hover
    };

    const buttonPressedStyle = {
        color: '#cccccc',
        backgroundColor: '#003060' // Even darker blue on press
    };

    const addShipButton = (x: number, y: number, shipType: ShipType) => {
        const button = this.add.text(x, y, shipType, buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        button.on('pointerdown', () => {
            if (playerCanChoose) {
                button.setStyle(buttonPressedStyle);
                handlePlayerChoice.call(this, shipType);
            }
        });

        button.on('pointerover', () => {
            if (playerCanChoose) {
                button.setStyle(buttonHoverStyle);
            }
        });

        button.on('pointerout', () => {
            if (playerCanChoose) {
                button.setStyle(buttonStyle);
            }
        });

        return button;
    };

    addShipButton(this.cameras.main.centerX - 200, 200, 'Battleship');
    addShipButton(this.cameras.main.centerX, 200, 'Cruiser');
    addShipButton(this.cameras.main.centerX + 200, 200, 'Destroyer');

    // Display areas
    playerChoiceText = this.add.text(this.cameras.main.centerX, 300, 'Your Choice: -', {
        fontSize: '28px',
        color: '#fff',
        fontFamily: 'Arial'
    }).setOrigin(0.5);

    aiChoiceText = this.add.text(this.cameras.main.centerX, 350, 'AI Choice: -', {
        fontSize: '28px',
        color: '#fff',
        fontFamily: 'Arial'
    }).setOrigin(0.5);

    resultText = this.add.text(this.cameras.main.centerX, 420, 'Choose your vessel!', {
        fontSize: '36px',
        color: '#ff0', // Bright yellow for results
        fontFamily: 'Arial',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    scoreText = this.add.text(this.cameras.main.centerX, 500, `Score: Player ${playerWins} | AI ${aiWins} | Ties ${ties}`, {
        fontSize: '24px',
        color: '#fff',
        fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Play Again button (initially hidden)
    playAgainButton = this.add.text(this.cameras.main.centerX, 550, 'Play Again', buttonStyle)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setVisible(false) // Hide until a round is finished
        .setName('PlayAgainButton'); // <--- ADD THIS LINE to give it a name

    playAgainButton.on('pointerdown', () => {
        playAgainButton.setStyle(buttonPressedStyle);
        resetGame.call(this); // Use call(this) to maintain context
    });

    playAgainButton.on('pointerover', () => {
        playAgainButton.setStyle(buttonHoverStyle);
    });

    playAgainButton.on('pointerout', () => {
        playAgainButton.setStyle(buttonStyle);
    });
}

function update(this: Phaser.Scene, time: number, delta: number) {
    // This function runs every frame.
    // For this game, we don't need continuous updates, but it's good practice
    // to have it if you were doing animations or complex game logic.
}

function handlePlayerChoice(this: Phaser.Scene, playerShip: ShipType) {
    if (!playerCanChoose) return; // Prevent multiple choices
    playerCanChoose = false; // Disable choices after player makes one

    const aiShip = getAiChoice();

    playerChoiceText.setText(`Your Choice: ${playerShip}`);
    aiChoiceText.setText(`AI Choice: ${aiShip}`);

    const result = determineWinner(playerShip, aiShip);
    displayResult(result);

    // Show the "Play Again" button after a delay
    this.time.delayedCall(1500, () => { // 1.5 seconds delay
        // Now we can directly use the global playAgainButton variable
        playAgainButton.setVisible(true);
    });
}

function getAiChoice(): ShipType {
    const ships: ShipType[] = ['Battleship', 'Cruiser', 'Destroyer'];
    const randomIndex = Phaser.Math.Between(0, ships.length - 1);
    return ships[randomIndex];
}

function determineWinner(player: ShipType, ai: ShipType): 'player' | 'ai' | 'tie' {
    if (player === ai) {
        ties++;
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
        playerWins++;
        return 'player';
    } else {
        aiWins++;
        return 'ai';
    }
}

function displayResult(result: 'player' | 'ai' | 'tie') {
    let message: string;
    let color: string;

    switch (result) {
        case 'player':
            message = 'You Win! Your fleet is victorious!';
            color = '#00ff00'; // Green
            break;
        case 'ai':
            message = 'You Lose! The enemy fleet prevails!';
            color = '#ff0000'; // Red
            break;
        case 'tie':
            message = 'It\'s a Tie! A stalemate.';
            color = '#ffff00'; // Yellow
            break;
    }
    resultText.setText(message);
    resultText.setColor(color);
    updateScoreText();
}

function updateScoreText() {
    scoreText.setText(`Score: Player ${playerWins} | AI ${aiWins} | Ties ${ties}`);
}

function resetGame(this: Phaser.Scene) {
    playerCanChoose = true; // Allow player to choose again
    playerChoiceText.setText('Your Choice: -');
    aiChoiceText.setText('AI Choice: -');
    resultText.setText('Choose your vessel!');
    resultText.setColor('#ff0'); // Reset result text color

    // Now we can directly use the global playAgainButton variable
    playAgainButton.setVisible(false); // Hide the button again


    // Reset button styles
    this.children.getAll().forEach(child => {
        if (child instanceof Phaser.GameObjects.Text && (child.text === 'Battleship' || child.text === 'Cruiser' || child.text === 'Destroyer')) {
            child.setStyle({
                fontSize: '32px',
                color: '#ffdd00',
                backgroundColor: '#005080',
                padding: { x: 20, y: 10 },
                fontFamily: 'Arial',
                align: 'center'
            });
        }
    });
}