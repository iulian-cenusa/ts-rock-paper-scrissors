// cypress/support/commands.ts

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Stubs Math.random() to return a specific value, allowing deterministic AI choices.
       * @param value The value to return for Math.random() (between 0 and 1).
       * @example cy.stubRandom(0.5); // AI will choose Cruiser
       */
      stubRandom(value: number): Chainable<null>;

      /**
       * Resets the stub for Math.random() to its original implementation.
       * @example cy.unstubRandom();
       */
      unstubRandom(): Chainable<null>;
    }
  }
}

Cypress.Commands.add('stubRandom', (value: number) => {
  cy.window().then((win) => {
    cy.stub(win.Math, 'random').returns(value).as('randomStub');
  });
});

Cypress.Commands.add('unstubRandom', () => {
  cy.window().then((win) => {
    if (win.Math.random.restore) { // Check if it was stubbed
      win.Math.random.restore(); // Restore the original function
    }
  });
});