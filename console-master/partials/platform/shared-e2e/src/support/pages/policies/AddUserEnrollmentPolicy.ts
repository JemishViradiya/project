// CodeceptJS and Cypress Page Object for user enrollment policy details

export const AddUserPolicy = {
  addEnrollmentPolicyOptions(policyName: unknown) {
    const BE_VISIBLE = 'be.visible'

    const tSETTINGS = I.translate('platform/common:activationProfile.form.settings')
    const tMOBILE_WELCOME = I.translate('platform/common:activationProfile.form.mobileWelcomeLabel')
    const tALLOWED_PLATFORMS = I.translate('platform/common:activationProfile.form.allowedPlatforms')
    const tMOBILE = I.translate('platform/common:activationProfile.form.mobileTab')
    const tGATEWAY_DESKTOP = I.translate('platform/common:activationProfile.form.gatewayTab')
    const tIOS = I.translate('platform/common:activationProfile.form.mobileIos')
    const tANDROID = I.translate('platform/common:activationProfile.form.mobileAndroid')
    const tWINDOWS = I.translate('platform/common:activationProfile.form.desktopWin')
    const tMAC = I.translate('platform/common:activationProfile.form.desktopMac')
    const tSUBJECT = I.translate('platform/common:activationProfile.form.subject')
    const tBODY = I.translate('platform/common:activationProfile.form.message')

    const dMOBILE = policyName[0].settings[0].isMobile
    const dGATEWAY_DESKTOP = policyName[0].settings[0].isGatewayDesktop
    const dALLOWED_PLATFORMS = policyName[0].settings[0].isAllowedPlatforms
    const dANDROID = policyName[0].settings[0].platforms[0].android
    const dIOS = policyName[0].settings[0].platforms[0].iOS
    const dMAC = policyName[0].settings[0].platforms[0].macOS
    const dWINDOWS = policyName[0].settings[0].platforms[0].windows
    const dSUBJECT = policyName[0].welcomeEmail[0].subject
    const dBODY = policyName[0].welcomeEmail[0].emailBody

    I.findByRole('heading', { level: 2, name: tSETTINGS }).should(BE_VISIBLE)
    I.findAllByText(tALLOWED_PLATFORMS, { timeout: 2000 }).should(BE_VISIBLE)
    I.findByRole('heading', { level: 3, name: tMOBILE_WELCOME }).should(BE_VISIBLE)
    I.findAllByText(tBODY).should(BE_VISIBLE)

    if (dALLOWED_PLATFORMS) {
      I.findAllByRole('checkbox', { name: tALLOWED_PLATFORMS }).check()
    }

    I.findByRole('button', { name: tMOBILE }).click()
    if (dMOBILE) {
      if (dALLOWED_PLATFORMS) {
        if (dIOS) {
          I.findByRole('checkbox', { name: tIOS }).check()
        } else {
          I.findByRole('checkbox', { name: tIOS }).uncheck()
        }
        if (dANDROID) {
          I.findByRole('checkbox', { name: tANDROID }).check()
        } else {
          I.findByRole('checkbox', { name: tANDROID }).uncheck()
        }
      }
      I.findByRole('textbox', { name: tSUBJECT }).fillField(dSUBJECT)
      I.findByRole('textbox', { name: tBODY }).fillField(dBODY)
    } else {
      I.findByRole('checkbox', { name: tIOS }).uncheck()
      I.findByRole('checkbox', { name: tANDROID }).uncheck()
    }

    I.findByRole('button', { name: tGATEWAY_DESKTOP }).click()
    if (dGATEWAY_DESKTOP) {
      if (dALLOWED_PLATFORMS) {
        if (dWINDOWS) {
          I.findByRole('checkbox', { name: tWINDOWS }).check()
        } else {
          I.findByRole('checkbox', { name: tWINDOWS }).uncheck()
        }
        if (dMAC) {
          I.findByRole('checkbox', { name: tMAC }).check()
        } else {
          I.findByRole('checkbox', { name: tMAC }).uncheck()
        }
      }
      I.findByRole('textbox', { name: tSUBJECT }).fillField(dSUBJECT)
      I.findByRole('textbox', { name: tBODY }).fillField(dBODY)
    } else {
      I.findByRole('checkbox', { name: tWINDOWS }).uncheck()
      I.findByRole('checkbox', { name: tMAC }).uncheck()
    }
  },

  modifyEnrollmentPolicyEmailOptions(policyName: unknown) {
    const tSUBJECT = I.translate('platform/common:activationProfile.form.subject')
    const tBODY = I.translate('platform/common:activationProfile.form.message')
    const tMOBILE = I.translate('platform/common:activationProfile.form.mobileTab')
    const tGATEWAY_DESKTOP = I.translate('platform/common:activationProfile.form.gatewayTab')

    const dSUBJECT = policyName[0].welcomeEmail[0].subject
    const dBODY = policyName[0].welcomeEmail[0].emailBody
    I.findByRole('button', { name: tMOBILE }).click()
    I.findByRole('textbox', { name: tSUBJECT }).fillField(dSUBJECT)
    I.findByRole('textbox', { name: tBODY }).fillField(dBODY)

    I.findByRole('button', { name: tGATEWAY_DESKTOP }).click()
    I.findByRole('textbox', { name: tSUBJECT }).fillField(dSUBJECT)
    I.findByRole('textbox', { name: tBODY }).fillField(dBODY)
  },
}
