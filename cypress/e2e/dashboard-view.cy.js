// ./node_modules/.bin/cypress open
describe('Dashboard-view', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
    cy.url().should('include', '/de')
  })

  it('View main components', () => {
    cy.get('[data-cy=localeChanger]')
    cy.get('[data-cy=mainLogo]')
    cy.get('[data-cy=searchBarButton]')
    cy.get('[data-cy=intitutionCarousel]')
  })

  it('View search bar on click', () => {
    cy.get('[data-cy=searchBarButton]')
      .click()
    cy.get('[data-cy=searchBarInput]')
      .should('be.visible')
    cy.get('[data-cy=searchPreview]')
      .should('not.be.visible')
    cy.get('[data-cy=searchBarInput]')
      .type('Test')
    cy.get('[data-cy=searchPreview]')
      .should('be.visible')

    cy.get('[data-cy=localeChanger]')
      .click()
    cy.get('[data-cy=searchPreview]')
      .should('not.be.visible')

    cy.get('[data-cy=searchBarInput]')
      .click()
    cy.get('[data-cy=searchPreview]')
      .should('be.visible')

    cy.get('[data-cy=searchBarButton]')
      .click()
    cy.get('[data-cy=searchPreview]')
      .should('not.be.visible')
    cy.get('[data-cy=searchBarInput]')
      .should('not.be.visible')
  })

  it('View cards on main page', () => {
    cy.get('[data-cy=mapCard]')
    cy.get('[data-cy=listCard]')
    cy.get('[data-cy=favoritesCard]')
    cy.get('[data-cy=filtersCard]')
    cy.get('[data-cy=livingImagesCard]')
    cy.get('[data-cy=museumsCardKachel]')
  })

  it('View sign language pop up', () => {
    cy.get('[data-cy=signLanguage]')
      .click()
    cy.get('[data-cy=signLanguageModal]')
      .contains('Gebärdensprache')
    cy.get('#vjs_video_3_html5_api').its('0.paused').should('equal', true)
  })

  it('View Impressum Page', () => {
    cy.get('[data-cy=impressum]')
      .click()
    cy.get('h1').contains('Über uns')
  })

  it('Test local changer', () => {
    cy.get('[data-cy=localeChanger]')
      .click()
    // Change langue to english
    cy.get(':nth-child(2) > .dropdown-item')
      .click()
    cy.url().should('include', '/en')
    cy.get('[data-cy=mapCard]')
      .contains('Map')
    // Change language to danish
    cy.get('[data-cy=localeChanger]')
      .click()
    cy.get(':nth-child(3) > .dropdown-item')
      .click()
    cy.url().should('include', '/da')
    cy.get('[data-cy=mapCard]')
      .contains('Kort')
  })
})
