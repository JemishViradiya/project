//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { i18n, I18nFormats } from '@ues-behaviour/shared-e2e'
import {
  COMMON_ACTION_LABEL,
  COMMON_ALLOWED_LABEL,
  COMMON_BLOCKED_LABEL,
  COMMON_DATE_RANGE_LABEL,
  COMMON_DESTINATION_LABEL,
  COMMON_SOURCE_LABEL,
  COMMON_START_TIME_LABEL,
  COMMON_TRANSFERRED_LABEL,
  COMMON_USER_LABEL,
  CommonFns,
  EVENTS_SELECT_GROUP_BY_DEFAULT,
  EVENTS_URL,
} from '@ues/assets-e2e'

const { loadingIconShould, visitView, pressEscape } = CommonFns(I)

context('Events', () => {
  before(() => {
    visitView(EVENTS_URL, {}, ['tables'])
  })

  describe('Grouped by Default', () => {
    before(() => {
      loadingIconShould('not.exist')
      I.findByRole('button', { name: I.translate(EVENTS_SELECT_GROUP_BY_DEFAULT) }).click()
      I.findByRole('listbox').contains(I.translate(EVENTS_SELECT_GROUP_BY_DEFAULT)).click()
    })

    it('should ensure that anomaly filter is available', () => {
      const ANOMALY_HEADER = 'events.anomaly'
      const ANOMALY_FILTER_ITEMS = ['events.behaviouralRisk', 'events.ipReputation', 'events.signature']

      I.findByRole('columnheader', { name: I.translate(ANOMALY_HEADER) })
        .find('button')
        .click()
      I.findByRole('heading', { name: I.translate(ANOMALY_HEADER) }).should('exist')

      I.findAllByRole('menuitem').each((element, index) => {
        const currentValue = I.translate(ANOMALY_FILTER_ITEMS[index])
        if (element.text() !== currentValue) {
          throw new Error(`${element.text()} is not valid menu item. Should be equal ${currentValue}`)
        }
      })
      I.findAllByRole('menuitem').eq(0).click()
      pressEscape(I)

      I.findByLabelText(
        `${I.translate(ANOMALY_HEADER)} ${I.translate('tables:isIn', { value: I.translate(ANOMALY_FILTER_ITEMS[0]) })}`,
      ).should('exist')
    })

    it('should ensure that user filter is available', () => {
      const USER = 'test-user3'

      I.findByRole('columnheader', { name: I.translate(COMMON_USER_LABEL) })
        .find('button')
        .click()
      I.findByRole('heading', { name: I.translate(COMMON_USER_LABEL) }).should('exist')
      I.findAllByRole('textbox').type(USER)
      pressEscape(I)

      I.findByLabelText(`${I.translate(COMMON_USER_LABEL)} ${I.translate('tables:contains')} ${USER}`).should('exist')
    })

    it('should ensure that destination filter is available', () => {
      const DESTINATION = 'google.com'

      I.findByRole('columnheader', { name: I.translate(COMMON_DESTINATION_LABEL) })
        .find('button')
        .click()
      I.findByRole('heading', { name: I.translate(COMMON_DESTINATION_LABEL) }).should('exist')
      I.findAllByRole('textbox').type(DESTINATION)
      pressEscape(I)

      I.findByLabelText(`${I.translate(COMMON_DESTINATION_LABEL)} ${I.translate('tables:contains')} ${DESTINATION}`).should('exist')
    })

    it('should ensure that action filter is available', () => {
      const ACTION_FILTER_ITEMS = [COMMON_ALLOWED_LABEL, COMMON_BLOCKED_LABEL]

      I.findByRole('columnheader', { name: I.translate(COMMON_ACTION_LABEL) })
        .find('button')
        .click()
      I.findByRole('heading', { name: I.translate(COMMON_ACTION_LABEL) }).should('exist')

      I.findAllByRole('menuitem').each((element, index) => {
        const currentValue = I.translate(ACTION_FILTER_ITEMS[index])
        if (element.text() !== currentValue) {
          throw new Error(`${element.text()} is not valid menu item. Should be equal ${currentValue}`)
        }
      })
      I.findAllByRole('menuitem').eq(0).click()
      pressEscape(I)

      I.findByLabelText(`${I.translate(COMMON_ACTION_LABEL)} ${I.translate(ACTION_FILTER_ITEMS[0])}`).should('exist')
    })

    it('should ensure that transferred filter is available', () => {
      const TRANSFERRED_BYTES = '10000'

      I.findByRole('columnheader', { name: I.translate(COMMON_TRANSFERRED_LABEL) })
        .find('button')
        .click()
      I.findByRole('heading', { name: I.translate(COMMON_TRANSFERRED_LABEL) }).should('exist')
      I.findAllByRole('textbox').type(TRANSFERRED_BYTES)
      pressEscape(I)

      I.findByLabelText(
        `${I.translate(COMMON_TRANSFERRED_LABEL)} ${I.translate('tables:lessOrEqual')} ${TRANSFERRED_BYTES}`,
      ).should('exist')
    })

    it('should ensure that start time filter is available', () => {
      const START_DATE = i18n.format(new Date('01/01/2021 10:00:00Z'), I18nFormats.DateTimeShort)
      const END_DATE = i18n.format(new Date('01/05/2021 10:00:00Z'), I18nFormats.DateTimeShort)
      const FROM_DATE_INPUT = 0
      const TO_DATE_INPUT = 1

      I.findByRole('columnheader', { name: I.translate(COMMON_START_TIME_LABEL) })
        .find('button')
        .click()
      I.findByRole('heading', { name: I.translate(COMMON_DATE_RANGE_LABEL) }).should('exist')

      I.findAllByRole('textbox').eq(FROM_DATE_INPUT).clear().type(START_DATE)
      I.findAllByRole('textbox').eq(TO_DATE_INPUT).clear().type(END_DATE)
      I.findAllByRole('button', { name: 'Apply' }).click()
      pressEscape(I)

      I.findByLabelText(
        `${I.translate(COMMON_START_TIME_LABEL)} ${I.translate('tables:isBetween', { v1: START_DATE, v2: END_DATE })}`,
      ).should('exist')
    })

    it.skip('should ensure that TLS version filter is available', () => {
      const TLS_VERSION_HEADER = 'events.tls.version'
      const TLS_VERSION_FILTER_ITEMS = ['SSLv2', 'SSLv3', 'TLSv1', 'TLS 1.1', 'TLS 1.2', 'TLS 1.3']
      const COLUMN_PICKER_COLINDEX = 9

      I.findAllByRole('columnheader').filter(`[aria-colindex=${COLUMN_PICKER_COLINDEX}]`).click()
      I.findByRole('checkbox', { name: I.translate(TLS_VERSION_HEADER) }).click()
      pressEscape(I)

      I.findByRole('columnheader', { name: I.translate(TLS_VERSION_HEADER) })
        .find('button')
        .click()

      I.findByRole('heading', { name: I.translate(TLS_VERSION_HEADER) }).should('exist')
      I.findAllByRole('menuitem').each((element, index) => {
        const currentValue = TLS_VERSION_FILTER_ITEMS[index]

        if (element.text() !== currentValue) {
          throw new Error(`${element.text()} is not valid menu item. Should be equal ${currentValue}`)
        }
      })

      I.findAllByRole('menuitem').eq(0).click()
      pressEscape(I)

      I.findByLabelText(`${I.translate(TLS_VERSION_HEADER)} ${TLS_VERSION_FILTER_ITEMS[0]}`).should('exist')

      I.findAllByRole('columnheader')
        .filter(`[aria-colindex=${COLUMN_PICKER_COLINDEX + 1}]`)
        .click()
      I.findByRole('checkbox', { name: I.translate(TLS_VERSION_HEADER) }).click()
      pressEscape(I)
    })

    it.skip('should ensure that network route filter is available', () => {
      const COLUMN_PICKER_COLINDEX = 9
      const NETWORK_ROUTE_HEADER = 'events.networkRoute'
      const NETWORK_ROUTE_FILTER_ITEMS = ['events.networkRoutePublic', 'events.networkRoutePrivate']

      I.findAllByRole('columnheader').filter(`[aria-colindex=${COLUMN_PICKER_COLINDEX}]`).click()
      I.findByRole('checkbox', { name: I.translate(NETWORK_ROUTE_HEADER) }).click()
      pressEscape(I)

      I.findByRole('columnheader', { name: I.translate(NETWORK_ROUTE_HEADER) })
        .find('button')
        .click()
      I.findByRole('heading', { name: I.translate(NETWORK_ROUTE_HEADER) }).should('exist')

      I.findAllByRole('menuitem').each((element, index) => {
        const currentValue = I.translate(NETWORK_ROUTE_FILTER_ITEMS[index])

        if (element.text() !== currentValue) {
          throw new Error(`${element.text()} is not valid menu item. Should be equal ${currentValue}`)
        }
      })

      I.findAllByRole('menuitem').eq(0).click()
      pressEscape(I)

      I.findByLabelText(`${I.translate(NETWORK_ROUTE_HEADER)} ${I.translate(NETWORK_ROUTE_FILTER_ITEMS[0])}`).should('exist')
    })

    it.skip('should ensure that source filter is available', () => {
      const COLUMN_PICKER_COLINDEX = 10
      const SOURCE = 'test-source3'

      I.findAllByRole('columnheader').filter(`[aria-colindex=${COLUMN_PICKER_COLINDEX}]`).click()
      I.findByRole('checkbox', { name: I.translate(COMMON_SOURCE_LABEL) }).click()
      pressEscape(I)

      I.findByRole('columnheader', { name: I.translate(COMMON_SOURCE_LABEL) })
        .find('button')
        .click()

      I.findByRole('heading', { name: I.translate(COMMON_SOURCE_LABEL) }).should('exist')
      I.findAllByRole('textbox').type(SOURCE)
      pressEscape(I)

      I.findByLabelText(`${I.translate(COMMON_SOURCE_LABEL)} ${I.translate('tables:contains')} ${SOURCE}`).should('exist')
    })
  })
})
