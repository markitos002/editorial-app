// tests/e2e/support/e2e.js - Comandos y configuración global de E2E
import './commands'

// Import commands.js using ES2015 syntax:
// Alternatively you can use CommonJS syntax:
// require('./commands')

// Cypress configuración global
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  // on uncaught exceptions from your application
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  return true
})

// Configurar viewport por defecto
beforeEach(() => {
  cy.viewport(1280, 720)
})
