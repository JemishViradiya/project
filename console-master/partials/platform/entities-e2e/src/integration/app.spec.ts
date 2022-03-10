import i18n from 'i18next'

import { I18nFormats } from '@ues-behaviour/shared-e2e'
import { DeviceAssessmentQueryMock } from '@ues-data/bis/mocks'
import { nonCompliantMock } from '@ues-data/mtd/mocks'
import { devicesMock, mockEndpointGuids, usersMock } from '@ues-data/platform/mocks'
import type { ActorDetectionType } from '@ues-data/shared-types'
import { Permission } from '@ues-data/shared-types'
import { MobileThreatEventType } from '@ues-mtd/alert-types'

const baseUrl = '#/mobile-devices/'

const setLocalStorageState = () => {
  window.localStorage.setItem('UES_DATA_MOCK', 'true')
  window.localStorage.setItem('UES.MTD.enabled', 'true')
  window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
  window.localStorage.setItem('ues.permission.checks.enabled', 'false')
  window.localStorage.setItem('ues.action.orchestrator.enabled', 'true')
}

const getDeviceCard = () => {
  return I.findByRole('heading', { name: I.translate('endpoint.details.title').trim() })
}

const formatDateTimeString = datetime => {
  return i18n.format(datetime, I18nFormats.DateTime)
}
const formatDateTimeUTCString = datetime => {
  return i18n.format(datetime, I18nFormats.DateTimeUTC)
}

enum TRANSLATIONS_PATHS {
  BIS = 'bis/ues:detectionPolicies.threats.labels',
  MTD = 'mtd/common:threats',
}

const MTD_DETECTION_TYPE_TRANSLATION_KEY_MAP: Partial<Record<ActorDetectionType, string>> = {
  encryptionDisabled: MobileThreatEventType.DEVICE_ENCRYPTION,
  hardwareAttestationFailed: MobileThreatEventType.ANDROID_HW_FAILURE,
  insecuredNetworkDetected: MobileThreatEventType.COMPROMISED_NETWORK,
  insecuredWifiDetected: MobileThreatEventType.INSECURE_WIFI,
  iosIntegrityFailure: MobileThreatEventType.IOS_INTEGRITY_FAILURE,
  maliciousAppDetected: MobileThreatEventType.MALICIOUS_APP,
  privilegeEscalationDetected: MobileThreatEventType.JAILBROKEN_ROOTED,
  restrictedAppDetected: MobileThreatEventType.RESTRICTED_APP,
  safetyNetAttestationFailed: MobileThreatEventType.ANDROID_SAFETYNET_FAILURE,
  screenLockDisabled: MobileThreatEventType.DEVICE_SCREENLOCK,
  sideLoadedAppDetected: MobileThreatEventType.SIDELOADED_APP,
  unsafeMessageDetected: MobileThreatEventType.UNSAFE_MESSAGE,
  unsupportedDeviceModelDetected: MobileThreatEventType.UNSUPPORTED_MODEL,
  unsupportedDeviceOSDetected: MobileThreatEventType.UNSUPPORTED_OS,
  unsupportedSecurityPatchDetected: MobileThreatEventType.UNSUPPORTED_SECURITY_PATCH,
}

const getPlatformOSVersionString = deviceInfo => {
  const deviceOsVersionString = deviceInfo.osVersion ? deviceInfo.osVersion : ''
  const platformString = deviceInfo.platform ? deviceInfo.platform : ''
  return deviceOsVersionString.startsWith(`${platformString} `)
    ? deviceOsVersionString
    : `${platformString} ${deviceOsVersionString}`
}

const getAgentAndVersionString = endpointData => {
  const agentString = I.translate('endpoint.details.agentBundleId.' + endpointData.appBundleId.replace(/\./g, '_'))
  return `${agentString} ${endpointData.appVersion}`
}

let mtdResponseActionStatusHeading: string
let mtdStatusCompliant: string
let mtdStatusNonCompliant: string
let mtdPolicyHeading: string
let mtdCompliantDescription: string
let mtdNonCompliantDescription: string
let threatComplianceTableHeaderDetection: string
let threatMaliciousApplication: string
let threatJailbrokenOrRooted: string
let threatUnsupportedOS: string
let noNotificationConfigured: string
let noAccessMessageString: string

const loadStrings = () => {
  I.loadI18nNamespaces('mtd/common').then(() => {
    mtdResponseActionStatusHeading = I.translate('responseActions.status')
    mtdStatusCompliant = I.translate('responseActions.compliant')
    mtdStatusNonCompliant = I.translate('responseActions.nonCompliant')
    mtdPolicyHeading = I.translate('responseActions.policy')
    mtdCompliantDescription = I.translate('responseActions.body.compliant')
    mtdNonCompliantDescription = I.translate('responseActions.body.nonCompliant')
    threatComplianceTableHeaderDetection = I.translate('responseActions.threatCompliance.tableHeaders.detection')
    threatMaliciousApplication = I.translate('threats.maliciousApplication')
    threatJailbrokenOrRooted = I.translate('threats.jailbrokenOrRooted')
    threatUnsupportedOS = I.translate('threats.unsupportedOS')
    noNotificationConfigured = I.translate('responseActions.threatCompliance.notification.notConfigured')
  })
  I.loadI18nNamespaces('access').then(() => {
    noAccessMessageString = I.translate('access:errors.notFound.title')
  })
  I.loadI18nNamespaces('bis/ues', 'bis/shared')
}
export type PermissionValue = {
  permission: Permission
  grant: boolean
}

describe('Device Details Test Cases', () => {
  before(() => {
    window.localStorage.clear()
    setLocalStorageState()
    loadStrings()
    I.loadI18nNamespaces('platform/endpoints')
  })

  const verfiyRiskDetails = (deviceRiskEntry, isVisible) => {
    const existanceString = isVisible ? 'exist' : 'not.exist'
    // now applied risk policy should exist
    I.findAllByText(
      I.translate('bis/ues:deviceRiskAssessment.appliedRiskPolicy', { riskPolicyName: deviceRiskEntry.policyName }) as string,
    ).should(existanceString)
    I.findAllByText(formatDateTimeUTCString(deviceRiskEntry.detectionTime)).should(existanceString)
    if (!isVisible) {
      I.findAllByRole('listitem').should(existanceString)
      return
    }
    let detectionIndex = 0
    deviceRiskEntry.detections?.forEach(detection => {
      const detectionLocalString = MTD_DETECTION_TYPE_TRANSLATION_KEY_MAP[detection.name]
        ? I.translate(`mtd/common:threats.${MTD_DETECTION_TYPE_TRANSLATION_KEY_MAP[detection.name]}`)
        : I.translate(`${TRANSLATIONS_PATHS.BIS}.${detection.name}`)
      I.findAllByRole('listitem')
        .should(existanceString)
        .each((listItem, index) => {
          if (detectionIndex === index) {
            I.wrap(listItem).findByText(detectionLocalString).should(existanceString)
          }
        })
      detectionIndex++
    })
  }
  // internal method that for testing top left information of the endpoint
  const testEndpointTopLeftInfo = (endpointGuid, isCheckPermission = false, isCheckDeviceRiskLevel = false) => {
    const overridePermissionsObj = {}
    if (isCheckPermission) {
      window.localStorage.setItem('ues.permission.checks.enabled', 'true')
    } else {
      window.localStorage.setItem('ues.permission.checks.enabled', 'false')
    }
    I.visit(baseUrl + endpointGuid)
    overridePermissionsObj[Permission.ECS_DEVICES_READ] = true
    I.overridePermissions({ ...overridePermissionsObj })

    I.findByText(noAccessMessageString).should('not.exist')
    const endpointMockEntry = devicesMock.elements.find(entry => entry.guid === endpointGuid)
    getDeviceCard().within(() => {
      const userMockEntry = usersMock.elements.find(entry => entry.id === endpointMockEntry.userId)

      if (endpointMockEntry.deviceInfo?.deviceModelName) {
        I.findByText(endpointMockEntry.deviceInfo.deviceModelName).should('exist')
      }
      if (endpointMockEntry.deviceInfo && endpointMockEntry.deviceInfo.osVersion) {
        I.findByText(getPlatformOSVersionString(endpointMockEntry.deviceInfo)).should('exist')
      }

      const agentVersionString = getAgentAndVersionString(endpointMockEntry)
      I.findByText(userMockEntry.displayName).should('exist')
      // extra info should not be visible
      I.findByText(agentVersionString).should('not.exist')
      I.findByText(I.translate('endpoint.details.securityPatch')).should('not.exist')
      I.findByText(I.translate('endpoint.details.enrollment')).should('not.exist')
      I.findByText(formatDateTimeString(endpointMockEntry.created)).should('not.exist')
      I.findByText(formatDateTimeString(endpointMockEntry.modified)).should('not.exist')

      // click on the button to show more device details
      I.findByRole('button', { name: I.translate('endpoint.details.button.more') })
        .should('exist')
        .click()

      // the extra information should now be visible
      I.findByText(I.translate('endpoint.details.enrollment')).should('exist')
      if (endpointMockEntry.deviceInfo?.platform?.toLowerCase() === 'android') {
        I.findByText(I.translate('endpoint.details.securityPatch')).should('exist')
        if (endpointMockEntry.deviceInfo?.securityPatch) {
          I.findByText(endpointMockEntry.deviceInfo.securityPatch).should('exist')
        }
      } else {
        I.findByText(I.translate('endpoint.details.securityPatch')).should('not.exist')
      }

      I.findByText(agentVersionString).should('exist')
      I.findByText(formatDateTimeString(endpointMockEntry.created)).should('exist')
    })
    if (isCheckDeviceRiskLevel && endpointMockEntry.deviceInfo?.deviceId != null) {
      const deviceRisks = DeviceAssessmentQueryMock.items
        .filter(deviceRiskEntry => deviceRiskEntry.deviceId === endpointMockEntry.deviceInfo.deviceId)
        .map(deviceRiskEntry => deviceRiskEntry)
      if (deviceRisks.length > 0) {
        const deviceRiskEntry = deviceRisks[0]

        getDeviceCard().within(() => {
          I.findByText(I.translate(`bis/shared:risk.level.${deviceRiskEntry.riskLevel}`)).should('exist')
        })

        verfiyRiskDetails(deviceRiskEntry, false)

        I.findAllByRole('button', {
          name: I.translate('bis/ues:deviceRiskAssessment.deviceRiskDetails'),
        })
          .should('exist')
          .click()

        verfiyRiskDetails(deviceRiskEntry, true)
      }
    }
    if (isCheckPermission) {
      // set read permission to false, and the device card should not exist
      overridePermissionsObj[Permission.ECS_DEVICES_READ] = false

      I.overridePermissions({ ...overridePermissionsObj })

      // and the access denied permission should exist
      I.findByText(noAccessMessageString).should('exist')

      getDeviceCard().should('not.exist')
    }
  }
  it('Test device info and device risk - Iphone', () => {
    testEndpointTopLeftInfo(mockEndpointGuids.iphoneProtectGuid, false, true)
  })

  it('Test device info - Protect ', () => {
    testEndpointTopLeftInfo(mockEndpointGuids.AndroidXiaomiProtectGuid)
  })

  it('Test device info - Protect - RBAC - Read permission ', () => {
    testEndpointTopLeftInfo(mockEndpointGuids.AndroidXiaomiProtectGuid, true)
  })

  it('Test device info - BIG - Null Device Info Element', () => {
    testEndpointTopLeftInfo(mockEndpointGuids.NullDeviceInfoBigGuid)
  })

  it('Test device info - BIG - Device Info Null Attributes', () => {
    testEndpointTopLeftInfo(mockEndpointGuids.NullDeviceInfoAttribsBigGuid)
  })

  it('Test device info - BIG3 - Duplicate Windows In OsVersion', () => {
    // this is the case where the osVersion has 'Windows in it', so is duplicating the Platform of 'Windows'
    testEndpointTopLeftInfo(mockEndpointGuids.WindowsInOsVersionBigGuid)
  })

  it('Test device info - BIG3 - MacOS', () => {
    testEndpointTopLeftInfo(mockEndpointGuids.MacOSBigGuid)
  })

  const setupAndFollowLocation = endpointGuid => {
    const endpointMockEntry = devicesMock.elements.find(entry => entry.guid === endpointGuid)
    const userMockEntry = usersMock.elements.find(entry => entry.id === endpointMockEntry.userId)
    const userId = userMockEntry.id
    const encodedDeviceId = encodeURIComponent(btoa(endpointMockEntry.deviceInfo.deviceId))
    I.visit(baseUrl + endpointGuid)
    I.findByRole('tab', { name: I.translate('endpoint.details.panels.responseActions') }).click()
    I.location().should(loc => {
      expect(loc.hash).to.eq(baseUrl + `${endpointGuid}/responseActions?userId=${userId}&deviceId=${encodedDeviceId}`)
    })
    I.findByRole('heading', { name: I.translate('endpoint.responseActions.title') }).should('exist')
    I.findByRole('heading', { name: mtdResponseActionStatusHeading }).should('exist')
    I.findByRole('heading', { name: mtdPolicyHeading }).should('exist')
  }
  it('Test Response Actions for compliant device', () => {
    setupAndFollowLocation(mockEndpointGuids.AndroidXiaomiProtectGuid)

    // MTD specific - perhaps there should be way to import MTD component test
    I.findByText(mtdStatusCompliant).should('exist')
    I.findByText('Policy name 1').should('exist')
    I.findByText(mtdCompliantDescription).should('exist')

    // should not exist
    I.findByText(mtdStatusNonCompliant).should('not.exist')
    I.findByText(mtdNonCompliantDescription).should('not.exist')
    I.findByRole('columnheader', { name: threatComplianceTableHeaderDetection }).should('not.exist')
  })

  it('Test Response Actions for not compliant device', () => {
    setupAndFollowLocation(mockEndpointGuids.iphoneProtectGuid)

    let progressBarCount = 0

    nonCompliantMock.complianceList.forEach(item => {
      if (item.notifications && item.notifications.totalCount >= item.notifications.sentCount) {
        progressBarCount++
      }
    })

    // should exist
    I.findByText(mtdStatusNonCompliant).should('exist')
    I.findByText(mtdNonCompliantDescription).should('exist')
    I.findByText(nonCompliantMock.policyName).should('exist')
    I.findByRole('columnheader', { name: threatComplianceTableHeaderDetection }).should('exist')
    I.findAllByRole('progressbar').should('have.length', progressBarCount)
    // The mock data threats + 1 row for table head
    I.findAllByRole('row').should('have.length', nonCompliantMock.complianceList.length + 1)

    // Prompts are ongoing, notifications are configured properly, there is the next prompt, the action status is 'pending'
    I.findByRole('row', { name: new RegExp(threatMaliciousApplication + '.+') })
      .should('contain', 'email notifications sent:')
      .and('contain', 'Next:')
      .and('not.contain', noNotificationConfigured)
      .findByRole('progressbar')
      .should('exist')

    // Prompts are run out, notifications are configured properly, there is no the next prompt, the action status is 'taken'
    I.findByRole('row', { name: new RegExp(threatJailbrokenOrRooted + '.+') })
      .should('contain', 'email notifications sent:')
      .and('not.contain', 'Next:')
      .and('not.contain', noNotificationConfigured)
      .findByRole('progressbar')
      .should('exist')

    // Notifications aren't configured, the action status is 'taken'
    I.findByRole('row', { name: new RegExp(threatUnsupportedOS + '.+') })
      .should('not.contain', 'email notifications sent:')
      .and('not.contain', 'Next:')
      .and('contain', noNotificationConfigured)
      .findByRole('progressbar')
      .should('not.exist')

    // should not exist
    I.findByText(mtdStatusCompliant).should('not.exist')
    I.findByText(mtdCompliantDescription).should('not.exist')
  })
})
