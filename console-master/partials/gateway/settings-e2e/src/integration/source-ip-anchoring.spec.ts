//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
import { tenantConfigurationMock } from '@ues-data/gateway/mocks'
import { AriaElementLabel, CommonFns, SOURCE_IP_ANCHORING_URL } from '@ues/assets-e2e'

const { loadingIconShould, tableShould, visitView } = CommonFns(I)

describe('Settings: Source IP pinning', () => {
  const ENABLED_CONTENT_TEXT = 'sourceIPAnchoring.sourceIPAnchoringIPAddressesText'
  const DISABLED_CONTENT_TEXT = 'sourceIPAnchoring.sourceIPAnchoringDisabledText'

  before(() => {
    visitView(SOURCE_IP_ANCHORING_URL, {}, ['components', 'gateway-settings'])
  })

  beforeEach(() => {
    loadingIconShould('not.exist')
  })

  it('should display proper information', () => {
    const sourceIpAnchoringText = I.findByLabelText(AriaElementLabel.SettingsSourceIpAnchoringView)

    if (tenantConfigurationMock.sourceIPAnchoredEnabled) {
      sourceIpAnchoringText.should('contain', I.translate(ENABLED_CONTENT_TEXT))
      I.findAllByRole('row').should('have.length', tenantConfigurationMock.sourceIPAnchoredIPs?.length + 1)
    } else {
      sourceIpAnchoringText.should('contain', I.translate(DISABLED_CONTENT_TEXT))
      tableShould('not.exist')
    }
  })
})
