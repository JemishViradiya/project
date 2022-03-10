/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { Permission } from '@ues-data/shared-types'

const setLocalStorageState = win => {
  win.localStorage.setItem('UES_DATA_MOCK', 'true')
  win.localStorage.setItem('UES.MTD.enabled', 'true')
  win.localStorage.setItem('ues.nav.cronos.enabled', 'true')
  win.localStorage.setItem('ues.permission.checks.enabled', 'true')
}

describe('Add Enrollment Profile', () => {
  let addEnrollmentPolicy: string
  let generalInformation: string
  let settings: string
  let mobileWelcomeEmail: string
  let emailMessage: string
  let emailSubject: string
  let profileName: string
  let profileDescription: string
  let mobileTab: string
  let gatewayTab: string
  let allowedPlatforms: string
  let buttonAdd: string
  let buttonCancel: string
  let iOSPlatform: string
  let androidPlatform: string
  let windowsPlatform: string
  let macOSPlatform: string
  let requiredField: string
  let unsavedMessage: string
  let unsavedMessageContent: string
  let unsavedMessageSubmit: string
  let assignCreatedPolicyConfirmation: string
  let assignCreatedPolicyDescription: string
  let creationSuccessMessage: string
  let buttonNotNow: string
  let buttonYes: string

  before(() => {
    window.localStorage.clear()
    setLocalStorageState(window)
    I.loadI18nNamespaces('platform/common', 'general/form').then(() => {
      addEnrollmentPolicy = I.translate('activationProfile.add.title')
      generalInformation = I.translate('activationProfile.form.generalInfo')
      settings = I.translate('activationProfile.form.settings')
      mobileWelcomeEmail = I.translate('activationProfile.form.mobileWelcomeLabel')
      emailMessage = I.translate('activationProfile.form.message')
      emailSubject = I.translate('activationProfile.form.subject')
      profileName = I.translate('activationProfile.form.name')
      profileDescription = I.translate('activationProfile.form.description')
      mobileTab = I.translate('activationProfile.form.mobileTab')
      gatewayTab = I.translate('activationProfile.form.gatewayTab')
      allowedPlatforms = I.translate('activationProfile.form.allowedPlatforms')
      buttonAdd = I.translate('general/form:commonLabels.add')
      buttonCancel = I.translate('general/form:commonLabels.cancel')
      iOSPlatform = I.translate('activationProfile.form.mobileIos')
      androidPlatform = I.translate('activationProfile.form.mobileAndroid')
      windowsPlatform = I.translate('activationProfile.form.desktopWin')
      macOSPlatform = I.translate('activationProfile.form.desktopMac')
      requiredField = I.translate('activationProfile.form.required')
      unsavedMessage = I.translate('activationProfile.unsaved.title')
      unsavedMessageContent = I.translate('activationProfile.unsaved.content')
      unsavedMessageSubmit = I.translate('activationProfile.unsaved.submit')
      assignCreatedPolicyConfirmation = I.translate('activationProfile.assignCreatedPolicyConfirmation.title')
      assignCreatedPolicyDescription = I.translate('activationProfile.assignCreatedPolicyConfirmation.description')
      creationSuccessMessage = I.translate('activationProfile.add.successMessage')
      buttonNotNow = I.translate('general/form:commonLabels.notNow')
      buttonYes = I.translate('general/form:commonLabels.yes')

      const overridePermissionsObj = {}
      overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_READ] = true
      overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_CREATE] = true
      overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_UPDATE] = true
      overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_DELETE] = true

      I.overridePermissions({ ...overridePermissionsObj })

      I.visit(`#/activation/add`)
    })
  })

  const findAndTestRole = (roleType: string, roleNames: string[]) => {
    roleNames.forEach(item => {
      I.findByRole(roleType, { name: item }).should('exist').and('be.visible')
    })
  }

  const findAndTestCheckbox = (...checkboxNames: string[]) => {
    checkboxNames.forEach(item => {
      I.findByRole('checkbox', { name: item }).should('be.checked').uncheck().should('not.be.checked').check().should('be.checked')
    })
  }

  const clickButton = (buttonName: string) => {
    I.findByRole('button', { name: buttonName }).click()
  }

  const findElementAndCheckExistingByText = (...elementNames: string[]) => {
    elementNames.forEach(item => {
      I.findByText(item).should('exist')
    })
  }

  const findAndTestTextBoxByNearestText = (...textes: string[]) => {
    textes.forEach(item => {
      I.findByText(item)
        .should('exist')
        .and('be.visible')
        .next()
        .within(() => {
          I.findByRole('textbox').should('exist').and('be.visible')
        })
    })
  }

  it('testing enrollment profile title/form names', () => {
    // check profile page headings and form names
    findAndTestRole('heading', [addEnrollmentPolicy, generalInformation, settings, mobileWelcomeEmail])
    I.findByRole('tabpanel').should('contain', emailMessage)
  })

  it('testing enrollment profile forms', () => {
    // check general information textboxes
    findAndTestTextBoxByNearestText(profileName, profileDescription)

    // check platform tabs and checkbox
    I.findByRole('group').within(() => {
      findAndTestRole('button', [mobileTab, gatewayTab])
    })
    I.findByRole('checkbox', { name: allowedPlatforms })

    // check email area
    I.findByRole('tabpanel')
      .should('exist')
      .within(() => {
        findElementAndCheckExistingByText(allowedPlatforms, emailSubject)
        I.findByRole('toolbar').should('exist')
        I.findByLabelText(emailMessage).should('exist')
      })

    // check save/cancel button
    findAndTestRole('button', [buttonAdd, buttonCancel])
  })

  it('testing enrollment profile toggles', () => {
    // Test mobile platforms
    findAndTestCheckbox(iOSPlatform, androidPlatform, allowedPlatforms)

    // Test desktop platforms
    clickButton(gatewayTab)
    findAndTestCheckbox(windowsPlatform, macOSPlatform, allowedPlatforms)
  })

  it('testing enrollment profile confirmation action', () => {
    // this test is on the gateway tab
    clickButton(gatewayTab)
    // profile name was not filled out, the notification should be appeared
    clickButton(buttonAdd)
    I.findByText(profileName).parent().findByText(requiredField).should('exist')

    // fill in profile name
    I.findByText(profileName)
      .next()
      .within(() => {
        I.findByRole('textbox').get('input').clear().type('Activation profile test')
      })

    // clear email subject
    I.findByRole('tabpanel').within(() => {
      I.findByLabelText(emailSubject).clear()
    })

    // email subject was not filled out, the notification should be appeared
    clickButton(buttonAdd)
    I.findByRole('tabpanel').find('p').contains(requiredField)

    // fill in email subject
    I.findByRole('tabpanel').within(() => {
      I.findByLabelText(emailSubject).clear().type('Email subject test')
    })

    // clear email message
    I.findByRole('tabpanel').within(() => {
      I.findByLabelText(emailMessage).clear({ force: true })
    })

    // email message was not filled out, the notification should be appeared
    clickButton(buttonAdd)
    I.findByRole('tabpanel').find('p').contains(requiredField)

    // fill in email message
    I.findByRole('tabpanel').within(() => {
      I.findByLabelText(emailMessage).type('Email message test', { force: true })
    })

    // check the notification of unsaved changes
    clickButton(buttonCancel)
    findAndTestRole('heading', [unsavedMessage])
    I.findByText(unsavedMessageContent).should('exist').and('be.visible')
    findAndTestRole('button', [buttonCancel, unsavedMessageSubmit])

    // discard previous notification
    clickButton(buttonCancel)
    clickButton(buttonAdd)

    // check the notification of successful profile creation
    findAndTestRole('heading', [assignCreatedPolicyConfirmation])
    I.findByText(assignCreatedPolicyDescription).should('exist').and('be.visible')
    findAndTestRole('button', [buttonNotNow, buttonYes])
    clickButton(buttonYes)

    // check the confirmation message of successful profile creation
    I.findByText(creationSuccessMessage).should('exist').and('be.visible')
  })
})
