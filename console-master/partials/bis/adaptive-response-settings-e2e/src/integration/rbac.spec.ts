/* eslint-disable sonarjs/no-duplicate-string */
//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import '../support'

import { FeatureName, Permission } from '@ues-data/shared-types'

import { getTabPanel, TranslationKey, visitPage } from '../support/utils'

describe('Adaptive Response Settings view - RBAC permissions', () => {
  before(() => {
    window.localStorage.clear()
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem(FeatureName.PermissionChecksEnabled, 'true')
    window.localStorage.setItem(FeatureName.UESCronosNavigation, 'false')

    I.loadI18nNamespaces('platform/common', 'bis/ues', 'bis/shared').then(() => {
      visitPage('#/adaptiveresponse')
    })
  })

  describe('Ues:Bis:Settings:Read', () => {
    it('should render the view if true', () => {
      I.overridePermissions({
        [Permission.BIS_SETTINGS_READ]: true,
        [Permission.BIS_SETTINGS_UPDATE]: true,
      })

      getTabPanel().should('exist').findByText(I.translate('noAccessMessage')).should('not.exist')
    })

    it('should render no access message if false', () => {
      I.overridePermissions({
        [Permission.BIS_SETTINGS_READ]: false,
        [Permission.BIS_SETTINGS_UPDATE]: true,
      })

      getTabPanel().should('exist').findByText(I.translate('noAccessMessage')).should('exist')
    })
  })

  describe('Ues:Bis:Settings:Update', () => {
    it('should render the view if false', () => {
      I.overridePermissions({
        [Permission.BIS_SETTINGS_READ]: true,
        [Permission.BIS_SETTINGS_UPDATE]: false,
      })

      getTabPanel().should('exist').findByText(I.translate('noAccessMessage')).should('not.exist')
    })

    it('should allow for editing the form if true', () => {
      I.overridePermissions({
        [Permission.BIS_SETTINGS_READ]: true,
        [Permission.BIS_SETTINGS_UPDATE]: true,
      })

      I.findByLabelText(I.translate(TranslationKey.OperatingModeTitle)).should($element => {
        expect($element).to.have.length(1)
        const ariaDisabled = $element[0].getAttribute('aria-disabled')
        if (ariaDisabled) {
          expect(ariaDisabled).to.be.eq('false')
        }
      })
    })

    it('should not allow for editing the form if false', () => {
      I.overridePermissions({
        [Permission.BIS_SETTINGS_READ]: true,
        [Permission.BIS_SETTINGS_UPDATE]: false,
      })

      I.findByLabelText(I.translate(TranslationKey.OperatingModeTitle)).should($element => {
        expect($element).to.have.length(1)
        const ariaDisabled = $element[0].getAttribute('aria-disabled')
        expect(ariaDisabled).to.be.eq('true')
      })
    })
  })
})
