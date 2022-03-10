//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import {
  AriaElementLabel,
  COMMON_ADD_BUTTON,
  COMMON_DELETE_BUTTON,
  CommonFns,
  PRIVATE_NETWORK_ROUTING_URL,
  PRIVATE_ROUTE_ADD_BUTTON,
} from '@ues/assets-e2e'

const { getButton, tableCellShould, loadingIconShould, visitView } = CommonFns(I)

context('Settings: Private Network', () => {
  before(() => {
    visitView(PRIVATE_NETWORK_ROUTING_URL, {}, ['components', 'gateway-settings'])
  })

  const IPV4_ADDRESSES = ['12.244.233.165', '12.255.211.165', '12.255.211.150']
  const IPV4_CDIR = ['192.168.100.0/24', '196.168.120.2/22']
  const IPV4_RANGE = '19.9.0.0-19.255.255.255'
  const IPV6_ADDRESSES = [
    '2001:0db8:0000:0000:0000:ff00:0042:7879',
    '2001:0db8:0000:0000:0000:ff00:0032:7879',
    '2001:0db8:0000:0000:0000:ff00:0042:7229',
  ]
  const IPV6_CDIR = ['2002::1234:abcd:ffff:c0a8:101/64', '2001::1254:abcd:ffff:c0a8:103/66']
  const IPV6_RANGE = 'fd34:fe56:7891:2f3a:0:0:0:0 - fd34:fe56:7891:2f3a:ffff:ffff:ffff:ffff'

  describe('Network Routing Tab', () => {
    beforeEach(() => {
      loadingIconShould('not.exist')
    })

    it('should add and delete Private Route data', () => {
      const testData = [IPV4_ADDRESSES[1], IPV4_CDIR[1], IPV4_RANGE, IPV6_ADDRESSES[1], IPV6_CDIR[1], IPV6_RANGE]

      testData.forEach(element => {
        tableCellShould('not.exist', element)
        getButton(I.translate(PRIVATE_ROUTE_ADD_BUTTON)).click()
        I.findAllByRole('textbox').type(element)
        getButton(I.translate(COMMON_ADD_BUTTON)).click()
        tableCellShould('exist', element)
      })

      getButton(AriaElementLabel.StickyActionsSaveButton).should('not.be.disabled').click()

      testData.forEach(element => {
        tableCellShould('exist', element)
        I.findByLabelText(element)
          .findByRole('button', { name: I.translate(COMMON_DELETE_BUTTON) })
          .click()
        tableCellShould('not.exist', element)
      })

      getButton(AriaElementLabel.StickyActionsSaveButton).should('not.be.disabled').click()
    })
  })
})
