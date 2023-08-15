describe('Map View', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
    cy.url().should('include', '/de')
    cy.get('[data-cy=mapCard]')
      .click()
  })

  it('Show main components of Map', () => {
    cy.get('[data-cy=map]').should('be.visible')
    cy.get('.tab-left')
    cy.get('.tab-right')
  })

  it('Use filter function: Indoor activities', () => {
    cy.get('[data-cy=filterButton]')
      .click()
    cy.get('[data-cy=categoriesLabel]')
      .click()
    cy.get('[data-cy=filterCategories] [type="checkbox"]')
      .should('be.checked')
    cy.get('[data-cy="filterCategories"]')
      .contains('Draußen')
      .click()
    cy.get('[data-cy="filterCategories"]')
      .should('not.be.checked')
    cy.get('[data-cy=tagsLabel]')
    cy.get('[data-cy=filterTags] [type="checkbox"]')
      .should('not.be.checked')
    cy.get('[data-cy="filterTags"]')
      .contains('Schietwetter')
      .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
      .click()
    cy.get('[data-cy="filterTags"]')
      .contains('Schietwetter')
      .should('have.css', 'background-color', 'rgb(0, 48, 100)')
    cy.get('[id="results-button"]')
      .click()
    cy.get('[data-cy=map]').should('be.visible')
  })

  it('Shows search bar and result on map', () => {
    cy.get('.right > .btn')
      .click()
    cy.get('[data-cy="searchBarInput"]')
      .should('be.visible')
      .type('Focke')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000) // Wait until map fixated on search input
    cy.url().should('include', 'searchQuery=')
    cy.get('.leaflet-marker-icon')
  })

  it('Shows noGPSModal', () => {
    cy.get('[data-cy="noGPSBar"]')
      .click()
    cy.get('[data-cy="noGPSModal"]')
    cy.get('h3')
      .contains('GPS ist deaktiviert')
  })
})
