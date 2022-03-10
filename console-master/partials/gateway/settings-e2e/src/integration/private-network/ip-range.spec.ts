//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { AriaElementLabel, CommonFns, PRIVATE_NETWORK_IP_RANGE_URL } from '@ues/assets-e2e'

const { loadingIconShould, visitView } = CommonFns(I)

context('Settings: Private Network', () => {
  before(() => {
    visitView(PRIVATE_NETWORK_IP_RANGE_URL, {}, ['components', 'gateway-settings'])
  })

  const getTextbox = () => I.findByRole('textbox', { name: I.translate('privateNetwork.ipRangeLabel') })
  const verifyTextboxValue = (value: string) =>
    getTextbox()
      .should('exist')
      .invoke('val')
      .then(val => expect(val).eq(value))

  describe('Agent IP Range Tab', () => {
    beforeEach(() => {
      loadingIconShould('not.exist')
    })

    const DEFAULT_IP_RANGE = '10.0.0.1/15'
    const NEW_IP_RANGE = '192.168.0.1/10'

    it('should show a proper heading and description', () => {
      I.findByRole('heading', { name: I.translate('privateNetwork.ipRangeTitle') }).should('exist')
      I.findByText(I.translate('privateNetwork.ipRangeDescription')).should('exist')
      I.findByText(I.translate('privateNetwork.ipRangeHelpLabel')).should('exist')
    })

    it(`should show a proper initial data`, () => {
      verifyTextboxValue(DEFAULT_IP_RANGE)
    })

    it(`should show a validation error and disable the save button when value is an invalid IPv4 CIDR`, () => {
      getTextbox().clear().type('2002::1234:abcd:ffff:c0a8:101/64')
      I.findByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('be.disabled')
      I.findByText(I.translate('privateNetwork.ipRangeInvalidCidr')).should('exist')
    })

    it(`should show a validation error and disable the save button when value has an invalid suffix`, () => {
      getTextbox().clear().type('1.1.1.1/19')
      I.findByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('be.disabled')
      I.findByText(I.translate('privateNetwork.ipRangeInvalidSuffix')).should('exist')
    })

    it(`should show a Sticky Actions and save successfully`, () => {
      getTextbox().clear().type(NEW_IP_RANGE)
      I.findByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('be.enabled').click()
      verifyTextboxValue(NEW_IP_RANGE)
    })

    it(`should reset the changes successfully`, () => {
      getTextbox().clear().type('1.1.1.1/1')
      I.findByRole('button', { name: AriaElementLabel.DiscardChangesButton }).should('be.enabled').click()
      I.findByRoleWithin('dialog', 'button', { name: I.translate('common.yes') }).click()
      verifyTextboxValue(NEW_IP_RANGE)
    })
  })
})
