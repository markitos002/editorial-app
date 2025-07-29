// cypress.config.js - Configuración de Cypress
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    specPattern: 'tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'tests/e2e/support/e2e.js',
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    API_URL: 'http://localhost:4000/api',
    ADMIN_EMAIL: 'admin@editorial.com',
    ADMIN_PASSWORD: 'admin123'
  }
});
