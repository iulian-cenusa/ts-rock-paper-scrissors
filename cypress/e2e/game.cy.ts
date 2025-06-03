describe('Naval RPS Game E2E Tests', () => {
  beforeEach(() => {
    // Visit the game page before each test
    cy.visit('/');
    // Unstub random after each test to ensure a clean slate, especially if a test
    // stubs it multiple times or different ways.
    // However, for most test cases, you'd stub *per test* or *per scenario*.
    // cy.unstubRandom(); // This can be added if you have complex stubbing logic.
  });

  it('should display the game title and initial score', () => {
    cy.contains('Naval Rock, Paper, Scissors').should('be.visible');
    cy.contains('Your Choice: -').should('be.visible');
    cy.contains('AI Choice: -').should('be.visible');
    cy.contains('Choose your vessel!').should('be.visible');
    cy.contains('Score: Player 0 | AI 0 | Ties 0').should('be.visible');
  });

  it('should allow player to choose a ship and display AI choice and result (win)', () => {
    // AI chooses 'Cruiser' (index 1) which player's Battleship beats
    cy.stubRandom(0.5); // Use the custom command

    cy.get('canvas').should('be.visible');

    // Click 'Battleship' button
    cy.contains('Battleship').click();

    cy.contains('Your Choice: Battleship').should('be.visible');
    cy.contains('AI Choice: Cruiser').should('be.visible');
    cy.contains('You Win! Your fleet is victorious!').should('be.visible');
    cy.contains('Score: Player 1 | AI 0 | Ties 0').should('be.visible');
    cy.contains('Play Again').should('be.visible');
  });

  it('should reset the game when "Play Again" is clicked', () => {
    // Play a round first for AI to win
    cy.stubRandom(0.1); // AI chooses Battleship (index 0)
    cy.contains('Cruiser').click(); // Player chooses Cruiser (Cruiser loses to Battleship)
    cy.contains('You Lose! The enemy fleet prevails!').should('be.visible');
    cy.contains('Score: Player 0 | AI 1 | Ties 0').should('be.visible');

    cy.contains('Play Again').click();

    cy.contains('Your Choice: -').should('be.visible');
    cy.contains('AI Choice: -').should('be.visible');
    cy.contains('Choose your vessel!').should('be.visible');
    cy.contains('Score: Player 0 | AI 1 | Ties 0').should('be.visible');
    cy.contains('Play Again').should('not.be.visible');
  });

  it('should handle a tie scenario correctly', () => {
    cy.stubRandom(0.1); // AI chooses 'Battleship' (index 0)
    cy.contains('Battleship').click();

    cy.contains('Your Choice: Battleship').should('be.visible');
    cy.contains('AI Choice: Battleship').should('be.visible');
    cy.contains("It's a Tie! A stalemate.").should('be.visible');
    cy.contains('Score: Player 0 | AI 0 | Ties 1').should('be.visible');
    cy.contains('Play Again').should('be.visible');
  });

  it('should handle a loss scenario correctly', () => {
    cy.stubRandom(0.9); // AI chooses 'Destroyer' (index 2)
    cy.contains('Battleship').click(); // Player chooses Battleship (Battleship loses to Destroyer)

    cy.contains('Your Choice: Battleship').should('be.visible');
    cy.contains('AI Choice: Destroyer').should('be.visible');
    cy.contains('You Lose! The enemy fleet prevails!').should('be.visible');
    cy.contains('Score: Player 0 | AI 1 | Ties 0').should('be.visible');
    cy.contains('Play Again').should('be.visible');
  });

  it('should accumulate scores over multiple rounds', () => {
    // Stub Math.random() for sequential calls within this test
    cy.window().then((win) => {
        const randomStub = cy.stub(win.Math, 'random');

        // Round 1: Player Wins (Battleship vs Cruiser)
        randomStub.onCall(0).returns(0.5); // AI chooses Cruiser (index 1)
        cy.contains('Battleship').click();
        cy.contains('Score: Player 1 | AI 0 | Ties 0').should('be.visible');
        cy.contains('Play Again').click();

        // Round 2: AI Wins (Destroyer vs Battleship)
        randomStub.onCall(1).returns(0.1); // AI chooses Battleship (index 0)
        cy.contains('Destroyer').click();
        cy.contains('Score: Player 1 | AI 1 | Ties 0').should('be.visible');
        cy.contains('Play Again').click();

        // Round 3: Tie (Cruiser vs Cruiser)
        randomStub.onCall(2).returns(0.5); // AI chooses Cruiser (index 1)
        cy.contains('Cruiser').click();
        cy.contains('Score: Player 1 | AI 1 | Ties 1').should('be.visible');
    });
  });
});