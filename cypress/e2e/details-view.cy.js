describe('Details View', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
    cy.url().should('include', '/de')
    cy.get('[data-cy=listCard]')
      .click()
    cy.url().should('include', '/list')
    cy.get('[data-cy=institutionsList]')
      .eq(1)
      .click()
    cy.url().should('include', '/details')
  })

  // cy.wait is necessery because cypress can't find all components if page is not fully loaded

  it('Show main components', () => {
    // Header
    cy.get('[data-cy=backButton]')
    cy.get('[data-cy=kulturfinderLogo]')
    cy.get('[data-cy=favoriteButton]')
    cy.get('[data-cy=shareButton]')
    // Main Body
    cy.get('[data-cy=imageCarousel]')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000)
    cy.get('[data-cy=institutionHeadline]')
    cy.get('[data-cy=institutionDescription]')
    // Contacts
    cy.get('[data-cy=navigation]')
    cy.get('[data-cy=contact]')
    cy.get('[data-cy=openingTimes]')
  })

  // Test Header functionality
  it('Test Back-Button', () => {
    cy.get('[data-cy=backButton]')
      .click()
    cy.url().should('not.include', '/details')
  })

  it('Test link to Home Page', () => {
    cy.get('[data-cy=kulturfinderLogo]')
      .click()
    // View main components on dashboard
    cy.get('[data-cy=localeChanger]')
    cy.get('[data-cy=mainLogo]')
    cy.get('[data-cy=searchBarButton]')
    cy.get('.dashboard-carousel')
  })

  it('Test Favorite-Button', () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1500) // Favorite Button only works if all components fully visible
    cy.get('[data-cy=favoriteButton]')
      .click()
    // TODO Test CSS behaviour
    cy.get('[data-cy=kulturfinderLogo]')
      .click()
    // View main components on dashboard
    cy.get('[data-cy=localeChanger]')
    cy.get('[data-cy=mainLogo]')
    cy.get('[data-cy=searchBarButton]')
    cy.get('.dashboard-carousel')
    cy.get('[data-cy=favoritesCard]')
      .click()
    cy.get('[data-cy="institutionsList"]')
      .should('exist')
    // Remove institution from favorites
    cy.get('[data-cy=favoriteButton]')
      .click()
    cy.get('[data-cy=noResultsContainer]')
      .contains('Es sind noch keine Favoriten vorhanden.')
  })

  it('Test Share-Button', () => {
    cy.get('[data-cy=shareButton]')
      .click()
    cy.get('[data-cy=socialPopUp]')
    // Social Buttons
    cy.get('[data-cy=facebookSocial]')
    cy.get('[data-cy=twitterSocial]')
    cy.get('[data-cy=telegramSocial]')
    cy.get('[data-cy=whatsappSocial]')
    cy.get('[data-cy=emailSocial]')
    cy.get('[data-cy=shareLabel]')
      .contains('Teilen')
    // TODO Test if external links in new Tab is opened
    cy.get('.close')
      .click()
    // Test if Modal is closed
    cy.get('[data-cy=institutionHeadline]')
    cy.get('[data-cy=institutionDescription]')
  })

  it('View navigation components', () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1500)
    cy.get('[data-cy=institutionHeadline]')
    cy.get('[data-cy=navigation]')
    // Show on Map
    cy.get('[data-cy=showOnMap]')
      .click()
    cy.url().should('include', '/map')
    cy.get('h1')
      .contains('Karte')
    cy.get('[data-cy=backButton]')
      .click()
    // Check if back on Detail Page
    cy.get('[data-cy=institutionHeadline]')
    cy.get('[data-cy=institutionDescription]')
    // Drive to destination link and Nah.sh link not always visible and include external link
    // -> Cypress problem with conditional testing and testing if new tab is opened
  })

  it('View Footer', () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1500)
    cy.get('[data-cy=feedbackButton]')
      .click()
    // View Feedback Modal components
    cy.get('[data-cy=feedbackModal]')
      .contains('Feedback')
    cy.get('[data-cy=feedbackText]')
    cy.get('.close')
      .click()
    // View Impressum
    cy.get('[data-cy=impressum]')
      .click()
    cy.get('h1').contains('Über uns')
  })
})
