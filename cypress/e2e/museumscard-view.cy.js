describe('MuseumsCard-view', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
    cy.url().should('include', '/de')
  })

  it('View Museumscard on Details Page', () => {
    // Show all institutions belonging to Museumscard
    cy.get('[data-cy=filtersCard]')
      .click()
    cy.url().should('include', '/filters')
    cy.get('[data-cy=categoriesLabel]')
      .contains('Kategorien')
    cy.get('[data-cy=tagsLabel]')
      .contains('Angebote')
    cy.get('[data-cy="filterTags"]')
      .contains('MuseumsCard')
      .click()
    // Test if MuseumsCard filter Button is activated
    cy.get('[data-cy="filterTags"]')
      .contains('MuseumsCard')
      .should('have.css', 'background-color', 'rgb(0, 48, 100)')
    cy.get('[data-cy=resultsButton]')
      .click()
    cy.get('.tab-right')
      .click()
    cy.get(':nth-child(1) > .li-container')
      .click()
    cy.get('[data-cy=institutionHeadline]')
    // Museumscard activated
    cy.get('[data-cy=museumsCard]')
      .should('exist')
      .contains('MuseumsCard')
    cy.get('[data-cy=MuseumsCardLogo]')
  })

  it('View Museumscard Page', () => {
    // Link to MuseumsCard Page
    cy.get('[data-cy=videoClipsCard]')
      .should('not.exist')
    cy.get('[data-cy=museumsCardKachel]')
      .click()
    cy.url().should('include', '/museumscard')
    // Header
    cy.get('[data-cy=kulturfinderLogo]')
    // Main Page
    cy.get('[data-cy=museumsCardLogo]')
    cy.get('[data-cy=museumsCardKachel]')
    cy.get('[data-cy=mapCard]')
    cy.get('[data-cy=listCard]')
    cy.get('[data-cy=museumsCardHeadline]')
    cy.get('[data-cy=museumsCardDescription1]')
    cy.get('[data-cy=museumsCardDescription2]')
    cy.get('[data-cy=museumsCardNahverkehrDescription]')
    cy.get('[data-cy=museumsCardDescription3]')
    // Footer
    cy.get('[data-cy=about]')
  })

  it('Tests Link to Home Page', () => {
    // Link to MuseumsCard Page
    cy.get('[data-cy=museumsCardKachel]')
      .click()
    cy.url().should('include', '/museumscard')
    // Link to Homepage
    cy.get('[data-cy=kulturfinderLogo]')
      .click()
    // View main components on dashboard
    cy.get('[data-cy=localeChanger]')
    cy.get('[data-cy=mainLogo]')
    cy.get('[data-cy=searchBarButton]')
    cy.get('.dashboard-carousel')
  })

  it('Tests Link to Impressum', () => {
    // Link to MuseumsCard Page
    cy.get('[data-cy=museumsCardKachel]')
      .click()
    cy.url().should('include', '/museumscard')
    // Link to Impressum
    cy.get('[data-cy=about]')
      .click()
    // View main components of Impressum
    cy.title().should('contain', 'Über uns')
  })

  // Test if official MuseumsCard Website is opened -> Cypress doesn't test if new Tab is opened

  it('Tests Link to Map and activated MuseumsCard filter', () => {
    // Link to MuseumsCard Page
    cy.get('[data-cy=museumsCardKachel]')
      .click()
    cy.url().should('include', '/museumscard')
    // Link to Map Page
    cy.get('[data-cy=mapCard]')
      .click()
    cy.url().should('include', '/map')
    // Check if MuseumsCard filter activated
    cy.get('[data-cy=filterButton]')
      .contains('1')
    cy.get('[data-cy=filterButton]')
      .click()
    // Test if MuseumsCard filter activated
    cy.get('[data-cy="filterTags"]')
      .contains('MuseumsCard')
      .should('have.css', 'background-color', 'rgb(0, 48, 100)')
  })

  it('Tests Link to List and activated MuseumsCard filter', () => {
    // Link to MuseumsCard Page
    cy.get('[data-cy=museumsCardKachel]')
      .click()
    cy.url().should('include', '/museumscard')
    // Link to List Page
    cy.get('[data-cy=listCard]')
      .click()
    cy.url().should('include', '/list')
    // Check if MuseumsCard filter activated
    cy.get('[data-cy=filterButton]')
      .contains('1')
    cy.get('[data-cy=filterButton]')
      .click()
    // Test if MuseumsCard filter activated
    cy.get('[data-cy="filterTags"]')
      .contains('MuseumsCard')
      .should('have.css', 'background-color', 'rgb(0, 48, 100)')
  })
})
