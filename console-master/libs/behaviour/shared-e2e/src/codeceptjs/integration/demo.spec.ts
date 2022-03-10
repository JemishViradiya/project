import { Demo } from '@ues-behaviour/shared-e2e/pages'

Feature('Demo')

Scenario('Form Interactions', ({ I }) => {
  I.say('"Form Interactions" scenario')

  Demo.waitForPage()
  Demo.goToFormTab()
  Demo.selectGender('Female')
  Demo.selectHobbies(['Music', 'Reading'])
  Demo.fillInEmail('demo@blackberry.com')
  Demo.selectCountry('Brazil')

  I.say('Scenario executed')
})

Scenario('Negative Testing', ({ I }) => {
  Demo.waitForPage()

  I.findByRole('heading', { level: 3, name: 'List Of Policy Names' }).should('be.visible')
  Demo.goToFormTab()

  I.findAllByRole('heading', { level: 3, name: 'List Of Policy Names' }).should('not.exist')
})
