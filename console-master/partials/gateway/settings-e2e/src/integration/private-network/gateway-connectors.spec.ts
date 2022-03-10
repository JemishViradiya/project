//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import {
  AriaElementLabel,
  COMMON_ADD_BUTTON,
  COMMON_ADD_IP_BUTTON_LABEL,
  COMMON_SAVE_CHANGES_BUTTON,
  CommonFns,
  CONNECTOR_URL,
} from '@ues/assets-e2e'

const { getButton, loadingIconShould, getSwitchButton, columnHeaderShould, visitView } = CommonFns(I)

context('Settings: Private Network', () => {
  before(() => {
    visitView(CONNECTOR_URL)
  })

  describe('Gateway Connectors Tab', () => {
    beforeEach(() => {
      loadingIconShould('not.exist')
    })

    const CONNECTORS_AMOUNT = 8
    const EDIT_ICON = 0
    const DELETE_ICON = 1
    const CONNECTOR_DESC = 'connectors.healthCheckUrlDescription'
    const CONFIRM_DISCARD_CHANGES = 'common.yes'
    const IP_VALIDATION_LABEL = 'connectors.sourceIpValidation'
    const IP_RESTRICTIONS_ADDRESSES = ['127.0.0.1', '128.0.0.1']
    const SWITCH_LABEL = 'egressSourceIPRestrictionEnabled'

    const CONNECTOR_STATUSES = [
      'connectors.unknownStatus',
      'connectors.pendingEnrollment',
      'connectors.labelAttentionRequired',
      'connectors.failedToCompleteEnrollment',
      'connectors.labelConnected',
      'connectors.rebootRequiredTooltip',
      'dashboard.failure',
    ]

    it(`connectors widgets amount should be equal ${CONNECTORS_AMOUNT}`, () => {
      I.findAllByRole('row').should('have.length', CONNECTORS_AMOUNT)
    })

    it('connectors should have different statuses', () => {
      CONNECTOR_STATUSES.forEach(status => {
        I.findByRole('cell', { name: I.translate(status) }).should('exist')
      })
    })

    it(`health check elements should exist`, () => {
      getButton('Health check').click()
      I.findByLabelText(AriaElementLabel.HealthCheckDesc).should('contain', I.translate(CONNECTOR_DESC))
      I.findByRole('textbox').should('exist')
    })

    it(`should disable source ip restrictions table`, () => {
      getButton(I.translate(IP_VALIDATION_LABEL)).click()
      getSwitchButton(SWITCH_LABEL).click()
      columnHeaderShould('not.exist')
      getButton(AriaElementLabel.StickyActionsSaveButton).click()
      columnHeaderShould('not.exist')
      getSwitchButton(SWITCH_LABEL).click()
      getButton(AriaElementLabel.DiscardChangesButton).click()
      getButton(I.translate(CONFIRM_DISCARD_CHANGES)).click()
    })

    it(`should add, modify and delete ip restriction`, () => {
      getButton(I.translate(IP_VALIDATION_LABEL)).click()
      getSwitchButton(SWITCH_LABEL).click()

      getButton(I.translate(COMMON_ADD_IP_BUTTON_LABEL)).click()
      I.findByRole('textbox').type(IP_RESTRICTIONS_ADDRESSES[0])
      getButton(I.translate(COMMON_ADD_BUTTON)).click()
      getButton(AriaElementLabel.StickyActionsSaveButton).click()

      I.findByLabelText(IP_RESTRICTIONS_ADDRESSES[0]).find('button').eq(EDIT_ICON).click()
      I.findByRole('textbox').clear().type(IP_RESTRICTIONS_ADDRESSES[1])
      getButton(I.translate(COMMON_SAVE_CHANGES_BUTTON)).click()
      I.findByLabelText(IP_RESTRICTIONS_ADDRESSES[1]).should('exist')

      I.findByLabelText(IP_RESTRICTIONS_ADDRESSES[1]).find('button').eq(DELETE_ICON).click()
      I.findByLabelText(IP_RESTRICTIONS_ADDRESSES[1]).should('not.exist')
      getButton(AriaElementLabel.StickyActionsSaveButton).click()
    })
  })
})
