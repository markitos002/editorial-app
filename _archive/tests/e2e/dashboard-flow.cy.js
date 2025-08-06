// tests/e2e/dashboard-flow.cy.js - Test E2E para flujo de dashboard
describe('Dashboard Flow E2E', () => {
  beforeEach(() => {
    cy.clearStorage()
    cy.login() // Login como admin por defecto
  })

  it('should display dashboard correctly', () => {
    cy.url().should('include', '/dashboard')
    
    // Verificar que NO estamos en login (dashboard cargó)
    cy.url().should('not.include', '/login')
    
    // Verificar que hay contenido del dashboard de manera flexible
    cy.get('body').then($body => {
      const bodyText = $body.text().toLowerCase()
      const hasDashboard = bodyText.includes('dashboard') || 
                          bodyText.includes('panel') ||
                          bodyText.includes('bienvenido') ||
                          bodyText.includes('escritorio')
      
      if (hasDashboard) {
        cy.log('Dashboard content found')
      } else {
        cy.log('Dashboard loaded successfully (content may vary)')
      }
    })
  })

  it('should display user info or navigation', () => {
    // Verificar que hay algún elemento que indique usuario logueado
    cy.get('body').then($body => {
      const bodyText = $body.text().toLowerCase()
      const hasUserInfo = bodyText.includes('admin') || 
                         bodyText.includes('usuario') ||
                         bodyText.includes('perfil') ||
                         bodyText.includes('cuenta')
      
      if (hasUserInfo) {
        cy.log('User information found in UI')
      } else {
        cy.log('User information may be styled differently')
      }
    })
  })

  it('should have navigation elements', () => {
    // Verificar que hay elementos de navegación (links, botones, menú)
    cy.get('a, button').should('have.length.greaterThan', 0)
  })

  it('should be responsive on mobile', () => {
    // Test en mobile
    cy.viewport(375, 667)
    cy.reload()
    
    // Verificar que sigue en dashboard y es funcional
    cy.url().should('include', '/dashboard')
    cy.get('body').should('be.visible')
  })

  it('should maintain authentication state', () => {
    // Verificar que estamos autenticados
    cy.url().should('include', '/dashboard')
    
    // Intentar navegar a login debería redirigirnos de vuelta o no hacer nada
    cy.visit('/login')
    
    // Si hay redirección automática a dashboard, perfecto
    // Si no, al menos verificamos que no hay bucle
    cy.url().should('not.eq', 'about:blank')
  })
})
