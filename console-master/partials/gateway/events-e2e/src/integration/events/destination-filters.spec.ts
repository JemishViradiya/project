//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import {
  COMMON_DATE_RANGE_LABEL,
  COMMON_DESTINATION_LABEL,
  COMMON_TRANSFERRED_LABEL,
  CommonFns,
  EVENTS_LAST_ACTIVITY_LABEL,
  EVENTS_SELECT_GROUP_BY_DEFAULT,
  EVENTS_SELECT_GROUP_BY_DESTINATION,
  EVENTS_URL,
} from '@ues/assets-e2e'

const { loadingIconShould, visitView, pressEscape } = CommonFns(I)

context('Events', () => {
  before(() => {
    visitView(EVENTS_URL, {}, ['tables'])
  })

  describe('Grouped by Destination', () => {
    before(() => {
      loadingIconShould('not.exist')
      I.findByRole('button', { name: I.translate(EVENTS_SELECT_GROUP_BY_DEFAULT) }).click()
      I.findByRole('listbox').contains(I.translate(EVENTS_SELECT_GROUP_BY_DESTINATION)).click()
    })

    it('should ensure that destination filter is set', () => {
      I.findByRole('columnheader', { name: I.translate(COMMON_DESTINATION_LABEL) })
        .find('button')
        .click()
      I.findByRole('heading', { name: I.translate(COMMON_DESTINATION_LABEL) })
      I.findAllByRole('textbox').should('exist')
      pressEscape(I)
    })

    it('should ensure that destination filter is available', () => {
      const DESTINATION = 'google.com'

      I.findByRole('columnheader', { name: I.translate(COMMON_DESTINATION_LABEL) })
        .find('button')
        .click()
      I.findByRole('heading', { name: I.translate(COMMON_DESTINATION_LABEL) })
      I.findAllByRole('textbox').type(DESTINATION)
      pressEscape(I)
      I.findByLabelText(`${I.translate(COMMON_DESTINATION_LABEL)} ${I.translate('tables:contains')} ${DESTINATION}`).should('exist')
    })

    it('should ensure that transferred filter is available', () => {
      const TRANSFERRED_BYTES = '10000'

      I.findByRole('columnheader', { name: I.translate(COMMON_TRANSFERRED_LABEL) })
        .find('button')
        .click()
      I.findByRole('heading', { name: I.translate(COMMON_TRANSFERRED_LABEL) })
      I.findAllByRole('textbox').type(TRANSFERRED_BYTES)
      pressEscape(I)
      I.findByLabelText(
        `${I.translate(COMMON_TRANSFERRED_LABEL)} ${I.translate('tables:lessOrEqual')} ${TRANSFERRED_BYTES}`,
      ).should('exist')
    })

    it('should ensure that last activity filter is available', () => {
      const START_DATE = '01/01/2021 10:00 PM'
      const END_DATE = '01/05/2021 10:00 PM'
      const FROM_DATE_INPUT = 0
      const TO_DATE_INPUT = 1

      I.findByRole('columnheader', { name: I.translate(EVENTS_LAST_ACTIVITY_LABEL) })
        .find('button')
        .click()
      I.findByRole('heading', { name: I.translate(COMMON_DATE_RANGE_LABEL) })

      I.findAllByRole('textbox').eq(FROM_DATE_INPUT).clear().type(START_DATE)
      I.findAllByRole('textbox').eq(TO_DATE_INPUT).clear().type(END_DATE)

      I.findAllByRole('button', { name: 'Apply' }).click()
      pressEscape(I)
      I.findByLabelText(
        `${I.translate(EVENTS_LAST_ACTIVITY_LABEL)} ${I.translate('tables:isBetween', { v1: START_DATE, v2: END_DATE })}`,
      ).should('exist')
    })
  })
})
