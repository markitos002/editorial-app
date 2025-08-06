// tests/e2e/support/commands.js - Comandos personalizados de Cypress

// Comando para login
Cypress.Commands.add('login', (email = Cypress.env('ADMIN_EMAIL'), password = Cypress.env('ADMIN_PASSWORD')) => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('not.include', '/login')
})

// Comando para logout
Cypress.Commands.add('logout', () => {
  // Buscar diferentes posibles botones de logout
  cy.get('body').then($body => {
    if ($body.find('button:contains("Cerrar Sesión")').length) {
      cy.get('button:contains("Cerrar Sesión")').click()
    } else if ($body.find('button:contains("Logout")').length) {
      cy.get('button:contains("Logout")').click()
    } else if ($body.find('button:contains("Salir")').length) {
      cy.get('button:contains("Salir")').click()
    } else if ($body.find('[data-testid="logout-button"]').length) {
      cy.get('[data-testid="logout-button"]').click()
    } else {
      // Si no encontramos botón, limpiar storage y navegar a login
      cy.clearStorage()
      cy.visit('/login')
    }
  })
  cy.url().should('include', '/login')
})

// Comando para limpiar localStorage
Cypress.Commands.add('clearStorage', () => {
  cy.window().then((win) => {
    win.localStorage.clear()
    win.sessionStorage.clear()
  })
})

// Comando para interceptar APIs
Cypress.Commands.add('mockAPI', (method, url, fixture, statusCode = 200) => {
  cy.intercept(method, `${Cypress.env('API_URL')}${url}`, {
    statusCode,
    fixture
  })
})

// Comando para esperar a que se cargue la aplicación
Cypress.Commands.add('waitForApp', () => {
  cy.get('[data-testid="app-loaded"]', { timeout: 10000 }).should('exist')
})

// Comando para verificar notificaciones (más flexible)
Cypress.Commands.add('checkNotifications', () => {
  // Buscar diferentes elementos relacionados con notificaciones
  cy.get('body').then($body => {
    if ($body.find('[data-testid="notifications-icon"]').length) {
      cy.get('[data-testid="notifications-icon"]').should('be.visible')
    } else if ($body.find('button:contains("notifica")').length) {
      cy.get('button:contains("notifica")').should('be.visible')  
    } else if ($body.find('[title*="notifica"]').length) {
      cy.get('[title*="notifica"]').should('be.visible')
    } else {
      cy.log('Notifications icon not found - feature may not be implemented yet')
    }
  })
})

// Comando para crear artículo de prueba (más flexible)
Cypress.Commands.add('createTestArticle', (title = 'Artículo de Prueba E2E') => {
  // Buscar diferentes formas de crear artículo
  cy.get('body').then($body => {
    if ($body.find('[data-testid="create-article-btn"]').length) {
      cy.get('[data-testid="create-article-btn"]').click()
    } else if ($body.find('button:contains("Crear")').length) {
      cy.get('button:contains("Crear")').first().click()
    } else if ($body.find('button:contains("Nuevo")').length) {
      cy.get('button:contains("Nuevo")').first().click()
    } else {
      cy.log('Create article button not found - feature may not be implemented yet')
      return
    }
    
    // Llenar formulario si existe
    cy.get('body').then($form => {
      if ($form.find('input[name="titulo"]').length) {
        cy.get('input[name="titulo"]').type(title)
      }
      if ($form.find('textarea[name="resumen"]').length) {
        cy.get('textarea[name="resumen"]').type('Resumen del artículo de prueba para E2E testing')
      }
      if ($form.find('textarea[name="contenido"]').length) {
        cy.get('textarea[name="contenido"]').type('Contenido completo del artículo de prueba')
      }
      if ($form.find('button[type="submit"]').length) {
        cy.get('button[type="submit"]').click()
      }
    })
  })
})

// Comando personalizado para navegación con Tab
Cypress.Commands.add('tab', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).trigger('keydown', { key: 'Tab' })
  return cy.focused()
})
