import { Demo } from '@ues-behaviour/shared-e2e/pages'

describe('Demo', () => {
  it('Form Interactions', () => {
    I.say('"Form Interactions" scenario')

    Demo.waitForPage('/demo.html')
    Demo.goToFormTab()
    Demo.selectGender('Female')
    Demo.selectHobbies(['Music', 'Reading'])
    Demo.fillInEmail('demo@blackberry.com')
    Demo.selectCountry('Brazil')

    I.say('Scenario executed')
  })

  it('Negative Testing', () => {
    Demo.waitForPage('/demo.html')

    I.findByRole('heading', { level: 3, name: 'List Of Policy Names' }).should('be.visible')
    Demo.goToFormTab()

    I.findAllByRole('heading', { level: 3, name: 'List Of Policy Names' }).should('not.exist')
  })
})
