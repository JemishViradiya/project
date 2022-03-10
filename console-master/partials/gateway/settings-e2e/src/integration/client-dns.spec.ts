//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
import {
  AriaElementLabel,
  CLIENT_DNS_URL,
  COMMON_ADD_BUTTON,
  COMMON_CANCEL_BUTTON,
  COMMON_DELETE_BUTTON,
  COMMON_ORDER_LABEL,
  CommonFns,
  DNS_SUFFIX_ADD_BUTTON_LABEL,
  DNS_SUFFIX_SWITCH_LABEL,
} from '@ues/assets-e2e'

const { columnHeaderShould, getButton, getSwitchButton, loadingIconShould, tableCellShould, tableShould, visitView } = CommonFns(I)

context('Settings: Client DNS', () => {
  before(() => {
    visitView(CLIENT_DNS_URL, {}, ['components', 'gateway-settings'])
  })

  beforeEach(() => {
    loadingIconShould('not.exist')
  })

  const ROWS_AMOUNT = 2
  const DOMAIN_NAMES = ['facebook.com', 'google.com', 'youtube.com', 'discovery.com', 'blackberry.com']

  it('should disable client DNS', () => {
    getSwitchButton(DNS_SUFFIX_SWITCH_LABEL).click()
    columnHeaderShould('not.exist')
    getButton(AriaElementLabel.StickyActionsSaveButton).click()
    columnHeaderShould('not.exist')
    getSwitchButton(DNS_SUFFIX_SWITCH_LABEL).click()
    getButton(AriaElementLabel.StickyActionsSaveButton).click()
  })

  it('should add not save domain', () => {
    getButton(I.translate(DNS_SUFFIX_ADD_BUTTON_LABEL)).click()
    I.findByRole('textbox').type(DOMAIN_NAMES[3])
    getButton(I.translate(COMMON_CANCEL_BUTTON)).click()
    tableCellShould('not.exist', DOMAIN_NAMES[3])
  })

  it('should add and save domain', () => {
    loadingIconShould('not.exist')
    tableCellShould('not.exist', DOMAIN_NAMES[3])
    getButton(I.translate(DNS_SUFFIX_ADD_BUTTON_LABEL)).click()
    I.findByRole('textbox').type(DOMAIN_NAMES[3])
    getButton(I.translate(COMMON_ADD_BUTTON)).click()
    getButton(AriaElementLabel.StickyActionsSaveButton).click()
    tableCellShould('exist', DOMAIN_NAMES[3])

    I.findByRole('row', { name: `2 ${DOMAIN_NAMES[3]}` })
      .findByRole('button', { name: I.translate(COMMON_DELETE_BUTTON) })
      .click()
    getButton(AriaElementLabel.StickyActionsSaveButton).click()
  })

  it('should enable private DNS', () => {
    getSwitchButton(DNS_SUFFIX_SWITCH_LABEL).click()
    tableShould('not.exist')
    getButton(AriaElementLabel.StickyActionsSaveButton).click()
    getSwitchButton(DNS_SUFFIX_SWITCH_LABEL).click()
    tableShould('exist')
    getButton(AriaElementLabel.StickyActionsSaveButton).click()
    tableShould('exist')
  })

  it(`routes table should contain proper amount of elements`, () => {
    I.findAllByRole('row').should('have.length', ROWS_AMOUNT)
  })

  it('should not be able to add 4 unsaved domains', () => {
    getButton(I.translate(DNS_SUFFIX_ADD_BUTTON_LABEL)).click()
    I.findByRole('textbox').type(DOMAIN_NAMES[0])
    getButton(I.translate(COMMON_ADD_BUTTON)).click()

    getButton(I.translate(DNS_SUFFIX_ADD_BUTTON_LABEL)).click()
    I.findByRole('textbox').type(DOMAIN_NAMES[1])
    getButton(I.translate(COMMON_ADD_BUTTON)).click()

    getButton(I.translate(DNS_SUFFIX_ADD_BUTTON_LABEL)).should('be.disabled')
    getButton(AriaElementLabel.StickyActionsSaveButton).should('not.be.disabled').click()
  })
})
