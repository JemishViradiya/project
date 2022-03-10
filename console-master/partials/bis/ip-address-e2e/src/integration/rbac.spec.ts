/* eslint-disable sonarjs/no-duplicate-string */
//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import '../support'

import { FeatureName, Permission } from '@ues-data/shared-types'

import { IpAddressPage, IpAddressPageTranslationKey } from '../pages'

describe('Endpoint Source IP Address - RBAC permissions', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem(FeatureName.PermissionChecksEnabled, 'true')
    window.localStorage.setItem(FeatureName.BisIpFenceEnabled, 'true')

    I.loadI18nNamespaces('platform/common', 'bis/ues', 'bis/shared', 'mtd/common', 'general/form')
  })

  describe('Ues:Venue:SettingsGlobalList:Read', () => {
    it('should render the list if true', () => {
      I.overridePermissions({
        [Permission.VENUE_SETTINGSGLOBALLIST_READ]: true,
      })
      IpAddressPage.waitForPage()

      IpAddressPage.findTable().should('exist')
    })

    it('should render no access message if false', () => {
      I.overridePermissions({
        [Permission.VENUE_SETTINGSGLOBALLIST_READ]: false,
      })
      I.findByText(I.translate('platform/common:noAccessMessage') as string).should('exist')
    })
  })

  describe('Ues:Venue:SettingsGlobalList:Update', () => {
    it('should not allow for editing the ip address if false', () => {
      I.overridePermissions({
        [Permission.VENUE_SETTINGSGLOBALLIST_READ]: true,
        [Permission.VENUE_SETTINGSGLOBALLIST_UPDATE]: false,
      })

      IpAddressPage.waitForPage()

      IpAddressPage.findNthTableRow(0).find('a').first().click()
      IpAddressPage.findDialog()
        .should('exist')
        .within(() => {
          I.findByText(I.translate(IpAddressPageTranslationKey.CloseLabel) as string).should('exist')
        })
    })

    it('should allow for editing the ip address if true', () => {
      I.overridePermissions({
        [Permission.VENUE_SETTINGSGLOBALLIST_READ]: true,
        [Permission.VENUE_SETTINGSGLOBALLIST_UPDATE]: true,
      })

      IpAddressPage.waitForPage()

      IpAddressPage.findNthTableRow(0).find('a').first().click()
      IpAddressPage.findDialog()
        .should('exist')
        .within(() => {
          I.findByText(I.translate(IpAddressPageTranslationKey.SaveLabel) as string).should('exist')
        })
    })
  })

  describe('Ues:Venue:SettingsGlobalList:Create', () => {
    it('should not show add button if false', () => {
      I.overridePermissions({
        [Permission.VENUE_SETTINGSGLOBALLIST_READ]: true,
        [Permission.VENUE_SETTINGSGLOBALLIST_CREATE]: false,
      })
      IpAddressPage.waitForPage()

      IpAddressPage.findAddButton().should('not.exist')
    })
    it('should allow adding new IP if true', () => {
      I.overridePermissions({
        [Permission.VENUE_SETTINGSGLOBALLIST_READ]: true,
        [Permission.VENUE_SETTINGSGLOBALLIST_CREATE]: true,
      })
      IpAddressPage.waitForPage()

      IpAddressPage.findAddButton().should('exist')
    })
  })

  describe('Ues:Venue:SettingsGlobalList:Delete', () => {
    it('should be able to use delete button if true', () => {
      I.overridePermissions({
        [Permission.VENUE_SETTINGSGLOBALLIST_READ]: true,
        [Permission.VENUE_SETTINGSGLOBALLIST_DELETE]: true,
      })
      IpAddressPage.waitForPage()

      IpAddressPage.toggleAllRowsSelection()
      IpAddressPage.findDeleteButton().should('be.visible')
    })

    it('should be able to use delete icon buttons if true', () => {
      I.overridePermissions({
        [Permission.VENUE_SETTINGSGLOBALLIST_READ]: true,
        [Permission.VENUE_SETTINGSGLOBALLIST_DELETE]: true,
      })
      IpAddressPage.waitForPage()

      IpAddressPage.findDeleteIconButtons().first().should('not.be.disabled')
    })

    it('should not be able to select rows if false', () => {
      I.overridePermissions({
        [Permission.VENUE_SETTINGSGLOBALLIST_READ]: true,
        [Permission.VENUE_SETTINGSGLOBALLIST_DELETE]: false,
      })
      IpAddressPage.waitForPage()

      IpAddressPage.findTableHeaderRow().within(() => I.findByRole('checkbox').should('not.exist'))
    })
  })
})
