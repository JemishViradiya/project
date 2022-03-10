//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { FeatureName } from '@ues-data/shared'
import {
  ADD_GATEWAY_SERVICE_POLICY_URL,
  AriaElementLabel,
  COMMON_ADD_BUTTON,
  COMMON_CANCEL_BUTTON,
  COMMON_DELETE_BUTTON,
  COMMON_EDIT_BUTTON,
  COMMON_NAME_LABEL,
  COMMON_NOT_NOW,
  COMMON_SAVE_CHANGES_BUTTON,
  CommonFns,
  POLICIES_ANDROID_PER_APP_SWITCH_LABEL,
  POLICIES_CIDR_ADDRESSES,
  POLICIES_MACOS_SWITCH_LABEL,
  POLICIES_SPLIT_TUNNEL_SWITCH_LABEL,
  POLICIES_WINDOWS_ADD_PATH,
  POLICIES_WINDOWS_ADD_PFN,
  POLICIES_WINDOWS_AUTH_APP_SWITCH_LABEL,
  POLICIES_WINDOWS_INCOMING_CONNECTIONS_SWITCH_LABEL,
  POLICIES_WINDOWS_OTHER_USERS_LABEL,
  POLICIES_WINDOWS_PATHS,
  POLICIES_WINDOWS_PER_APP_VPN,
  POLICIES_WINDOWS_PFN,
  POLICIES_WINDOWS_PROTECT_SWITCH_LABEL,
  POLICIES_WINDOWS_UNAUTH_APP_SWITCH_LABEL,
} from '@ues/assets-e2e'

const { getButton, loadingIconShould, visitView, getTextbox } = CommonFns(I)

describe('Gateway Service policy', () => {
  beforeEach(() => {
    visitView(
      ADD_GATEWAY_SERVICE_POLICY_URL,
      {
        [FeatureName.UESBigWindowsTunnelEnabled]: true,
        [FeatureName.UESBigMacOSProtectEnabled]: true,
      },
      ['profiles', 'navigation', 'general/form', 'gateway/common'],
    )
    loadingIconShould('not.exist')
  })

  const APP_ID = 'test.com'
  const APP_IDS = ['app-id-0', 'app-id-1', 'app--id-2']
  const CIDR_ADDRESSES = ['1.1.1.1/20', '192.168.1.1/10', '192.168.5.1/11']
  const WINDOWS_PATHS = ['C:\\test\\test', 'C:\\folder\\sub folder\\app.exe', '%AppData%\\app\\app.exe']
  const WINDOWS_PFNS = ['app.id.test1.com', 'app.id.test2.com', 'app.id.test3.com']
  const MAX_APP_ID_LENGTH = 256
  const TOO_LONG_APP_ID = `${'too.long.app.test.com'.repeat(15)}1`

  describe('Split Tunneling', () => {
    beforeEach(() => {
      I.findByRole('checkbox', { name: POLICIES_SPLIT_TUNNEL_SWITCH_LABEL }).should('have.value', 'false').click()
      I.findByRole('checkbox', { name: POLICIES_SPLIT_TUNNEL_SWITCH_LABEL }).should('have.value', 'true')
    })

    it('should add a single CIDR', () => {
      getButton(AriaElementLabel.AddCidrAddressIconButton).click({ force: true })
      I.findByLabelText(I.translate(POLICIES_CIDR_ADDRESSES)).clear().type(CIDR_ADDRESSES[0])
      getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()
      I.findByRole('row', { name: CIDR_ADDRESSES[0] }).should('exist')
      I.findAllByRole('row').should('have.length', 2)
    })

    it('should edit a CIDR', () => {
      getButton(AriaElementLabel.AddCidrAddressIconButton).click({ force: true })
      I.findByLabelText(I.translate(POLICIES_CIDR_ADDRESSES)).clear().type(CIDR_ADDRESSES[0])
      getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()
      I.findByRole('row', { name: CIDR_ADDRESSES[0] }).should('exist')
      I.findAllByRole('row').should('have.length', 2)

      getButton(I.translate(COMMON_EDIT_BUTTON)).click()
      I.findByLabelText(I.translate(POLICIES_CIDR_ADDRESSES)).clear().type(CIDR_ADDRESSES[1])
      getButton(I.translate(COMMON_SAVE_CHANGES_BUTTON)).should('be.enabled').click()
      I.findByText(CIDR_ADDRESSES[0]).should('not.exist')
      I.findByText(CIDR_ADDRESSES[1]).should('exist')
    })

    it('should delete a CIDR', () => {
      getButton(AriaElementLabel.AddCidrAddressIconButton).click({ force: true })
      I.findByLabelText(I.translate(POLICIES_CIDR_ADDRESSES)).clear().type(CIDR_ADDRESSES[0])
      getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()
      I.findByRole('row', { name: CIDR_ADDRESSES[0] }).should('exist')
      I.findAllByRole('row').should('have.length', 2)

      getButton(I.translate(COMMON_DELETE_BUTTON)).click()
      I.findByText(CIDR_ADDRESSES[0]).should('not.exist')
    })

    it('should add two CIDR addresses and handle an empty line', () => {
      getButton(AriaElementLabel.AddCidrAddressIconButton).click({ force: true })
      I.findByLabelText(I.translate(POLICIES_CIDR_ADDRESSES)).clear().type(CIDR_ADDRESSES[1])
      I.findByLabelText(I.translate(POLICIES_CIDR_ADDRESSES)).type('{enter}')
      I.findByLabelText(I.translate(POLICIES_CIDR_ADDRESSES)).type(CIDR_ADDRESSES[2])
      I.findByLabelText(I.translate(POLICIES_CIDR_ADDRESSES)).type('{enter}')
      getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()
      I.findByRole('row', { name: CIDR_ADDRESSES[1] }).should('exist')
      I.findByRole('row', { name: CIDR_ADDRESSES[2] }).should('exist')
      I.findAllByRole('row').should('have.length', 3)
      I.findByRole('checkbox', { name: POLICIES_SPLIT_TUNNEL_SWITCH_LABEL }).click()
    })
  })

  describe('MacOS Tab', () => {
    beforeEach(() => {
      getButton(I.translate('general/form:os.macos')).click()
    })

    it('should turn on the BlackBerry Protect', () => {
      I.findByRole('checkbox', { name: POLICIES_MACOS_SWITCH_LABEL }).should('have.value', 'false').click()
      I.findByRole('checkbox', { name: POLICIES_MACOS_SWITCH_LABEL }).should('have.value', 'true')
    })
  })

  describe('Windows Tab', () => {
    beforeEach(() => {
      getButton(I.translate('policies.windowsAccessControlTitle')).click()
    })

    it('should turn on the Force applications to use the tunnel', () => {
      I.findByRole('checkbox', { name: POLICIES_WINDOWS_AUTH_APP_SWITCH_LABEL }).should('have.value', 'false').click()
      I.findByRole('checkbox', { name: POLICIES_WINDOWS_AUTH_APP_SWITCH_LABEL }).should('have.value', 'true')
    })

    it('should turn on the Block network traffic from unallowed apps', () => {
      I.findByRole('checkbox', { name: POLICIES_WINDOWS_UNAUTH_APP_SWITCH_LABEL }).should('have.value', 'false').click()
      I.findByRole('checkbox', { name: POLICIES_WINDOWS_UNAUTH_APP_SWITCH_LABEL }).should('have.value', 'true')
    })

    it('should turn off the Allow incoming connections', () => {
      I.findByRole('checkbox', { name: POLICIES_WINDOWS_INCOMING_CONNECTIONS_SWITCH_LABEL }).should('have.value', 'true').click()
      I.findByRole('checkbox', { name: POLICIES_WINDOWS_INCOMING_CONNECTIONS_SWITCH_LABEL }).should('have.value', 'false')
    })

    it('should turn on the Allow Gateway to run only if BlackBerry Protect is also activated on the device', () => {
      I.findByRole('checkbox', { name: POLICIES_WINDOWS_PROTECT_SWITCH_LABEL }).should('have.value', 'false').click()
      I.findByRole('checkbox', { name: POLICIES_WINDOWS_PROTECT_SWITCH_LABEL }).should('have.value', 'true')
    })

    it('should turn on the Allow other Windows users to use the tunnel', () => {
      I.findByRole('checkbox', { name: POLICIES_WINDOWS_OTHER_USERS_LABEL }).should('have.value', 'false').click()
      I.findByRole('checkbox', { name: POLICIES_WINDOWS_OTHER_USERS_LABEL }).should('have.value', 'true')
    })

    describe('Per App Vpn', () => {
      beforeEach(() => {
        I.findByRole('checkbox', { name: POLICIES_WINDOWS_PER_APP_VPN }).should('have.value', 'false').click()
        I.findByRole('checkbox', { name: POLICIES_WINDOWS_PER_APP_VPN }).should('have.value', 'true')
      })

      const getWindowsPaths = () => I.findByLabelText(I.translate(POLICIES_WINDOWS_PATHS))
      const getWindowsPfn = () => I.findByLabelText(I.translate(POLICIES_WINDOWS_PFN))

      const addWindowsPath = (path: string) => {
        getButton(AriaElementLabel.DropdownIconButton).click()
        I.findByText(I.translate(POLICIES_WINDOWS_ADD_PATH)).click()

        getWindowsPaths().clear().type(path)
      }

      const addWindowsPfn = (windowsPfn: string) => {
        getButton(AriaElementLabel.DropdownIconButton).click()
        I.findByText(I.translate(POLICIES_WINDOWS_ADD_PFN)).click()

        getWindowsPfn().clear().type(windowsPfn)
      }

      it('should add a single path', () => {
        addWindowsPath('C:test')

        getButton(I.translate(COMMON_ADD_BUTTON)).should('be.disabled')
        getWindowsPaths().clear().type(WINDOWS_PATHS[0])

        I.findByRole('alert').should('contain', I.translate('policies.windowsPathExeWarningMessage'))

        getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()
        I.findByText(WINDOWS_PATHS[0]).should('exist')
      })

      it('should validate a path', () => {
        addWindowsPath('drive\\folder')

        getButton(I.translate(COMMON_ADD_BUTTON)).should('be.disabled')
        I.findByText(I.translate('policies.windowsPathDriveLetterValidationMessage')).should('exist')
        getButton(I.translate(COMMON_CANCEL_BUTTON)).click()
      })

      it('should add multiple paths and handle empty lines', () => {
        addWindowsPath(WINDOWS_PATHS[0])

        getWindowsPaths().clear().type(WINDOWS_PATHS[1])
        getWindowsPaths().type('{enter}')
        getWindowsPaths().type('{enter}')
        getWindowsPaths().type('{enter}')
        getWindowsPaths().type(WINDOWS_PATHS[2])
        getWindowsPaths().type('{enter}')

        getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()

        I.findByText(WINDOWS_PATHS[1]).should('exist')
        I.findByText(WINDOWS_PATHS[2]).should('exist')
      })

      it('should edit an existing path', () => {
        addWindowsPath(WINDOWS_PATHS[0])
        getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()

        getButton(I.translate(COMMON_EDIT_BUTTON)).eq(0).click()
        getWindowsPaths().clear().type(WINDOWS_PATHS[1])

        getButton(I.translate(COMMON_SAVE_CHANGES_BUTTON)).should('be.enabled').click()
        I.findByText(WINDOWS_PATHS[0]).should('not.exist')
        I.findByText(WINDOWS_PATHS[1]).should('exist')
      })

      it('should delete an existing path', () => {
        addWindowsPath(WINDOWS_PATHS[0])

        getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()
        I.findByText(WINDOWS_PATHS[0]).should('exist')
        getButton(I.translate(COMMON_DELETE_BUTTON)).click()

        I.findByText(WINDOWS_PATHS[0]).should('not.exist')
      })

      it('should add a single Windows Pfn', () => {
        addWindowsPfn('app.id.test. com')

        getButton(I.translate(COMMON_ADD_BUTTON)).should('be.disabled')
        getWindowsPfn().clear().type('app.id.test.com')
        getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()

        I.findByText('app.id.test.com').should('exist')
      })

      it('should validate a Windows Pfn', () => {
        addWindowsPfn(TOO_LONG_APP_ID)

        getButton(I.translate(COMMON_ADD_BUTTON)).should('be.disabled')
        I.findByText(
          I.translate('general/form:validationErrors.maxLength', { fieldName: 'The path', max: MAX_APP_ID_LENGTH }),
        ).should('exist')

        getButton(I.translate(COMMON_ADD_BUTTON)).should('be.disabled')
        getButton(I.translate(COMMON_CANCEL_BUTTON)).click()
      })

      it('should add multiple Windows Pfns and handle empty lines', () => {
        addWindowsPfn(WINDOWS_PFNS[0])

        getWindowsPfn().clear().type(WINDOWS_PFNS[1])
        getWindowsPfn().type('{enter}')
        getWindowsPfn().type(WINDOWS_PFNS[2])
        getWindowsPfn().type('{enter}')

        getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()

        I.findByText(WINDOWS_PFNS[1]).should('exist')
        I.findByText(WINDOWS_PFNS[2]).should('exist')
      })

      it('should edit an existing Windows Pfn', () => {
        addWindowsPfn(WINDOWS_PFNS[0])
        getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()

        getButton(I.translate(COMMON_EDIT_BUTTON)).eq(0).click()
        getWindowsPfn().clear().type(WINDOWS_PFNS[1])
        getButton(I.translate(COMMON_SAVE_CHANGES_BUTTON)).should('be.enabled').click()

        I.findByText(WINDOWS_PFNS[0]).should('not.exist')
        I.findByText(WINDOWS_PFNS[1]).should('exist')
      })

      it('should delete an existing Windows Pfn', () => {
        addWindowsPfn(WINDOWS_PFNS[0])

        getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()
        I.findByText(WINDOWS_PFNS[0]).should('exist')
        getButton(I.translate(COMMON_DELETE_BUTTON)).click()

        I.findByText(WINDOWS_PFNS[0]).should('not.exist')
      })
    })
  })

  describe('Android Tab', () => {
    beforeEach(() => {
      getButton(I.translate('policies.androidAccessControlTitle')).click()

      I.findByRole('checkbox', { name: POLICIES_ANDROID_PER_APP_SWITCH_LABEL }).should('have.value', 'false').click()
      I.findByRole('checkbox', { name: POLICIES_ANDROID_PER_APP_SWITCH_LABEL }).should('have.value', 'true')
    })

    it('should add a single app id', () => {
      I.findByRole('textbox', { name: I.translate('common.name') })
        .clear()
        .type(APP_IDS[0])

      getButton(AriaElementLabel.AddApplicationIdIconButton).click()
      I.findByRole('textbox').clear().type(APP_IDS[0])
      getButton(I.translate(COMMON_ADD_BUTTON)).click()
    })

    it('should add two app ids and handle an empty line', () => {
      getButton(AriaElementLabel.AddApplicationIdIconButton).click()

      I.findByRole('textbox').clear().type(APP_IDS[1])
      I.findByRole('textbox').type('{enter}')
      I.findByRole('textbox').type(APP_IDS[2])
      I.findByRole('textbox').type('{enter}')
      getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()

      I.findByRole('row', { name: APP_IDS[1] }).should('exist')
      I.findByRole('row', { name: APP_IDS[2] }).should('exist')
      I.findAllByRole('row').should('have.length', 3)
    })

    it('should validate android app ids', () => {
      getButton(AriaElementLabel.AddApplicationIdIconButton).click()

      I.findByRole('textbox').type(APP_ID)
      getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled')

      I.findByRole('textbox').clear().type(TOO_LONG_APP_ID)
      getButton(I.translate(COMMON_ADD_BUTTON)).should('be.disabled')
      I.findByText(I.translate('policies.appIdFieldMaxLengthValidationMessage', { value: MAX_APP_ID_LENGTH })).should('exist')

      I.findByRole('textbox').clear().type(`${APP_ID} \n ${APP_ID}2 \n ${APP_ID}3 \n ${APP_ID}4 \n ${APP_ID}5`)
      getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()

      loadingIconShould('not.exist')
      I.findByText('Included apps').should('exist')
      I.findByLabelText(AriaElementLabel.AddApplicationIdIconButton).should('be.enabled')
    })

    it('should edit an app id', () => {
      getButton(AriaElementLabel.AddApplicationIdIconButton).click()
      I.findByRole('textbox').clear().type(APP_IDS[1])
      I.findByRole('textbox').type('{enter}')
      I.findByRole('textbox').type(APP_IDS[2])
      I.findByRole('textbox').type('{enter}')
      getButton(I.translate(COMMON_ADD_BUTTON)).click()

      I.findByRole('row', { name: APP_IDS[1] })
        .should('exist')
        .findByRole('button', { name: I.translate(COMMON_EDIT_BUTTON) })
        .click()
      I.findByRole('textbox').clear().type(APP_IDS[0])
      getButton(I.translate(COMMON_SAVE_CHANGES_BUTTON)).click()

      I.findByRole('row', { name: APP_IDS[0] }).should('exist')
      I.findByRole('row', { name: APP_IDS[1] }).should('not.exist')
      I.findByRole('row', { name: APP_IDS[2] }).should('exist')
      I.findAllByRole('row').should('have.length', 3)
    })

    it('should delete an app id', () => {
      getButton(AriaElementLabel.AddApplicationIdIconButton).click()
      I.findByRole('textbox').clear().type(APP_IDS[1])
      getButton(I.translate(COMMON_ADD_BUTTON)).click()
      I.findByRole('row', { name: APP_IDS[1] })
        .should('exist')
        .findByRole('button', { name: I.translate(COMMON_DELETE_BUTTON) })
        .click()
      I.findByRole('row', { name: APP_IDS[1] }).should('not.exist')
      I.findAllByRole('row').should('have.length', 2)
    })
  })

  describe('Add a new policy', () => {
    it('should create a new policy', () => {
      getTextbox(I.translate(COMMON_NAME_LABEL)).type('test new policy')
      getButton(AriaElementLabel.StickyActionsSaveButton).should('be.enabled').click()
      getButton(I.translate(COMMON_NOT_NOW)).click()

      expect(window.location.href.endsWith('add')).eq(false)
    })
  })
})
