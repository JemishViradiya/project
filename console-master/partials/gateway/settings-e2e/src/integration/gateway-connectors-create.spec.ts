//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { COMMON_AUTHORIZE_BUTTON, COMMON_CANCEL_BUTTON, CommonFns, CREATE_CONNECTOR_URL } from '@ues/assets-e2e'

const { getButton, getTextbox, visitView, loadingIconShould } = CommonFns(I)

const GATEWAY_CREATE_CONNECTORS_TITLE = 'connectors.createConnector'
const GATEWAY_CONNECTOR_URL = 'connectors.connectorUrl'
const GATEWAY_CONNECTOR_NAME = 'connectors.connectorName'

context('Settings: Gateway Connectors', () => {
  before(() => {
    visitView(CREATE_CONNECTOR_URL)
  })

  it('should load Create connectors page', () => {
    I.findByRole('navigation').should('exist')
    I.findByRole('main').should('not.be.empty')
    loadingIconShould('not.exist')

    I.findByRole('heading', { name: I.translate(GATEWAY_CREATE_CONNECTORS_TITLE) }).should('exist')

    getTextbox(I.translate(GATEWAY_CONNECTOR_URL)).should('exist')
    getTextbox(I.translate(GATEWAY_CONNECTOR_URL)).should('contain.value', 'https://local.host')
    getTextbox(I.translate(GATEWAY_CONNECTOR_URL)).should('be.disabled')

    getTextbox(I.translate(GATEWAY_CONNECTOR_NAME)).should('exist')
    getTextbox(I.translate(GATEWAY_CONNECTOR_NAME)).should('be.enabled')

    getButton(I.translate(COMMON_CANCEL_BUTTON)).should('be.enabled')
    getButton(I.translate(COMMON_AUTHORIZE_BUTTON)).should('be.visible')
    getButton(I.translate(COMMON_AUTHORIZE_BUTTON)).should('be.disabled')
  })

  it('authorize should be enabled on entering name', () => {
    getTextbox(I.translate(GATEWAY_CONNECTOR_NAME)).type('text')

    getButton(I.translate(COMMON_CANCEL_BUTTON)).should('be.enabled')
    getButton(I.translate(COMMON_AUTHORIZE_BUTTON)).should('be.enabled')
  })
})
