import { i18n, I18nFormats } from '@ues-behaviour/shared-e2e'
import { FeatureName } from '@ues-data/shared-types'
import { mobileAlertSummariesMock, mobileDevicesWithAlertsMock } from '@ues-mtd/alert-mocks'
import { GroupBy, MobileThreatEventState, MobileThreatEventType, QueryStringParamKeys } from '@ues-mtd/alert-types'

const notExist = 'not.exist'
const exist = 'exist'

let filterIcon: string
let eventTypes: Map<any, string>
let eventState: Map<any, string>
let datePickerFromLabel: string
let datePickerToLabel: string
let datePickerApplyButtonLabel: string
let columnNameType: string
let columnNameStatus: string
let columnNameName: string
let columnNameUser: string
let columnNameDevice: string
let columnNameDetected: string
let columnNameDetectionTime: string
let columnNameDescription: string
let noData: string

const textFilterOptions = ['daffy', 'mickey', 'minnie']

let fromDate = ''
let toDate = ''

const escape = () => {
  // eslint-disable-next-line no-restricted-globals
  cy.get('body').type('{esc}')
}

const verifyMissingTypes = (...types: MobileThreatEventType[]) => {
  I.findByRoleOptionsWithin('columnheader', { name: new RegExp(columnNameType, 'i') }, 'button', { name: filterIcon }).click()
  Object.keys(MobileThreatEventType)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      if (types.includes(MobileThreatEventType[key])) {
        getNoMenuItem(eventTypes[key])
      } else {
        getMenuItem(eventTypes[key]).should(exist)
      }
    })
}

const testTypeFilter = (groupBy: GroupBy) => {
  I.say('testTypeFilter: ', groupBy)
  I.findByRoleOptionsWithin('columnheader', { name: new RegExp(columnNameType, 'i') }, 'button', { name: filterIcon }).click()
  const payload = getDefaultPayload(groupBy)
  payload.variables.filter[QueryStringParamKeys.TYPE] = []
  Object.keys(MobileThreatEventType)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      payload.variables.filter[QueryStringParamKeys.TYPE].push(MobileThreatEventType[key])
      getMenuItem(eventTypes[key]).click()
      validate(payload)
    })
  Object.keys(MobileThreatEventType)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      payload.variables.filter[QueryStringParamKeys.TYPE] = payload.variables.filter[QueryStringParamKeys.TYPE].filter(
        value => value !== MobileThreatEventType[key],
      )
      getMenuItem(eventTypes[key]).click()
      if (payload.variables.filter[QueryStringParamKeys.TYPE]?.length === 0) {
        delete payload.variables.filter[QueryStringParamKeys.TYPE]
      }
      validate(payload)
    })
  escape()
}

const testStateFilter = (groupBy: GroupBy) => {
  I.say('testStateFilter: ', groupBy)
  I.findByRoleOptionsWithin('columnheader', { name: new RegExp(columnNameStatus, 'i') }, 'button', { name: filterIcon }).click()
  const payload = getDefaultPayload(groupBy)
  Object.keys(MobileThreatEventState)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      if (MobileThreatEventState[key] !== MobileThreatEventState.NEW) {
        payload.variables.filter[QueryStringParamKeys.STATUS].push(MobileThreatEventState[key])
        getMenuItem(eventState[key]).click()
        validate(payload)
      }
    })
  // now remove each status
  Object.keys(MobileThreatEventState)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      payload.variables.filter.status = payload.variables.filter.status.filter(value => value !== MobileThreatEventState[key])
      getMenuItem(eventState[key]).click()
      if (payload.variables.filter[QueryStringParamKeys.STATUS]?.length === 0) {
        delete payload.variables.filter[QueryStringParamKeys.STATUS]
      }
      validate(payload)
    })
  escape()
}

const testNameFilter = (groupBy: GroupBy) => {
  I.say('testNameFilter: ', groupBy)
  const payload = getDefaultPayload(groupBy)
  textFilterOptions.forEach(item => {
    payload.variables.filter[QueryStringParamKeys.NAME] = item
    I.findByRoleOptionsWithin('columnheader', { name: new RegExp(columnNameName, 'i') }, 'button', { name: filterIcon }).click()
    I.findByRoleWithin('presentation', 'textbox').clear().type(item).type('{enter}')
    validate(payload)
  })

  // Now remove the filter
  I.findByRoleOptionsWithin('columnheader', { name: new RegExp(columnNameName, 'i') }, 'button', { name: filterIcon }).click()
  I.findByRoleWithin('presentation', 'textbox').clear().type('{enter}')
  delete payload.variables.filter[QueryStringParamKeys.NAME]
  validate(payload)
}

const testUserNameFilter = (groupBy: GroupBy) => {
  I.say('testUserNameFilter: ', groupBy)

  const payload = getDefaultPayload(groupBy)
  textFilterOptions.forEach(item => {
    payload.variables.filter['userName'] = item
    I.findByRoleOptionsWithin('columnheader', { name: new RegExp(columnNameUser, 'i') }, 'button', { name: filterIcon }).click()
    I.findByRoleWithin('presentation', 'textbox').clear().type(item).type('{enter}')
    validate(payload)
  })

  // Now remove the filter
  delete payload.variables.filter['userName']
  I.findByRoleOptionsWithin('columnheader', { name: new RegExp(columnNameUser, 'i') }, 'button', { name: filterIcon }).click()
  I.findByRoleWithin('presentation', 'textbox').clear().type('{enter}')
  validate(payload)
}

const testDeviceNameFilter = (groupBy: GroupBy) => {
  I.say('testDeviceNameFilter: ', groupBy)
  const payload = getDefaultPayload(groupBy)
  textFilterOptions.forEach(item => {
    payload.variables.filter[QueryStringParamKeys.DEVICE_NAME] = item
    I.findByRoleOptionsWithin('columnheader', { name: new RegExp(columnNameDevice, 'i') }, 'button', { name: filterIcon }).click()

    I.findByRoleWithin('presentation', 'textbox').clear().type(item).type('{enter}')
    validate(payload)
  })
  // Now remove the filter
  delete payload.variables.filter[QueryStringParamKeys.DEVICE_NAME]
  I.findByRoleOptionsWithin('columnheader', { name: new RegExp(columnNameDevice, 'i') }, 'button', { name: filterIcon }).click()
  I.findByRoleWithin('presentation', 'textbox').clear().type('{enter}')
  validate(payload)
}

const loadDetectedFilter = (groupBy: GroupBy) => {
  const filterCol = groupBy === GroupBy.none ? new RegExp(columnNameDetected, 'i') : new RegExp(columnNameDetectionTime, 'i')
  I.say('testDetectedFilter: ', groupBy)
  I.findByRoleOptionsWithin('columnheader', { name: filterCol }, 'button', { name: filterIcon }).click()

  const payload = getDefaultPayload(groupBy)
  I.findByRoleOptionsWithin('generic', { name: datePickerFromLabel }, 'textbox').clear().type(fromDate)
  payload.variables.filter[QueryStringParamKeys.DETECTED_START] = fromDate
  I.findByRoleOptionsWithin('generic', { name: datePickerToLabel }, 'textbox').clear().type(toDate)
  payload.variables.filter[QueryStringParamKeys.DETECTED_END] = toDate

  I.findByRole('button', { name: datePickerApplyButtonLabel }).click()
  return payload
}

const testDetectedFilter = (groupBy: GroupBy) => {
  const payload = loadDetectedFilter(groupBy)
  validate(payload)

  I.reload(true) // This prevents next testcase from failing
}

const loadStrings = () => {
  return I.loadI18nNamespaces('mtd/common', 'tables', 'formats').then(() => {
    fromDate = i18n.format(new Date('05/01/2021 10:47:00Z'), I18nFormats.DateTimeShort)
    toDate = i18n.format(new Date('05/21/2021 10:48:00Z'), I18nFormats.DateTimeShort)

    eventTypes = new Map<MobileThreatEventType, string>()
    Object.keys(MobileThreatEventType)
      .filter(key => isNaN(Number(key)))
      .forEach(key => {
        eventTypes[key] = I.translate(`mtd/common:threats.${MobileThreatEventType[key]}`)
      })
    eventState = new Map<MobileThreatEventState, string>()
    Object.keys(MobileThreatEventState)
      .filter(key => isNaN(Number(key)))
      .forEach(key => {
        eventState[key] = I.translate(`mtd/common:threatStatus.${MobileThreatEventState[key]}`)
      })
    columnNameType = I.translate('mtd/common:mobileAlert.list.columns.type')
    columnNameStatus = I.translate('mtd/common:mobileAlert.list.columns.status')
    columnNameName = I.translate('mtd/common:mobileAlert.list.columns.name')
    columnNameUser = I.translate('mtd/common:mobileAlert.list.columns.user')
    columnNameDevice = I.translate('mtd/common:mobileAlert.list.columns.device')
    columnNameDetected = I.translate('mtd/common:mobileAlert.list.columns.detected')
    columnNameDetectionTime = I.translate('mtd/common:mobileAlert.list.columns.detection')
    columnNameDescription = I.translate('mtd/common:mobileAlert.list.columns.description')
    noData = I.translate('mtd/common:mobileAlert.list.noData')

    filterIcon = I.translate('tables:filterIcon')
    datePickerFromLabel = I.translate('tables:from')
    datePickerToLabel = I.translate('tables:to')
    datePickerApplyButtonLabel = I.translate('tables:apply')
  })
}

const setLocalStorageState = () => {
  window.localStorage.setItem('UES_DATA_MOCK', 'true')
  window.localStorage.setItem(FeatureName.UESCronosNavigation, 'true')
  window.localStorage.setItem(FeatureName.MobileThreatDetectionUnsafeMsgThreat, 'true')
  window.localStorage.setItem(FeatureName.MobileThreatDetectionRestrictedAppThreat, 'true')
  window.localStorage.setItem(FeatureName.MobileThreatDetectionUnresponsiveAgentThreat, 'true')
  window.localStorage.setItem(FeatureName.MobileThreatDetectionDeveloperModeThreat, 'true')
}

const getMenuItem = (name: string) => {
  return I.findByRole('menuitem', { name: name })
}

const getNoMenuItem = (name: string) => {
  return I.findByRole('menuitem', { name: name }).should(notExist)
}

const copyItem = itemToCopy => {
  return JSON.parse(JSON.stringify(itemToCopy))
}

const validate = payloadToVerify => {
  // make local copy of payload to validate as wait is performed aysnchronously
  const payload = copyItem(payloadToVerify)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  I.wait('@alertQuery', { requestTimeout: 30000 })
    .its('request.body')
    .then(body => {
      try {
        console.log(`comparing: ${JSON.stringify(body)}, ${JSON.stringify(payload)}`)
        expect(body?.variables.filter?.type?.sort()).to.deep.equals(payload?.variables.filter?.type?.sort())
        expect(body?.variables.filter?.status?.sort()).to.deep.equals(payload?.variables.filter?.status?.sort())
        expect(normalize(body.variables.filter.detectedStart)).to.equals(normalize(payload?.variables.filter?.detectedStart))
        expect(normalize(body.variables.filter.detectedEnd)).to.equals(normalize(payload?.variables.filter?.detectedEnd))
        expect(body?.variables.filter?.description).to.equals(payload?.variables.filter?.description)
        expect(body?.variables.filter?.deviceName).to.equals(payload?.variables.filter?.deviceName)
        expect(body?.variables.filter?.name).to.equals(payload?.variables.filter?.name)
        expect(body?.variables.filter?.userName).to.equals(payload?.variables.filter?.userName)
        expect(body?.variables.filter?.endpointId).to.equals(payload?.variables.filter?.endpointId)
      } catch (error) {
        console.log(
          `validate payload failed attempting retry: \n body: ${JSON.stringify(
            body?.variables.filter,
          )}, \n payload: ${JSON.stringify(payload?.variables.filter)}`,
        )
        validate(payload) // recursive call
      }
    })
}

const normalize = (dateTimeString: string): string => {
  return i18n.format(new Date(dateTimeString), I18nFormats.DateTimeShort)
}

const getDefaultPayload = (groupBy: GroupBy) => {
  switch (groupBy) {
    case GroupBy.none:
      return {
        variables: {
          filter: {
            status: [`${MobileThreatEventState.NEW}`],
          },
        },
      }
    case GroupBy.detection:
    case GroupBy.device:
      return {
        variables: {
          filter: {},
        },
      }
  }
}

const addQuery = (parm: QueryStringParamKeys, value: string, url: string, payload): string => {
  payload.variables.filter[parm] = value
  return url.concat(`&${parm}=${value}`)
}

const addQueryDetected = (url: string, payload): string => {
  const newUrl = addQuery(QueryStringParamKeys.DETECTED_START, fromDate, url, payload)
  return addQuery(QueryStringParamKeys.DETECTED_END, toDate, newUrl, payload)
}

const addQueryAllTypes = (url: string, payload): string => {
  payload.variables.filter[QueryStringParamKeys.TYPE] = []
  let newUrl = url.concat(`&${QueryStringParamKeys.TYPE}=`)
  Object.keys(MobileThreatEventType)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      payload.variables.filter[QueryStringParamKeys.TYPE].push(MobileThreatEventType[key])
      newUrl = newUrl.concat(`${MobileThreatEventType[key]},`)
    })
  return newUrl
}

const addQueryAllStatus = (url: string, payload): string => {
  payload.variables.filter[QueryStringParamKeys.STATUS] = []
  let newUrl = url.concat(`&${QueryStringParamKeys.STATUS}=`)
  Object.keys(MobileThreatEventState)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      payload.variables.filter[QueryStringParamKeys.STATUS].push(MobileThreatEventState[key])
      newUrl = newUrl.concat(`${MobileThreatEventState[key]},`)
    })
  return newUrl
}

//--TODO: resolve "Max depth exceeded" error and un-skip these tests
describe.skip('testing GroupBy.none', () => {
  beforeEach(() => {
    setLocalStorageState()
    window.localStorage.setItem('UES.MockOverride.mobileAlertsMock.Enabled', 'true')

    I.intercept(
      {
        method: 'POST',
        pathname: '/**/api/mtd/v1/bff/threat-events/graphql',
      },
      {
        statusCode: 200,
        body: `{ "data": { } }`,
      },
    ).as('alertQuery')
    loadStrings().then(() => {
      I.visit(`#/mobile-alerts?${QueryStringParamKeys.GROUP_BY}=${GroupBy.none}`)
    })
  })
  it('testing no data', () => {
    I.findByRole('grid').contains(noData)
  })
  it('testing type filter', () => {
    testTypeFilter(GroupBy.none)
  })
  it('testing state filter', () => {
    testStateFilter(GroupBy.none)
  })
  it('testing name filter', () => {
    testNameFilter(GroupBy.none)
  })
  it('testing description filter', () => {
    const payload = getDefaultPayload(GroupBy.none)
    textFilterOptions.forEach(item => {
      payload.variables.filter['description'] = item
      I.findByRoleOptionsWithin('columnheader', { name: new RegExp(columnNameDescription, 'i') }, 'button', {
        name: filterIcon,
      }).click()
      I.findByRoleWithin('presentation', 'textbox').clear().type(item).type('{enter}')
      validate(payload)
    })

    // Now remove the filter
    delete payload.variables.filter['description']
    I.findByRoleOptionsWithin('columnheader', { name: new RegExp(columnNameDescription, 'i') }, 'button', {
      name: filterIcon,
    }).click()
    I.findByRoleWithin('presentation', 'textbox').clear().type('{enter}')
    validate(payload)
  })
  it('testing user name filter', () => {
    testUserNameFilter(GroupBy.none)
  })
  it('testing device name filter', () => {
    testDeviceNameFilter(GroupBy.none)
  })
  it.skip('testing detected filter', () => {
    testDetectedFilter(GroupBy.none)
  })
})
describe.skip('testing GroupBy.none features', () => {
  beforeEach(() => {
    setLocalStorageState()
    window.localStorage.setItem(FeatureName.MobileThreatDetectionUnsafeMsgThreat, 'false')
    window.localStorage.setItem(FeatureName.MobileThreatDetectionUnresponsiveAgentThreat, 'false')
    window.localStorage.setItem(FeatureName.MobileThreatDetectionRestrictedAppThreat, 'false')
    window.localStorage.setItem(FeatureName.MobileThreatDetectionDeveloperModeThreat, 'false')
    loadStrings().then(() => {
      I.visit(`#/mobile-alerts?${QueryStringParamKeys.GROUP_BY}=${GroupBy.none}`)
    })
  })
  it('testing UNSAFE_MESSAGE=UNRESPONSIVE_AGENT=RESTRICTED_APP=false', () => {
    verifyMissingTypes(
      MobileThreatEventType.UNSAFE_MESSAGE,
      MobileThreatEventType.UNRESPONSIVE_AGENT,
      MobileThreatEventType.RESTRICTED_APP,
      MobileThreatEventType.DEVELOPER_MODE,
    )
  })
})
describe.skip('testing GroupBy.detection features', () => {
  beforeEach(() => {
    loadStrings()
    setLocalStorageState()
    window.localStorage.setItem(FeatureName.MobileThreatDetectionUnsafeMsgThreat, 'false')
    window.localStorage.setItem(FeatureName.MobileThreatDetectionUnresponsiveAgentThreat, 'false')
    window.localStorage.setItem(FeatureName.MobileThreatDetectionRestrictedAppThreat, 'false')
    window.localStorage.setItem(FeatureName.MobileThreatDetectionDeveloperModeThreat, 'false')
    I.visit(`#/mobile-alerts?${QueryStringParamKeys.GROUP_BY}=${GroupBy.detection}`)
  })
  it('testing UNSAFE_MESSAGE=UNRESPONSIVE_AGENT=RESTRICTED_APP=false', () => {
    verifyMissingTypes(
      MobileThreatEventType.UNSAFE_MESSAGE,
      MobileThreatEventType.UNRESPONSIVE_AGENT,
      MobileThreatEventType.RESTRICTED_APP,
      MobileThreatEventType.DEVELOPER_MODE,
    )
  })
})
describe.skip('testing GroupBy.detection', () => {
  beforeEach(() => {
    setLocalStorageState()
    window.localStorage.setItem('UES.MockOverride.mobileAlertSummariesMock.Enabled', 'true')

    I.intercept(
      {
        method: 'POST',
        pathname: '/**/api/mtd/v1/bff/threat-events/graphql',
      },
      {
        statusCode: 200,
        body: `{ "data": { } }`,
      },
    ).as('alertQuery')
    loadStrings().then(() => {
      I.visit(`#/mobile-alerts?${QueryStringParamKeys.GROUP_BY}=${GroupBy.detection}`)
    })
  })
  it('testing no data', () => {
    I.findByRole('grid').contains(noData)
  })
  it('testing name filters', () => {
    testNameFilter(GroupBy.detection)
  })
  it('testing type filters', () => {
    testTypeFilter(GroupBy.detection)
  })
  it.skip('testing detected filters', () => {
    testDetectedFilter(GroupBy.detection)
  })
})
describe.skip('testing GroupBy.device', () => {
  beforeEach(() => {
    setLocalStorageState()
    window.localStorage.setItem('UES.MockOverride.mobileDevicesWithAlertsMock.Enabled', 'true')
    I.intercept(
      {
        method: 'POST',
        pathname: '/**/api/mtd/v1/bff/threat-events/graphql',
      },
      {
        statusCode: 200,
        body: `{ "data": { } }`,
      },
    ).as('alertQuery')
    loadStrings().then(() => {
      I.visit('#/mobile-alerts?groupBy=device')
    })
  })
  it('testing no data', () => {
    I.findByRole('grid').contains(noData)
  })
  it('testing device name filters', () => {
    testDeviceNameFilter(GroupBy.device)
  })
  it('testing user name filters', () => {
    testUserNameFilter(GroupBy.device)
  })
  it.skip('testing detected filters', () => {
    testDetectedFilter(GroupBy.device)
  })
})
describe.skip('testing GroupBy.device', () => {
  it('testing query string parameters', () => {
    setLocalStorageState()
    window.localStorage.setItem('UES.MockOverride.mobileDevicesWithAlertsMock.Enabled', 'true')
    I.intercept(
      {
        method: 'POST',
        pathname: '/**/api/mtd/v1/bff/threat-events/graphql',
      },
      {
        statusCode: 200,
        body: `{ "data": { } }`,
      },
    ).as('alertQuery')
    loadStrings().then(() => {
      const payload = getDefaultPayload(GroupBy.device)
      let url = `#/mobile-alerts?${QueryStringParamKeys.GROUP_BY}=${GroupBy.device}`
      url = addQuery(QueryStringParamKeys.DEVICE_NAME, 'testDeviceName', url, payload)
      url = addQuery(QueryStringParamKeys.USER_NAME, 'testUserName', url, payload)
      url = addQueryDetected(url, payload)
      I.visit(url)
      validate(payload)
    })
  })
})
describe.skip('testing GroupBy.detection', () => {
  it('testing query string parameters', () => {
    setLocalStorageState()
    window.localStorage.setItem('UES.MockOverride.mobileAlertSummariesMock.Enabled', 'true')
    I.intercept(
      {
        method: 'POST',
        pathname: '/**/api/mtd/v1/bff/threat-events/graphql',
      },
      {
        statusCode: 200,
        body: `{ "data": { } }`,
      },
    ).as('alertQuery')
    loadStrings().then(() => {
      const payload = getDefaultPayload(GroupBy.detection)
      let url = `#/mobile-alerts?${QueryStringParamKeys.GROUP_BY}=${GroupBy.detection}`
      url = addQuery(QueryStringParamKeys.NAME, 'testName', url, payload)
      url = addQueryDetected(url, payload)
      url = addQueryAllTypes(url, payload)
      I.visit(url)
      validate(payload)
    })
  })
})
describe.skip('testing click through', () => {
  beforeEach(() => {
    loadStrings()
    setLocalStorageState()
    window.localStorage.setItem('UES.MockOverride.mobileAlertsMock.Enabled', 'true')
    I.intercept(
      {
        method: 'POST',
        pathname: '/**/api/mtd/v1/bff/threat-events/graphql',
      },
      {
        statusCode: 200,
        body: `{ "data": { } }`,
      },
    ).as('alertQuery')
  })
  it('testing GroupBy.detection click through', () => {
    const payload = getDefaultPayload(GroupBy.detection)
    const url = `#/mobile-alerts?${QueryStringParamKeys.GROUP_BY}=${GroupBy.detection}`

    I.visit(url).then(() => {
      payload.variables.filter[QueryStringParamKeys.NAME] = mobileAlertSummariesMock.mobileAlertSummaries.elements[0].name
      payload.variables.filter[QueryStringParamKeys.TYPE] = [mobileAlertSummariesMock.mobileAlertSummaries.elements[0].type]
      payload.variables.filter[QueryStringParamKeys.DETECTED_START] =
        mobileAlertSummariesMock.mobileAlertSummaries.elements[0].firstDetected
      payload.variables.filter[QueryStringParamKeys.DETECTED_END] =
        mobileAlertSummariesMock.mobileAlertSummaries.elements[0].lastDetected
      I.findByRole('link', { name: mobileAlertSummariesMock.mobileAlertSummaries.elements[0].threatCount })
        .click()
        .then(() => {
          validate(payload)
        })
    })
  })
  it('testing GroupBy.device click through', () => {
    const url = `#/mobile-alerts?${QueryStringParamKeys.GROUP_BY}=${GroupBy.device}`
    I.visit(url).then(() => {
      const payload = loadDetectedFilter(GroupBy.device)
      payload.variables.filter[QueryStringParamKeys.ENDPOINT_ID] =
        mobileDevicesWithAlertsMock.mobileDevicesWithAlerts.elements[0].endpointIds[0]
      // verify link 1 exists as this element has a valid endpointIds array in mock data
      I.findByRole('link', { name: '1' }).should(exist)
      // verify link 3 does not exist as this element has no endpointIds array in mock data
      I.findByRole('link', { name: '3' }).should(notExist)
      I.findByRole('link', { name: mobileAlertSummariesMock.mobileAlertSummaries.elements[0].threatCount })
        .click()
        .then(() => {
          I.url()
            .should('contain', mobileDevicesWithAlertsMock.mobileDevicesWithAlerts.elements[0].endpointIds[0])
            .then(() => {
              //validate(payload)
            })
        })
    })
  })
})
describe.skip('testing GroupBy.none', () => {
  it('testing query string parameters', () => {
    setLocalStorageState()
    window.localStorage.setItem('UES.MockOverride.mobileAlertsMock.Enabled', 'true')
    I.intercept(
      {
        method: 'POST',
        pathname: '/**/api/mtd/v1/bff/threat-events/graphql',
      },
      {
        statusCode: 200,
        body: `{ "data": { } }`,
      },
    ).as('alertQuery')
    loadStrings().then(() => {
      const payload = getDefaultPayload(GroupBy.none)
      let url = `#/mobile-alerts?${QueryStringParamKeys.GROUP_BY}=${GroupBy.none}`
      url = addQuery(QueryStringParamKeys.USER_NAME, 'testUserName', url, payload)
      url = addQuery(QueryStringParamKeys.DEVICE_NAME, 'testDeviceName', url, payload)
      url = addQuery(QueryStringParamKeys.NAME, 'testName', url, payload)
      url = addQuery(QueryStringParamKeys.DESCRIPTION, 'testDescription', url, payload)
      url = addQueryDetected(url, payload)
      url = addQueryAllTypes(url, payload)
      url = addQueryAllStatus(url, payload)
      I.visit(url)
      validate(payload)
    })
  })
})
