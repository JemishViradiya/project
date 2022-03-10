import { CommonFns } from '@ues/assets-e2e'

import {
  getHybridInstallerScriptBtn,
  getHybridInstallerScriptSizeText,
  getHybridLicenseKeyBtn,
  getHybridLicenseKeySizeText,
  getInstallerPackageDownloadButton,
  getInstallerPackageFormatFieldLabel,
  getInstallerPackageHybridOption,
  getInstallerPackageOsField,
  getInstallerPackageOsFieldLabel,
  getInstallerPackageProductField,
  getInstallerPackageProductFieldLabel,
  getInstallerPackageProductOption,
  getInstallerPackageVersionFieldLabel,
  getLinuxOs,
  getMacOs,
  getOsMenu,
  getWindowsOs,
} from '../support/app.po'

const { loadingIconShould } = CommonFns(I)

describe('installer package download', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
  })
  beforeEach(() => {
    window.localStorage.setItem('Deployments.UpdateRules.enabled', 'true')
    window.localStorage.setItem('Deployments.UpdateStrategies.enabled', 'true')
    I.visit('/')
    loadingIconShould('not.exist')
  })

  describe('installer package download button', () => {
    it('displays error on unselected field after submit', () => {
      getInstallerPackageDownloadButton().click()
      getInstallerPackageProductFieldLabel().should('have.class', 'Mui-error')
      getInstallerPackageOsFieldLabel().should('have.class', 'Mui-error')
      getInstallerPackageVersionFieldLabel().should('have.class', 'Mui-error')
      getInstallerPackageFormatFieldLabel().should('have.class', 'Mui-error')
    })

    it('Hybrid download buttons should be visible', () => {
      // Product (Hybrid)
      getInstallerPackageProductField().click()
      getInstallerPackageHybridOption().click()

      getHybridInstallerScriptBtn().should('be.visible')
      getHybridLicenseKeyBtn().should('be.visible')
      getHybridInstallerScriptSizeText().should('not.have.text', 'KB')
    })

    it('Size should be displayed in KB', () => {
      // Product (Hybrid)
      getInstallerPackageProductField().click()
      getInstallerPackageHybridOption().click()

      getHybridInstallerScriptBtn().should('be.visible')
      getHybridLicenseKeyBtn().should('be.visible')
      getHybridLicenseKeySizeText().contains('18B')
    })
  })

  describe('OS select field', () => {
    it('displays options in order', () => {
      getInstallerPackageProductField().click()
      getInstallerPackageProductOption().click()
      getInstallerPackageOsField().click()

      const unsorted = []
      getOsMenu()
        .children()
        .each($item => {
          const text = $item.get(0).innerText
          if (text.includes('Windows')) unsorted.push('windows')
          else if (text.includes('Mac')) unsorted.push('mac')
          else unsorted.push('linux')
        })

      let sorted = true

      let windowsCount
      let macCount
      let linuxCount

      getWindowsOs()
        .its('length')
        .then(length => {
          windowsCount = length
          if (unsorted.slice(0, length).filter(os => os.includes('windows'))) sorted = false
        })

      getMacOs()
        .its('length')
        .then(length => {
          macCount = length
          if (unsorted.slice(windowsCount, windowsCount + macCount).filter(os => os.includes('mac'))) sorted = false
        })
      getLinuxOs()
        .its('length')
        .then(length => {
          linuxCount = length
          if (
            unsorted
              .slice(windowsCount + macCount, windowsCount + macCount + linuxCount)
              .filter(os => !(os.includes('windows') || os.includes('mac')))
          )
            sorted = false
        })
      expect(sorted).to.be.eq(true)
    })
  })
})
