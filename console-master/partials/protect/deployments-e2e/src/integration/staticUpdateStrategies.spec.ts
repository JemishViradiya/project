import { CommonFns } from '@ues/assets-e2e'

import {
  getUpdateStrategiesDeleteButton,
  getUpdateStrategiesEditButton,
  getUpdateStrategiesExpansionDetails,
  getUpdateStrategiesExpansionSummary,
  getUpdateStrategiesStaticDescription,
  getUpdateStrategiesStaticDetails,
  getUpdateStrategiesStaticModifiedDate,
  getUpdateStrategiesStaticName,
  getUpdateStrategiesStaticProducts,
  getUpdateStrategiesStaticStrategies,
  getUpdateStrategiesStaticStrategiesProduct,
  getUpdateStrategiesStaticStrategiesTypeVersion,
  getUpdateStrategiesStaticSummary,
} from './../support/app.po'

const { loadingIconShould } = CommonFns(I)

describe('Update Strategies - Static', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
  })
  beforeEach(() => {
    window.localStorage.setItem('Deployments.UpdateRules.enabled', 'true')
    window.localStorage.setItem('Deployments.UpdateStrategies.enabled', 'true')
    I.visit('/')
    loadingIconShould('not.exist')
  })

  it('renders a static summary', () => {
    getUpdateStrategiesExpansionSummary().should('exist')
    getUpdateStrategiesStaticSummary().should('exist')
    getUpdateStrategiesStaticName().should('exist')
    getUpdateStrategiesStaticProducts().should('exist')
    getUpdateStrategiesStaticModifiedDate().should('exist')
    getUpdateStrategiesEditButton().should('exist')
    getUpdateStrategiesDeleteButton().should('exist')
  })

  it('can open and close static details', () => {
    getUpdateStrategiesExpansionDetails().should('not.exist')

    getUpdateStrategiesExpansionSummary().eq(1).click()

    getUpdateStrategiesExpansionDetails().should('exist')

    getUpdateStrategiesExpansionSummary().eq(1).click()

    getUpdateStrategiesExpansionDetails().should('not.exist')
  })

  it('renders static details', () => {
    getUpdateStrategiesStaticDetails().should('not.exist')
    getUpdateStrategiesStaticDescription().should('not.exist')
    getUpdateStrategiesStaticStrategies().should('not.exist')
    getUpdateStrategiesStaticStrategiesProduct().should('not.exist')
    getUpdateStrategiesStaticStrategiesTypeVersion().should('not.exist')

    getUpdateStrategiesExpansionSummary().eq(1).click()

    getUpdateStrategiesStaticDetails().should('exist')
    getUpdateStrategiesStaticDescription().should('exist')
    getUpdateStrategiesStaticStrategies().should('exist')
    getUpdateStrategiesStaticStrategiesProduct().should('exist')
    getUpdateStrategiesStaticStrategiesTypeVersion().should('exist')
  })

  it('can delete an Update Strategy', () => {
    // --TODO: test delete workflow once implemented

    getUpdateStrategiesExpansionDetails().should('not.exist')

    getUpdateStrategiesDeleteButton().eq(1).click()

    getUpdateStrategiesExpansionDetails().should('not.exist') // ensure delete click did not toggle detail visibility

    getUpdateStrategiesExpansionSummary().eq(1).click()

    getUpdateStrategiesExpansionDetails().should('exist')

    getUpdateStrategiesDeleteButton().eq(1).click()

    getUpdateStrategiesExpansionDetails().should('exist') // ensure delete click did not toggle detail visibility
  })
})
