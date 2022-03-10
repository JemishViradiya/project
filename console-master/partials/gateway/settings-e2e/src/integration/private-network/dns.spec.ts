//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import {
  AriaElementLabel,
  COMMON_ADD_BUTTON,
  COMMON_CANCEL_BUTTON,
  COMMON_DELETE_BUTTON,
  CommonFns,
  PRIVATE_DNS_ADD_BUTTON_TEXT,
  PRIVATE_DNS_ADD_FORWARD_ZONE_BUTTON_TEXT,
  PRIVATE_DNS_ADD_REVERSE_ZONE_BUTTON_TEXT,
  PRIVATE_DNS_ADD_SERVER_TAB_TEXT,
  PRIVATE_DNS_FORWARD_ZONE_TAB_TEXT,
  PRIVATE_DNS_REVERSE_ZONE_TAB_TEXT,
  PRIVATE_NETWORK_DNS_URL,
} from '@ues/assets-e2e'

const { getButton, loadingIconShould, tableCellShould, visitView } = CommonFns(I)

context('Settings: Private Network', () => {
  const IPV4_ADDRESSES = ['192.168.3.1', '192.168.3.5', '192.168.2.1']
  const IPV4_CIDR = ['192.168.100.0/24', '196.168.120.2/22', '192.168.2.1/10']
  const IPV6_CIDR = ['2002::1234:abcd:ffff:c0a8:101/64', '2001::1254:abcd:ffff:c0a8:103/66']
  const DOMAIN_NAMES = ['facebook.com', 'google.com', 'youtube.com', 'discovery.com', 'blackberry.com']

  before(() => {
    visitView(PRIVATE_NETWORK_DNS_URL, {}, ['components', 'gateway-settings'])
  })

  describe('DNS Tab', () => {
    describe('DNS Servers:', () => {
      beforeEach(() => {
        loadingIconShould('not.exist')
        getButton(I.translate(PRIVATE_DNS_ADD_SERVER_TAB_TEXT)).click()
      })

      it('should add a single server', () => {
        tableCellShould('not.exist', IPV4_ADDRESSES[1])
        getButton(I.translate(PRIVATE_DNS_ADD_BUTTON_TEXT)).click()
        I.findAllByRole('textbox').type(IPV4_ADDRESSES[1])
        getButton(I.translate(COMMON_ADD_BUTTON)).click()
        tableCellShould('exist', IPV4_ADDRESSES[1])
      })

      it('should show an error when trying to add a server outside of private network space', () => {
        getButton(I.translate(PRIVATE_DNS_ADD_BUTTON_TEXT)).click()
        I.findAllByRole('textbox').type('1.1.1.1')
        I.findByText(I.translate('dns.dnsServerPrivateNetworkValidation')).should('exist')
        getButton(I.translate(COMMON_CANCEL_BUTTON)).click()
      })

      it('should delete a server', () => {
        I.findByLabelText(IPV4_ADDRESSES[1])
          .findByRole('button', { name: I.translate(COMMON_DELETE_BUTTON) })
          .click()
        tableCellShould('not.exist', IPV4_ADDRESSES[1])
      })

      it('should add multiple servers', () => {
        tableCellShould('not.exist', IPV4_ADDRESSES[0])
        tableCellShould('not.exist', IPV4_ADDRESSES[1])
        getButton(I.translate(PRIVATE_DNS_ADD_BUTTON_TEXT)).click()
        I.findAllByRole('textbox').type(IPV4_ADDRESSES[0])
        I.findAllByRole('textbox').type('{enter}')
        I.findAllByRole('textbox').type(IPV4_ADDRESSES[1])
        getButton(I.translate(COMMON_ADD_BUTTON)).click()
        tableCellShould('exist', IPV4_ADDRESSES[0])
        tableCellShould('exist', IPV4_ADDRESSES[1])
      })
    })

    describe('Forward Lookup Zones:', () => {
      beforeEach(() => {
        getButton(I.translate(PRIVATE_DNS_FORWARD_ZONE_TAB_TEXT)).click()
      })

      it('should add a single zone', () => {
        tableCellShould('not.exist', DOMAIN_NAMES[1])
        getButton(I.translate(PRIVATE_DNS_ADD_FORWARD_ZONE_BUTTON_TEXT)).click()
        I.findAllByRole('textbox').type(DOMAIN_NAMES[1])
        getButton(I.translate(COMMON_ADD_BUTTON)).click()
        tableCellShould('exist', DOMAIN_NAMES[1])
      })

      it('should delete a zone', () => {
        I.findByLabelText(DOMAIN_NAMES[1])
          .findByRole('button', { name: I.translate(COMMON_DELETE_BUTTON) })
          .click()
        tableCellShould('not.exist', DOMAIN_NAMES[1])
      })

      it('should add multiple zones', () => {
        tableCellShould('not.exist', DOMAIN_NAMES[0])
        tableCellShould('not.exist', DOMAIN_NAMES[1])
        getButton(I.translate(PRIVATE_DNS_ADD_FORWARD_ZONE_BUTTON_TEXT)).click()
        I.findAllByRole('textbox').type(DOMAIN_NAMES[0])
        I.findAllByRole('textbox').type('{enter}')
        I.findAllByRole('textbox').type(DOMAIN_NAMES[1])
        getButton(I.translate(COMMON_ADD_BUTTON)).click()
        tableCellShould('exist', DOMAIN_NAMES[0])
        tableCellShould('exist', DOMAIN_NAMES[1])
        getButton(AriaElementLabel.StickyActionsSaveButton).should('not.be.disabled').click()
      })
    })

    describe('Reverse Lookup Zones:', () => {
      beforeEach(() => {
        getButton(I.translate(PRIVATE_DNS_REVERSE_ZONE_TAB_TEXT)).click()
      })

      it('should add an IPV4 zone', () => {
        tableCellShould('not.exist', IPV4_CIDR[1])
        getButton(I.translate(PRIVATE_DNS_ADD_REVERSE_ZONE_BUTTON_TEXT)).click()
        I.findAllByRole('textbox').type(IPV4_CIDR[1])
        getButton(I.translate(COMMON_ADD_BUTTON)).click()
        tableCellShould('exist', IPV4_CIDR[1])
      })

      it('should delete an IPV4 zone', () => {
        I.findByLabelText(IPV4_CIDR[1])
          .findByRole('button', { name: I.translate(COMMON_DELETE_BUTTON) })
          .click()
        tableCellShould('not.exist', IPV4_CIDR[1])
      })

      it('should add multiple IPV4 zones', () => {
        tableCellShould('not.exist', IPV4_CIDR[0])
        tableCellShould('not.exist', IPV4_CIDR[1])
        getButton(I.translate(PRIVATE_DNS_ADD_REVERSE_ZONE_BUTTON_TEXT)).click()
        I.findAllByRole('textbox').type(IPV4_CIDR[0])
        I.findAllByRole('textbox').type('{enter}')
        I.findAllByRole('textbox').type(IPV4_CIDR[1])
        getButton(I.translate(COMMON_ADD_BUTTON)).click()
        tableCellShould('exist', IPV4_CIDR[0])
        tableCellShould('exist', IPV4_CIDR[1])
        getButton(AriaElementLabel.StickyActionsSaveButton).should('not.be.disabled').click()
      })

      it('should add an IPV6 zone', () => {
        tableCellShould('not.exist', IPV6_CIDR[1])
        getButton(I.translate(PRIVATE_DNS_ADD_REVERSE_ZONE_BUTTON_TEXT)).click()
        I.findAllByRole('textbox').type(IPV6_CIDR[1])
        getButton(I.translate(COMMON_ADD_BUTTON)).click()
        tableCellShould('exist', IPV6_CIDR[1])
      })

      it('should delete an IPV6 zone', () => {
        I.findByLabelText(IPV6_CIDR[1])
          .findByRole('button', { name: I.translate(COMMON_DELETE_BUTTON) })
          .click()
        tableCellShould('not.exist', IPV6_CIDR[1])
      })

      it('should add multiple IPV6 zones', () => {
        tableCellShould('not.exist', IPV6_CIDR[0])
        tableCellShould('not.exist', IPV6_CIDR[1])
        getButton(I.translate(PRIVATE_DNS_ADD_REVERSE_ZONE_BUTTON_TEXT)).click()
        I.findAllByRole('textbox').type(IPV6_CIDR[0])
        I.findAllByRole('textbox').type('{enter}')
        I.findAllByRole('textbox').type(IPV6_CIDR[1])
        getButton(I.translate(COMMON_ADD_BUTTON)).click()
        tableCellShould('exist', IPV6_CIDR[0])
        tableCellShould('exist', IPV6_CIDR[1])
        getButton(AriaElementLabel.StickyActionsSaveButton).should('not.be.disabled').click()
      })
    })
  })
})
