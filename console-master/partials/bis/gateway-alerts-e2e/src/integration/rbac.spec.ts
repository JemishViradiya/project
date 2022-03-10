/* eslint-disable sonarjs/no-duplicate-string */
//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import '../support'

import { FeatureName, Permission } from '@ues-data/shared-types'

import { closeDrawer, getGrid, openDrawer, TranslationKey } from '../support/utils'

const getNoAccessMessage = () => {
  return I.findByText(I.translate('noAccessMessage'))
}

describe('Gateway Alerts view - RBAC permissions', () => {
  before(() => {
    window.localStorage.clear()
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem(FeatureName.PermissionChecksEnabled, 'true')
    window.localStorage.setItem(FeatureName.UESCronosNavigation, 'true')

    I.loadI18nNamespaces('platform/common', 'tables', 'bis/ues', 'bis/shared', 'general/form').then(() => {
      I.visit('#/alerts')
    })
  })

  describe('Ues:Bis:Events:Read', () => {
    it('should render the view if true', () => {
      I.overridePermissions({
        [Permission.BIG_REPORTING_READ]: true,
        [Permission.BIS_EVENTS_READ]: true,
        [Permission.BIS_SETTINGS_READ]: true,
        [Permission.ECS_USERS_READ]: true,
      })

      getGrid().should('exist')
    })

    it('should render no access message if false', () => {
      I.overridePermissions({
        [Permission.BIG_REPORTING_READ]: true,
        [Permission.BIS_EVENTS_READ]: false,
        [Permission.BIS_SETTINGS_READ]: true,
        [Permission.ECS_USERS_READ]: true,
      })

      getNoAccessMessage().should('exist')
      getGrid().should('not.exist')
    })
  })

  describe('Ues:Bis:Settings:Read', () => {
    it('should render the view if true', () => {
      I.overridePermissions({
        [Permission.BIG_REPORTING_READ]: true,
        [Permission.BIS_EVENTS_READ]: true,
        [Permission.BIS_SETTINGS_READ]: true,
        [Permission.ECS_USERS_READ]: true,
      })

      getGrid().should('exist')
    })

    it('should render no access message if false', () => {
      I.overridePermissions({
        [Permission.BIG_REPORTING_READ]: true,
        [Permission.BIS_EVENTS_READ]: true,
        [Permission.BIS_SETTINGS_READ]: false,
        [Permission.ECS_USERS_READ]: true,
      })

      getNoAccessMessage().should('exist')
      getGrid().should('not.exist')
    })
  })

  describe('Ues:Big:Reporting:Read', () => {
    before(() => {
      openDrawer()
    })

    after(() => {
      closeDrawer()
    })

    it('should render the event details row if true', () => {
      I.overridePermissions({
        [Permission.BIG_REPORTING_READ]: true,
        [Permission.BIS_EVENTS_READ]: true,
        [Permission.BIS_SETTINGS_READ]: true,
        [Permission.ECS_USERS_READ]: true,
      })

      I.findByRole('complementary').should('contain.text', I.translate(TranslationKey.EventDetailsRowLabel))
    })

    it('should not render the event details row if false', () => {
      I.overridePermissions({
        [Permission.BIG_REPORTING_READ]: false,
        [Permission.BIS_EVENTS_READ]: true,
        [Permission.BIS_SETTINGS_READ]: true,
        [Permission.ECS_USERS_READ]: true,
      })

      I.findByRole('complementary').should('not.contain.text', I.translate(TranslationKey.EventDetailsRowLabel))
    })
  })

  describe('Ues:Ecs:Users:Read', () => {
    before(() => {
      openDrawer()
    })

    after(() => {
      closeDrawer()
    })

    it('should render the user hyperlink if true', () => {
      I.overridePermissions({
        [Permission.BIG_REPORTING_READ]: true,
        [Permission.BIS_EVENTS_READ]: true,
        [Permission.BIS_SETTINGS_READ]: true,
        [Permission.ECS_USERS_READ]: true,
      })

      I.findByRole('complementary').should('exist')
    })

    it('should not render the user hyperlink if false', () => {
      I.overridePermissions({
        [Permission.BIG_REPORTING_READ]: true,
        [Permission.BIS_EVENTS_READ]: true,
        [Permission.BIS_SETTINGS_READ]: true,
        [Permission.ECS_USERS_READ]: false,
      })

      I.findByRole('complementary').findByLabelText(I.translate(TranslationKey.UserDetailsHyperlink)).should('not.exist')
    })
  })
})
