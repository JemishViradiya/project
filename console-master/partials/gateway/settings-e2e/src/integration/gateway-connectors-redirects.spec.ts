//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import {
  CommonFns,
  CONNECTOR_URL,
  CONNECTORS_OLD_URL,
  CREATE_CONNECTOR_OLD_URL,
  CREATE_CONNECTOR_URL,
  EDIT_CONNECTOR_OLD_URL,
  EDIT_CONNECTOR_URL,
} from '@ues/assets-e2e'

const { visitView, loadingIconShould, validateURL } = CommonFns(I)

describe('Settings: Gateway Connectors Redirects', () => {
  it('should redirect to supported connectors list page', () => {
    visitView(CONNECTORS_OLD_URL)
    loadingIconShould('not.exist')
    validateURL(CONNECTOR_URL)
  })

  it('should redirect to supported add connector page', () => {
    visitView(CREATE_CONNECTOR_OLD_URL)
    loadingIconShould('not.exist')
    validateURL(CREATE_CONNECTOR_URL)
  })

  it('should redirect to supported edit connector page', () => {
    visitView(EDIT_CONNECTOR_OLD_URL)
    loadingIconShould('not.exist')
    validateURL(EDIT_CONNECTOR_URL)
  })

  it('should redirect to supported connectors list page when connector does not exist', () => {
    visitView(`${CONNECTORS_OLD_URL}/not_exist`)
    loadingIconShould('not.exist')
    validateURL(CONNECTOR_URL)
  })
})
