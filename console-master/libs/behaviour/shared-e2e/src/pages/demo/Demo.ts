export const Demo = {
  pageTitle: 'Welcome To Demo Testing Page!!!',
  waitForPage(url = '/demo') {
    I.visit(url)
    I.findByRole('heading', { level: 1, name: this.pageTitle }).should('exist')
  },
  goToFormTab() {
    I
      // nav
      .findByRole('navigation')
      .as('nav')
      // button
      .findByRole('button', { name: 'Form' })
      .as('form')
      // click
      .click()
    I.findByRole('heading', { level: 2, name: 'Fill In Details and click Submit' })
  },
  //Sample method where I tried using via chainable element
  fillInEmail(emailAddress: string) {
    I.findByRole('textbox', { name: 'Email' }).as('email').fillField(emailAddress)
  },
  selectGender(gender: string) {
    I.findByRole('radio', { name: gender }).as(`gender:${gender}`).check()
  },
  selectHobbies(hobbies: string[]) {
    for (const hobby in hobbies) {
      I.findByRole('checkbox', { name: hobbies[hobby] }).check()
    }
  },
  selectCountry(country: 'Australia' | 'Brazil' | 'Colombia' | 'India' | 'United States Of America') {
    I.findByRole('combobox', { name: 'Country' }).select(country)
  },
}
