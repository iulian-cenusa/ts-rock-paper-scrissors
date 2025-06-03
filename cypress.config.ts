import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080', // This is where your webpack-dev-server runs
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // Look for test files here
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});