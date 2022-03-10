import { UESGeneralSettingsQueryMock } from '@ues-data/bis/mocks'
import { OperatingMode } from '@ues-data/bis/model'
import { FeatureName } from '@ues-data/shared-types'

import { TranslationKey, visitPage } from '../support/utils'

const SETTINGS_MOCK_DATA = UESGeneralSettingsQueryMock

describe('Adaptive response settings', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem(FeatureName.UESCronosNavigation, 'false')
    I.loadI18nNamespaces('bis/ues', 'bis/shared').then(() => {
      visitPage('#/adaptiveresponse')
    })
  })

  it('Should display adaptive response settings', () => {
    I.findByRole('heading', { name: I.translate(TranslationKey.OperatingModeTitle) }).should('exist')
    I.findByText(I.translate(TranslationKey.OperatingModeDescription)).should('exist')
    I.findByLabelText(I.translate(TranslationKey.OperatingModeTitle)).should(
      'have.text',
      I.translate(
        SETTINGS_MOCK_DATA.generalSettings.tenantSettings.operatingMode === OperatingMode.ACTIVE
          ? TranslationKey.OperatingModeActive
          : TranslationKey.OperatingModePassive,
      ),
    )
    I.findByRole('button', { name: I.translate(TranslationKey.CancelButton) }).should('be.disabled')
    I.findByRole('button', { name: I.translate(TranslationKey.SaveButton) }).should('be.disabled')
  })

  it('Should change operating mode', () => {
    I.findByLabelText(I.translate(TranslationKey.OperatingModeTitle)).then($select => {
      const selectedValue = $select.val()
      const valueToSelect = selectedValue === OperatingMode.ACTIVE ? OperatingMode.PASSIVE : OperatingMode.ACTIVE
      const translatedValueToSelect = I.translate(
        valueToSelect === OperatingMode.ACTIVE ? TranslationKey.OperatingModeActive : TranslationKey.OperatingModePassive,
      )
      I.changeSelectValue(I.translate(TranslationKey.OperatingModeTitle), translatedValueToSelect)
      I.findByLabelText(I.translate(TranslationKey.OperatingModeTitle)).should('have.text', translatedValueToSelect)
      I.findByRole('button', { name: I.translate(TranslationKey.CancelButton) }).should('not.be.disabled')
      I.findByRole('button', { name: I.translate(TranslationKey.SaveButton) })
        .should('not.be.disabled')
        .click()
        .should('be.disabled')
    })
  })
})
