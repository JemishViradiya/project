//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import {
  ADD_NAC_POLICY_URL,
  AriaElementLabel,
  COMMON_ADD_BUTTON,
  COMMON_DELETE_BUTTON,
  COMMON_EDIT_BUTTON,
  COMMON_IP_ADDRESSES,
  COMMON_IP_RANGES,
  COMMON_NAME_LABEL,
  COMMON_NOT_NOW,
  COMMON_SAVE_CHANGES_BUTTON,
  CommonFns,
} from '@ues/assets-e2e'

const { alertMessageShouldBeEqual, getButton, getTextbox, loadingIconShould, visitView } = CommonFns(I)

describe('Network Access Control Policy', () => {
  beforeEach(() => {
    visitView(ADD_NAC_POLICY_URL, {}, ['profiles'])
    loadingIconShould('not.exist')
  })

  const addNetworkConnection = () => {
    getButton(AriaElementLabel.DropdownIconButton).click()
    I.findByText(I.translate(COMMON_IP_RANGES)).click()
  }
  const getIpRanges = () => I.findByLabelText(I.translate(COMMON_IP_ADDRESSES))

  const inputValues = {
    wrongInputValue: '1.1',
    defaultInputValue: '111.111.111.111',
    defaultNewInputValue: '112.112.112.112',
    secondInputValue: '222.222.222.222',
    secondInputNewValue: '223.223.223.223',
  }

  it('should create a new policy', () => {
    getButton(AriaElementLabel.StickyActionsSaveButton).should('be.disabled')
    getTextbox(I.translate(COMMON_NAME_LABEL)).type('test new policy')
    getButton(AriaElementLabel.StickyActionsSaveButton).should('be.enabled')
    getButton(AriaElementLabel.StickyActionsSaveButton).click()
    getButton(I.translate(COMMON_NOT_NOW)).click()

    expect(window.location.href.endsWith('add')).eq(false)
  })

  it('should add a single blocking IP', () => {
    addNetworkConnection()

    getIpRanges().type(inputValues.wrongInputValue)
    getButton(I.translate(COMMON_ADD_BUTTON)).should('be.disabled')
    getIpRanges().clear().type(inputValues.defaultInputValue)

    getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()

    I.findByText(inputValues.wrongInputValue).should('not.exist')
    I.findByText(inputValues.defaultInputValue).should('exist')
  })

  it('should add multiple blocking IPs and handle an empty line', () => {
    addNetworkConnection()

    getIpRanges().clear().type(inputValues.defaultInputValue)
    getIpRanges().type('{enter}')
    getIpRanges().type(inputValues.defaultNewInputValue)
    getIpRanges().type('{enter}')

    getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()

    I.findByText(inputValues.defaultInputValue).should('exist')
    I.findByText(inputValues.defaultNewInputValue).should('exist')
  })

  it('should edit existing blocking IP', () => {
    addNetworkConnection()

    getIpRanges().clear().type(inputValues.defaultInputValue)
    getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()

    getButton(I.translate(COMMON_EDIT_BUTTON)).click()

    I.findByText(inputValues.defaultInputValue).should('exist')
    getIpRanges().clear().type(inputValues.defaultNewInputValue)

    getButton(I.translate(COMMON_SAVE_CHANGES_BUTTON)).should('be.enabled').click()

    I.findByText(inputValues.defaultInputValue).should('not.exist')
    I.findByText(inputValues.defaultNewInputValue).should('exist')
  })

  it('should delete an existing blocking IP', () => {
    addNetworkConnection()

    getIpRanges().clear().type(inputValues.defaultInputValue)
    getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()
    I.findByText(inputValues.defaultInputValue).should('exist')
    getButton(I.translate(COMMON_DELETE_BUTTON)).click()
    I.findByText(inputValues.defaultInputValue).should('not.exist')
  })

  it('should add two blocking IPs end edit', () => {
    addNetworkConnection()

    getIpRanges().type(inputValues.defaultInputValue)
    getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()
    I.findByText(inputValues.defaultInputValue).should('exist')

    addNetworkConnection()

    getIpRanges().type(inputValues.secondInputValue)
    getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()
    I.findByText(inputValues.defaultInputValue).should('exist')
    I.findByText(inputValues.secondInputValue).should('exist')

    getButton(I.translate(COMMON_EDIT_BUTTON)).eq(0).click()

    getIpRanges().clear().type(inputValues.defaultNewInputValue)
    getButton(I.translate(COMMON_SAVE_CHANGES_BUTTON)).should('be.enabled').click()
    getButton(I.translate(COMMON_EDIT_BUTTON)).eq(1).click()
    getIpRanges().clear().type(inputValues.secondInputNewValue)

    getButton(I.translate(COMMON_SAVE_CHANGES_BUTTON)).should('be.enabled').click()

    I.findByText(inputValues.defaultInputValue).should('not.exist')
    I.findByText(inputValues.secondInputValue).should('not.exist')
    I.findByText(inputValues.defaultNewInputValue).should('exist')
    I.findByText(inputValues.secondInputNewValue).should('exist')
  })
})
