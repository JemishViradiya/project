//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import {
  AriaElementLabel,
  COMMON_DESTINATION_LABEL,
  COMMON_USER_LABEL,
  CommonFns,
  EVENTS_ANOMALY_COLUMN_HEADER,
  EVENTS_SELECT_GROUP_BY_DEFAULT,
  EVENTS_SELECT_GROUP_BY_DESTINATION,
  EVENTS_SELECT_GROUP_BY_USERS,
  EVENTS_URL,
} from '@ues/assets-e2e'

const { loadingIconShould, visitView } = CommonFns(I)

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

    it('should ensure that events table is rendered', () => {
      I.findAllByRole('grid', { name: AriaElementLabel.EventsInfiniteTable }).should('exist')
    })

    it('should ensure that default table header is visible', () => {
      I.findByRole('columnheader', { name: I.translate(EVENTS_ANOMALY_COLUMN_HEADER) }).should('exist')
    })
  })

  describe('Grouped by Destination Hosts', () => {
    before(() => {
      loadingIconShould('not.exist')
      I.findByRole('button', { name: I.translate(EVENTS_SELECT_GROUP_BY_DEFAULT) }).click()
      I.findByRole('listbox').contains(I.translate(EVENTS_SELECT_GROUP_BY_DESTINATION)).click()
    })

    it('should ensure that groupBy destination hosts events table is rendered', () => {
      I.findAllByRole('grid', { name: AriaElementLabel.EventsInfiniteTable }).should('exist')
    })

    it('should ensure that destination table header is visible', () => {
      I.findAllByRole('columnheader', { name: I.translate(COMMON_DESTINATION_LABEL) }).should('exist')
    })

    after(() => {
      I.findAllByRole('button').contains(I.translate(EVENTS_SELECT_GROUP_BY_DESTINATION)).click()
      I.findByRole('listbox').contains(I.translate(EVENTS_SELECT_GROUP_BY_DEFAULT)).click()
    })
  })

  describe('Grouped by Users', () => {
    before(() => {
      loadingIconShould('not.exist')
      I.findByRole('button', { name: I.translate(EVENTS_SELECT_GROUP_BY_DEFAULT) }).click()
      I.findByRole('listbox').contains(I.translate(EVENTS_SELECT_GROUP_BY_USERS)).click()
    })

    it('should ensure that groupBy events table is rendered', () => {
      I.findAllByRole('grid', { name: AriaElementLabel.EventsInfiniteTable }).should('exist')
    })

    it('should ensure that user table header is visible', () => {
      I.findAllByRole('columnheader', { name: I.translate(COMMON_USER_LABEL) }).should('exist')
    })

    after(() => {
      I.findAllByRole('button').contains(I.translate(EVENTS_SELECT_GROUP_BY_USERS)).click()
      I.findByRole('listbox').contains(I.translate(EVENTS_SELECT_GROUP_BY_DEFAULT)).click()
    })
  })
})
