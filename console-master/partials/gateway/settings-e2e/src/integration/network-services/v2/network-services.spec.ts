//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { FeatureName } from '@ues-data/shared-types'
import {
  AriaElementLabel,
  COMMON_ADD_BUTTON,
  COMMON_DELETE_BUTTON,
  COMMON_EDIT_BUTTON,
  COMMON_SAVE_CHANGES_BUTTON,
  CommonFns,
  NETWORK_SERVICES_URL,
} from '@ues/assets-e2e'

import { getMockedIsAclQueryVisitOptions } from '../../../support/utils'

const { getButton, tableCellShould, loadingIconShould, visitView } = CommonFns(I)

describe('Settings: Network Services List v2', () => {
  const FIRST_INPUT_FIELD = 0
  const FQDNS_INPUT_FIELD = 1
  const IP_ADDRESSES_INPUT_FIELD = 2
  const DOMAIN_NAMES = ['Amazon', 'Youtube']
  const FQDNS_DOMAINS = ['*.amazon.de', '*.youtube.com']
  const IP_ADDRESSES = ['123.21.10.2/12', '122.10.11.4/10']
  const ADDRESSES_FROM_LIST = ['10.0.0.0/24', '10.0.0.1/15', 'jirasd.rim.net']
  const ADMIN_ADDRESS = 'Atlassian'

  before(() => {
    visitView(
      NETWORK_SERVICES_URL,
      { [FeatureName.UESBigAclEnabled]: false, [FeatureName.UESBigAclMigrationEnabled]: false },
      [],
      getMockedIsAclQueryVisitOptions(false),
    )
  })

  beforeEach(() => {
    loadingIconShould('not.exist')
  })

  context('Settings: Network Services', () => {
    it('should display proper table columns', () => {
      I.findByRole('columnheader', { name: I.translate('common.name') }).should('exist')
    })

    it('should get the list for admin addresses', () => {
      I.findByRole('cell', { name: ADMIN_ADDRESS }).find('a').click()
      I.findByLabelText(AriaElementLabel.NetworkServiceDetails).should('contain', ADDRESSES_FROM_LIST[2])
      I.findAllByRole('dialog').find('button').click()
    })

    it.skip('should edit admin addresses', () => {
      I.findByRole('row', { name: ADMIN_ADDRESS })
        .should('exist')
        .findByRole('button', { name: I.translate(COMMON_EDIT_BUTTON) })
        .click()
      I.findAllByRole('textbox').eq(FIRST_INPUT_FIELD).clear().type(DOMAIN_NAMES[0])

      I.findAllByRole('textbox').eq(FQDNS_INPUT_FIELD).clear().type(FQDNS_DOMAINS[0])
      I.findAllByRole('textbox').eq(FQDNS_INPUT_FIELD).type('{enter}')
      I.findAllByRole('textbox').eq(FQDNS_INPUT_FIELD).type(FQDNS_DOMAINS[1])
      I.findAllByRole('textbox').eq(FQDNS_INPUT_FIELD).type('{enter}')

      I.findAllByRole('textbox').eq(IP_ADDRESSES_INPUT_FIELD).clear().type(IP_ADDRESSES[0])
      I.findAllByRole('textbox').eq(IP_ADDRESSES_INPUT_FIELD).type('{enter}')
      I.findAllByRole('textbox').eq(IP_ADDRESSES_INPUT_FIELD).type(IP_ADDRESSES[1])
      I.findAllByRole('textbox').eq(IP_ADDRESSES_INPUT_FIELD).type('{enter}')

      getButton(I.translate(COMMON_SAVE_CHANGES_BUTTON)).click()

      I.findByRole('cell', { name: DOMAIN_NAMES[0] }).find('a').click()

      I.findByLabelText(AriaElementLabel.NetworkServiceDetails)
        .should('contain', FQDNS_DOMAINS[0])
        .and('contain', FQDNS_DOMAINS[1])
        .and('contain', IP_ADDRESSES[0])
        .and('contain', IP_ADDRESSES[1])

      I.findAllByRole('dialog').find('button').click()
    })

    it.skip('should delete Network Service', () => {
      getButton(I.translate(COMMON_ADD_BUTTON)).click()

      I.findAllByRole('textbox').eq(FIRST_INPUT_FIELD).clear().type(DOMAIN_NAMES[1])

      I.findAllByRole('textbox').eq(FQDNS_INPUT_FIELD).clear().type(FQDNS_DOMAINS[1])

      I.findAllByRole('textbox').eq(IP_ADDRESSES_INPUT_FIELD).clear().type(IP_ADDRESSES[1])

      getButton(I.translate(COMMON_ADD_BUTTON)).click()

      I.findByRole('row', { name: DOMAIN_NAMES[1] })
        .should('exist')
        .findByRole('button', { name: I.translate(COMMON_DELETE_BUTTON) })
        .click()

      tableCellShould('not.exist', DOMAIN_NAMES[1])
    })
  })
})
