import { CommonFns } from '@ues/assets-e2e'

import {
  getUpdateStrategiesAddAnotherProductLink,
  getUpdateStrategiesAddAnotherProductLinkDisabled,
  getUpdateStrategiesCancelEditButton,
  getUpdateStrategiesDeleteButton,
  getUpdateStrategiesEditableDescription,
  getUpdateStrategiesEditableDetails,
  getUpdateStrategiesEditableName,
  getUpdateStrategiesEditableProductStrategy,
  getUpdateStrategiesEditableSummary,
  getUpdateStrategiesEditableSummaryModifiedDate,
  getUpdateStrategiesEditableSummaryName,
  getUpdateStrategiesEditableSummaryProducts,
  getUpdateStrategiesEditButton,
  getUpdateStrategiesEditStrategyProductSelect,
  getUpdateStrategiesEditStrategyProductSelectMenuItem,
  getUpdateStrategiesEditStrategyProductStaticProtect,
  getUpdateStrategiesEditStrategyTypeSelect,
  getUpdateStrategiesEditStrategyTypeSelectMenuItem,
  getUpdateStrategiesEditStrategyVersionMenuItem,
  getUpdateStrategiesEditStrategyVersionSelect,
  getUpdateStrategiesExpansionSummary,
  getUpdateStrategiesSaveEditButton,
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

describe('Update Strategies - Editable', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
  })
  beforeEach(() => {
    window.localStorage.setItem('Deployments.UpdateRules.enabled', 'true')
    window.localStorage.setItem('Deployments.UpdateStrategies.enabled', 'true')
    I.visit('/')
    loadingIconShould('not.exist')
  })

  it('can toggle the editable view', () => {
    getUpdateStrategiesStaticDetails().should('not.exist')
    getUpdateStrategiesEditableDetails().should('not.exist')

    getUpdateStrategiesExpansionSummary().eq(0).click()

    getUpdateStrategiesStaticDetails().should('exist')
    getUpdateStrategiesEditableDetails().should('not.exist')

    getUpdateStrategiesEditButton().eq(0).click()

    getUpdateStrategiesStaticDetails().should('not.exist')
    getUpdateStrategiesEditableDetails().should('exist')

    getUpdateStrategiesCancelEditButton().eq(0).click()
    getUpdateStrategiesExpansionSummary().eq(0).click()

    getUpdateStrategiesStaticDetails().should('not.exist')
    getUpdateStrategiesEditableDetails().should('not.exist')

    getUpdateStrategiesEditButton().eq(0).click()

    getUpdateStrategiesStaticDetails().should('not.exist')
    getUpdateStrategiesEditableDetails().should('exist')
  })

  it('can open and close the editable details', () => {
    getUpdateStrategiesEditableSummary().should('not.exist')
    getUpdateStrategiesStaticDetails().should('not.exist')
    getUpdateStrategiesEditableDetails().should('not.exist')

    getUpdateStrategiesEditButton().eq(0).click()

    getUpdateStrategiesEditableSummary().should('exist')
    getUpdateStrategiesStaticDetails().should('not.exist')
    getUpdateStrategiesEditableDetails().should('exist')

    getUpdateStrategiesExpansionSummary().eq(0).click()

    getUpdateStrategiesEditableSummary().should('exist')
    getUpdateStrategiesStaticDetails().should('not.exist')
    getUpdateStrategiesEditableDetails().should('not.exist')

    getUpdateStrategiesExpansionSummary().eq(0).click()

    getUpdateStrategiesEditableSummary().should('exist')
    getUpdateStrategiesStaticDetails().should('not.exist')
    getUpdateStrategiesEditableDetails().should('exist')
  })

  it('renders an editable summary', () => {
    getUpdateStrategiesEditableSummary().should('not.exist')
    getUpdateStrategiesEditableSummaryName().should('not.exist')
    getUpdateStrategiesEditableSummaryProducts().should('not.exist')
    getUpdateStrategiesEditableSummaryModifiedDate().should('not.exist')
    getUpdateStrategiesCancelEditButton().should('not.exist')
    getUpdateStrategiesSaveEditButton().should('not.exist')

    getUpdateStrategiesEditButton().eq(0).click()

    getUpdateStrategiesEditableSummary().should('exist')
    getUpdateStrategiesEditableSummaryName().should('exist')
    getUpdateStrategiesEditableSummaryProducts().should('exist')
    getUpdateStrategiesEditableSummaryModifiedDate().should('exist')
    getUpdateStrategiesCancelEditButton().should('exist')
    getUpdateStrategiesSaveEditButton().should('exist')
  })

  it('renders editable details', () => {
    getUpdateStrategiesEditableDetails().should('not.exist')
    getUpdateStrategiesEditStrategyProductStaticProtect().should('not.exist')
    getUpdateStrategiesEditableName().should('not.exist')
    getUpdateStrategiesEditableDescription().should('not.exist')
    getUpdateStrategiesAddAnotherProductLink().should('not.exist')
    getUpdateStrategiesEditStrategyProductSelect(1).should('not.exist')
    getUpdateStrategiesEditStrategyTypeSelect(1).should('not.exist')
    getUpdateStrategiesEditStrategyVersionSelect(1).should('not.exist')

    getUpdateStrategiesEditButton().eq(0).click()

    getUpdateStrategiesEditableDetails().should('exist')
    getUpdateStrategiesEditStrategyProductStaticProtect().should('exist')
    getUpdateStrategiesEditableName().should('exist')
    getUpdateStrategiesEditableDescription().should('exist')
    getUpdateStrategiesAddAnotherProductLink().should('exist')
    getUpdateStrategiesEditStrategyProductSelect(1).should('exist')
    getUpdateStrategiesEditStrategyTypeSelect(1).should('exist')
    getUpdateStrategiesEditStrategyVersionSelect(1).should('exist')
  })

  it('can modify an existing product update strategy', () => {
    getUpdateStrategiesEditButton().eq(0).click()

    // product name

    getUpdateStrategiesEditStrategyProductSelect(1).find('input').should('have.value', 'Optics')

    getUpdateStrategiesEditStrategyProductSelect(1).click()

    getUpdateStrategiesEditStrategyProductSelectMenuItem(1, 2).click()

    getUpdateStrategiesEditStrategyProductSelect(1).find('input').should('have.value', 'Persona')

    // strategy type

    getUpdateStrategiesEditStrategyTypeSelect(1).find('input').should('have.value', 'Fixed')

    getUpdateStrategiesEditStrategyTypeSelect(1).click()

    getUpdateStrategiesEditStrategyTypeSelectMenuItem(1, 0).click()

    getUpdateStrategiesEditStrategyTypeSelect(1).find('input').should('have.value', 'AutoUpdate')

    // version

    getUpdateStrategiesEditStrategyVersionSelect(1).find('.MuiInputBase-root').should('have.class', 'Mui-disabled')

    getUpdateStrategiesEditStrategyTypeSelect(1).click()

    getUpdateStrategiesEditStrategyTypeSelectMenuItem(1, 2).click()

    getUpdateStrategiesEditStrategyTypeSelect(1).find('input').should('have.value', 'Fixed')
    getUpdateStrategiesEditStrategyVersionSelect(1).find('.MuiInputBase-root').should('not.have.class', 'Mui-disabled')

    getUpdateStrategiesEditStrategyVersionSelect(1).click()

    getUpdateStrategiesEditStrategyVersionMenuItem(1, 0).click()

    getUpdateStrategiesEditStrategyVersionSelect(1).find('input').should('have.value', '1.0.0')

    getUpdateStrategiesEditStrategyTypeSelect(1).click()

    getUpdateStrategiesEditStrategyTypeSelectMenuItem(1, 1).click()

    getUpdateStrategiesEditStrategyVersionSelect(1).find('.MuiInputBase-root').should('have.class', 'Mui-disabled')
  })

  it('can add a new product update strategy', () => {
    getUpdateStrategiesEditButton().eq(0).click()

    getUpdateStrategiesAddAnotherProductLink().should('exist')
    getUpdateStrategiesAddAnotherProductLinkDisabled().should('not.exist')
    getUpdateStrategiesEditableProductStrategy().should('have.length', 2)

    getUpdateStrategiesAddAnotherProductLink().click()

    getUpdateStrategiesAddAnotherProductLink().should('not.exist')
    getUpdateStrategiesAddAnotherProductLinkDisabled().should('exist')
    getUpdateStrategiesEditableProductStrategy().should('have.length', 3)

    // product name

    getUpdateStrategiesEditStrategyProductSelect(2).find('input').should('have.value', 'Persona')

    getUpdateStrategiesEditStrategyProductSelect(2).click()

    getUpdateStrategiesEditStrategyProductSelectMenuItem(2, 0).should('have.class', 'Mui-disabled')
    getUpdateStrategiesEditStrategyProductSelectMenuItem(2, 1).should('have.class', 'Mui-disabled')
    getUpdateStrategiesEditStrategyProductSelectMenuItem(2, 2).should('have.class', 'Mui-disabled')

    I.get('.MuiPopover-root').click() // click away to close product select

    // strategy type

    getUpdateStrategiesEditStrategyTypeSelect(2).find('input').should('have.value', '')

    getUpdateStrategiesEditStrategyTypeSelect(2).click()

    getUpdateStrategiesEditStrategyTypeSelectMenuItem(2, 1).click()

    getUpdateStrategiesEditStrategyTypeSelect(2).find('input').should('have.value', 'DoNotUpdate')

    // version

    getUpdateStrategiesEditStrategyVersionSelect(2).find('.MuiInputBase-root').should('have.class', 'Mui-disabled')

    getUpdateStrategiesEditStrategyTypeSelect(2).click()

    getUpdateStrategiesEditStrategyTypeSelectMenuItem(2, 2).click()

    getUpdateStrategiesEditStrategyVersionSelect(2).find('.MuiInputBase-root').should('not.have.class', 'Mui-disabled')

    getUpdateStrategiesEditStrategyVersionSelect(2).click()

    getUpdateStrategiesEditStrategyVersionMenuItem(2, 0).click()

    getUpdateStrategiesEditStrategyVersionSelect(2).find('input').should('have.value', '1.0.0')

    getUpdateStrategiesEditStrategyTypeSelect(2).click()

    getUpdateStrategiesEditStrategyTypeSelectMenuItem(2, 0).click()

    getUpdateStrategiesEditStrategyVersionSelect(2).find('.MuiInputBase-root').should('have.class', 'Mui-disabled')
  })

  it('can modify the Update Strategy name', () => {
    getUpdateStrategiesEditButton().eq(0).click()

    getUpdateStrategiesEditableName().should('exist')
    getUpdateStrategiesEditableName().should('have.value', 'CylancePROTECT_Do not update')

    getUpdateStrategiesEditableName().type('edit')

    getUpdateStrategiesEditableName().should('have.value', 'CylancePROTECT_Do not updateedit')
  })

  it('can modify the Update Strategy description', () => {
    getUpdateStrategiesEditButton().eq(0).click()

    getUpdateStrategiesEditableDescription().should('exist')
    getUpdateStrategiesEditableDescription().should('have.value', 'Strategy description goes here')

    getUpdateStrategiesEditableDescription().type('edit')

    getUpdateStrategiesEditableDescription().should('have.value', 'Strategy description goes hereedit')
  })

  it('can cancel the edit', () => {
    getUpdateStrategiesStaticSummary().should('have.length', 2)
    getUpdateStrategiesStaticName().should('have.length', 2)
    getUpdateStrategiesStaticProducts().should('have.length', 2)
    getUpdateStrategiesStaticModifiedDate().should('have.length', 2)
    getUpdateStrategiesEditButton().should('have.length', 2)
    getUpdateStrategiesDeleteButton().should('have.length', 2)
    getUpdateStrategiesStaticDetails().should('not.exist')
    getUpdateStrategiesStaticDescription().should('not.exist')
    getUpdateStrategiesStaticStrategies().should('not.exist')
    getUpdateStrategiesStaticStrategiesProduct().should('not.exist')
    getUpdateStrategiesStaticStrategiesTypeVersion().should('not.exist')

    getUpdateStrategiesEditableSummary().should('not.exist')
    getUpdateStrategiesEditableSummaryName().should('not.exist')
    getUpdateStrategiesEditableSummaryProducts().should('not.exist')
    getUpdateStrategiesEditableSummaryModifiedDate().should('not.exist')
    getUpdateStrategiesCancelEditButton().should('not.exist')
    getUpdateStrategiesSaveEditButton().should('not.exist')
    getUpdateStrategiesEditableDetails().should('not.exist')
    getUpdateStrategiesEditStrategyProductStaticProtect().should('not.exist')
    getUpdateStrategiesEditableName().should('not.exist')
    getUpdateStrategiesEditableDescription().should('not.exist')
    getUpdateStrategiesAddAnotherProductLink().should('not.exist')
    getUpdateStrategiesEditStrategyProductSelect(1).should('not.exist')
    getUpdateStrategiesEditStrategyTypeSelect(1).should('not.exist')
    getUpdateStrategiesEditStrategyVersionSelect(1).should('not.exist')

    getUpdateStrategiesExpansionSummary().eq(0).click()

    getUpdateStrategiesStaticSummary().should('have.length', 2)
    getUpdateStrategiesStaticName().should('have.length', 2)
    getUpdateStrategiesStaticProducts().should('have.length', 2)
    getUpdateStrategiesStaticModifiedDate().should('have.length', 2)
    getUpdateStrategiesEditButton().should('have.length', 2)
    getUpdateStrategiesDeleteButton().should('have.length', 2)
    getUpdateStrategiesStaticDetails().should('exist').should('have.length', 1)
    getUpdateStrategiesStaticDescription().should('exist')
    getUpdateStrategiesStaticStrategies().should('exist')
    getUpdateStrategiesStaticStrategiesProduct().should('exist')
    getUpdateStrategiesStaticStrategiesTypeVersion().should('exist')

    getUpdateStrategiesEditableSummary().should('not.exist')
    getUpdateStrategiesEditableSummaryName().should('not.exist')
    getUpdateStrategiesEditableSummaryProducts().should('not.exist')
    getUpdateStrategiesEditableSummaryModifiedDate().should('not.exist')
    getUpdateStrategiesCancelEditButton().should('not.exist')
    getUpdateStrategiesSaveEditButton().should('not.exist')
    getUpdateStrategiesEditableDetails().should('not.exist')
    getUpdateStrategiesEditStrategyProductStaticProtect().should('not.exist')
    getUpdateStrategiesEditableName().should('not.exist')
    getUpdateStrategiesEditableDescription().should('not.exist')
    getUpdateStrategiesAddAnotherProductLink().should('not.exist')
    getUpdateStrategiesEditStrategyProductSelect(1).should('not.exist')
    getUpdateStrategiesEditStrategyTypeSelect(1).should('not.exist')
    getUpdateStrategiesEditStrategyVersionSelect(1).should('not.exist')

    getUpdateStrategiesEditButton().eq(0).click()

    getUpdateStrategiesStaticSummary().should('have.length', 1)
    getUpdateStrategiesStaticName().should('have.length', 1)
    getUpdateStrategiesStaticProducts().should('have.length', 1)
    getUpdateStrategiesStaticModifiedDate().should('have.length', 1)
    getUpdateStrategiesEditButton().should('have.length', 1)
    getUpdateStrategiesDeleteButton().should('have.length', 1)
    getUpdateStrategiesStaticDetails().should('not.exist')
    getUpdateStrategiesStaticDescription().should('not.exist')
    getUpdateStrategiesStaticStrategies().should('not.exist')
    getUpdateStrategiesStaticStrategiesProduct().should('not.exist')
    getUpdateStrategiesStaticStrategiesTypeVersion().should('not.exist')

    getUpdateStrategiesEditableSummary().should('have.length', 1)
    getUpdateStrategiesEditableSummaryName().should('exist')
    getUpdateStrategiesEditableSummaryProducts().should('exist')
    getUpdateStrategiesEditableSummaryModifiedDate().should('exist')
    getUpdateStrategiesCancelEditButton().should('exist')
    getUpdateStrategiesSaveEditButton().should('exist')
    getUpdateStrategiesEditableDetails().should('have.length', 1)
    getUpdateStrategiesEditStrategyProductStaticProtect().should('exist')
    getUpdateStrategiesEditableName().should('exist')
    getUpdateStrategiesEditableDescription().should('exist')
    getUpdateStrategiesAddAnotherProductLink().should('exist')
    getUpdateStrategiesEditStrategyProductSelect(1).should('exist')
    getUpdateStrategiesEditStrategyTypeSelect(1).should('exist')
    getUpdateStrategiesEditStrategyVersionSelect(1).should('exist')

    getUpdateStrategiesCancelEditButton().click()

    getUpdateStrategiesStaticSummary().should('have.length', 2)
    getUpdateStrategiesStaticName().should('have.length', 2)
    getUpdateStrategiesStaticProducts().should('have.length', 2)
    getUpdateStrategiesStaticModifiedDate().should('have.length', 2)
    getUpdateStrategiesEditButton().should('have.length', 2)
    getUpdateStrategiesDeleteButton().should('have.length', 2)
    getUpdateStrategiesStaticDetails().should('have.length', 1)
    getUpdateStrategiesStaticDescription().should('exist')
    getUpdateStrategiesStaticStrategies().should('exist')
    getUpdateStrategiesStaticStrategiesProduct().should('exist')
    getUpdateStrategiesStaticStrategiesTypeVersion().should('exist')

    getUpdateStrategiesEditableSummary().should('not.exist')
    getUpdateStrategiesEditableSummaryName().should('not.exist')
    getUpdateStrategiesEditableSummaryProducts().should('not.exist')
    getUpdateStrategiesEditableSummaryModifiedDate().should('not.exist')
    getUpdateStrategiesCancelEditButton().should('not.exist')
    getUpdateStrategiesSaveEditButton().should('not.exist')
    getUpdateStrategiesEditableDetails().should('not.exist')
    getUpdateStrategiesEditStrategyProductStaticProtect().should('not.exist')
    getUpdateStrategiesEditableName().should('not.exist')
    getUpdateStrategiesEditableDescription().should('not.exist')
    getUpdateStrategiesAddAnotherProductLink().should('not.exist')
    getUpdateStrategiesEditStrategyProductSelect(1).should('not.exist')
    getUpdateStrategiesEditStrategyTypeSelect(1).should('not.exist')
    getUpdateStrategiesEditStrategyVersionSelect(1).should('not.exist')
  })
})
