//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { i18n, I18nFormats } from '@ues-behaviour/shared-e2e'
import {
  COMMON_NAME_LABEL,
  COMMON_OFFLINE_LABEL,
  COMMON_ONLINE_LABEL,
  COMMON_STATUS_LABEL,
  CommonFns,
  CONNECTOR_URL,
  EDIT_CONNECTOR_URL,
} from '@ues/assets-e2e'

const { getTextbox, alertMessageShouldBeEqual, visitView } = CommonFns(I)

const GATEWAY_EDIT_CONNECTORS_TITLE = 'connectors.connectorInfo'
const GATEWAY_CONNECTOR_DETAILS = 'connectors.connectorDetails'
const GATEWAY_CONNECTOR_CONNECTION_HISTORY = 'connectors.connectionHistory'
const GATEWAY_CONNECTOR_NOT_EXIST_ALERT = 'common.resourceNotFound'
const CONNECTOR_NAME = 'NA - Waterloo'
const CONNECTOR_PRIVATE_URL = 'https://connector.private.network.waterloo'
const CONNECTOR_PRIVATE_URL_LABEL = 'connectors.labelPrivateURL'
const CONNECTOR_ID_LABEL = 'connectors.labelConnectorID'
const CONNECTOR_PUBLIC_KEY_LABEL = 'connectors.labelPublicKey'
const CONNECTOR_CONNECTION_ERROR = {
  internal: 'connectors.InternalServerError',
  timedOut: 'connectors.OperationTimedOut',
}

const CONNECTION_HISTORY = [
  {
    time: 1604075280001,
    status: COMMON_OFFLINE_LABEL,
    comments: CONNECTOR_CONNECTION_ERROR.internal,
  },
  {
    time: 1605075280003,
    status: COMMON_ONLINE_LABEL,
    comments: '',
  },
  {
    time: 1607075490606,
    status: COMMON_OFFLINE_LABEL,
    comments: CONNECTOR_CONNECTION_ERROR.internal,
  },
  {
    time: 1604075280001,
    status: COMMON_OFFLINE_LABEL,
    comments: CONNECTOR_CONNECTION_ERROR.timedOut,
  },
  {
    time: 1606575350004,
    status: COMMON_ONLINE_LABEL,
    comments: '',
  },
  {
    time: 1607075450008,
    status: COMMON_OFFLINE_LABEL,
    comments: CONNECTOR_CONNECTION_ERROR.timedOut,
  },
  {
    time: 1604075280001,
    status: COMMON_ONLINE_LABEL,
    comments: '',
  },
  {
    time: 1605075380040,
    status: COMMON_OFFLINE_LABEL,
    comments: CONNECTOR_CONNECTION_ERROR.internal,
  },
  {
    time: 1606075391890,
    status: COMMON_ONLINE_LABEL,
    comments: '',
  },
  {
    time: 1607075392006,
    status: COMMON_OFFLINE_LABEL,
    comments: CONNECTOR_CONNECTION_ERROR.internal,
  },
]

context('Settings: Edit Gateway Connectors', () => {
  context('Existing connector', () => {
    beforeEach(() => {
      visitView(EDIT_CONNECTOR_URL)
    })

    it('should load edit connector page with not enrolled connector', () => {
      I.findByRole('navigation').should('exist')
      I.findByRole('main').should('not.be.empty')

      I.findAllByRole('heading', { name: I.translate(GATEWAY_EDIT_CONNECTORS_TITLE) }).should('exist')
      I.findAllByRole('heading', { name: I.translate(GATEWAY_CONNECTOR_DETAILS) }).should('exist')
      I.findAllByRole('heading', { name: I.translate(GATEWAY_CONNECTOR_CONNECTION_HISTORY) }).should('exist')

      getTextbox(I.translate(COMMON_NAME_LABEL)).should('contain.value', CONNECTOR_NAME)
      getTextbox(I.translate(COMMON_NAME_LABEL)).should('be.disabled')

      I.findAllByRole('heading', { name: I.translate(CONNECTOR_PRIVATE_URL_LABEL) }).should('exist')
      I.findAllByRole('heading', { name: I.translate(CONNECTOR_ID_LABEL) }).should('exist')
      I.findAllByRole('heading', { name: I.translate(COMMON_STATUS_LABEL) }).should('exist')
      I.findAllByRole('heading', { name: I.translate(CONNECTOR_PUBLIC_KEY_LABEL) })
        .should('exist')
        .click()
      I.findAllByRole('link', { name: CONNECTOR_PRIVATE_URL }).should('exist')

      I.findAllByRole('row').each((row, index) => {
        const currentIndex = index - 1

        if (index !== 0) {
          const timeToCheck = i18n.format(new Date(CONNECTION_HISTORY[currentIndex].time), I18nFormats.DateTimeShort)
          I.wrap(row).findAllByRole('cell', { name: timeToCheck }).should('exist')
          I.wrap(row)
            .findAllByRole('cell', { name: I.translate(CONNECTION_HISTORY[currentIndex].status) })
            .should('exist')
          I.wrap(row)
            .findAllByRole('cell', { name: I.translate(CONNECTION_HISTORY[currentIndex].comments) })
            .should('exist')
        }
      })
    })
  })

  context('Not existing connector', () => {
    before(() => {
      visitView(`${CONNECTOR_URL}/does_not_exist`)
    })

    it('should redirect from not existing connector', () => {
      alertMessageShouldBeEqual(I.translate(GATEWAY_CONNECTOR_NOT_EXIST_ALERT))
    })
  })
})
