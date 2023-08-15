describe('Favorites View', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
    cy.url().should('include', '/de')
  })

  it('Show empty favorites list', () => {
    cy.get('[data-cy=favoritesCard]')
      .click()
    cy.url().should('include', 'Favorite=true')
    cy.get('[data-cy=noResultsContainer]')
      .contains('Es sind noch keine Favoriten vorhanden.')
  })

  it('Add favorite to list and view list', () => {
    cy.get('[data-cy=listCard]')
      .click()
    cy.url().should('include', '/list')
    cy.get('[data-cy=institutionsList]')
      .eq(1)
    cy.get('[data-cy=favoriteButton]')
      .eq(1)
      .click()
    cy.get('[data-cy=backButton]')
      .click()
    cy.get('[data-cy=favoritesCard]')
      .click()
    cy.url().should('include', 'Favorite=true')
    cy.get('[data-cy=institutionsList]')
      .should('exist')
    // Remove institution from favorites
    cy.get('[data-cy=favoriteButton]')
      .click()
    cy.get('[data-cy=noResultsContainer]')
      .contains('Es sind noch keine Favoriten vorhanden.')
  })
})
