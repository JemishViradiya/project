import { I } from '@ues-behaviour/shared-e2e'

import { getAddNewPolicyButton, getARRTitle, verifyHashEquals } from '../support/utils'

describe('Persona risk detection policies', () => {
  before(() => {
    I.loadI18nNamespaces('components', 'gateway-settings', 'profiles', 'bis/shared', 'bis/ues')
  })
  describe('Automatic Risk Reduction (ARR), checking if the checkbox exist with UES.ARR.Enabled on true', () => {
    before(() => {
      I.visit('#/list/riskAssessment', {
        onBeforeLoad: contentWindow => {
          contentWindow.localStorage.setItem('UES_DATA_MOCK', 'true')
          contentWindow.localStorage.setItem('UES.ARR.Enabled', 'true')
          contentWindow.localStorage.setItem('ues.action.orchestrator.enabled', 'true')
        },
      })
    })
    it('Should render ARR Field', () => {
      getAddNewPolicyButton().click()
      verifyHashEquals('#/riskAssessment/create')
      getARRTitle().should('exist')
    })
  })

  describe('Automatic Risk Reduction (ARR), checking if the checkbox does not exist with UES.ARR.Enabled on false', () => {
    before(() => {
      I.visit('#/list/riskAssessment', {
        onBeforeLoad: contentWindow => {
          contentWindow.localStorage.setItem('UES_DATA_MOCK', 'true')
          contentWindow.localStorage.setItem('UES.ARR.Enabled', 'false')
          contentWindow.localStorage.setItem('ues.action.orchestrator.enabled', 'true')
        },
      })
    })
    it('Should not render ARR Field', () => {
      getAddNewPolicyButton().click()
      verifyHashEquals('#/riskAssessment/create')
      getARRTitle().should('not.exist')
    })
  })
})
