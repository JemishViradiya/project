//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { networkProtectionConfigMock } from '@ues-data/gateway/mocks'
import {
  AriaElementLabel,
  COMMON_CANCEL_BUTTON,
  COMMON_SAVE_CHANGES_BUTTON,
  CommonFns,
  NETWORK_PROTECTION_URL,
  PROTECTION_SWITCH_LABEL,
} from '@ues/assets-e2e'

const { getButton, getSwitchButton, loadingIconShould, visitView } = CommonFns(I)

context('Settings: Network Protection', () => {
  before(() => {
    visitView(NETWORK_PROTECTION_URL)
  })

  beforeEach(() => {
    loadingIconShould('not.exist')
  })

  it('save should not be visible by default', () => {
    getButton(I.translate(COMMON_SAVE_CHANGES_BUTTON)).should('not.exist')
    getButton(I.translate(COMMON_CANCEL_BUTTON)).should('not.exist')

    const switchButton = getSwitchButton(PROTECTION_SWITCH_LABEL)
    networkProtectionConfigMock.intrusionProtectionEnabled
      ? switchButton.should('be.checked')
      : switchButton.should('not.be.checked')
  })

  it('should change intrusion detection mode', () => {
    getSwitchButton(PROTECTION_SWITCH_LABEL).click()
    I.findByRole('button', { name: AriaElementLabel.DiscardChangesButton }).should('not.be.disabled')
    I.findByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('not.be.disabled').click()
    I.findByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('not.exist')
  })
})
