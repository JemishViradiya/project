import type { DirectoryInstance } from '@ues-data/platform'
import { directoryInstanceMock } from '@ues-data/platform/mocks'
import { Permission } from '@ues-data/shared-types'

import { BasePage } from '../../support/pages/basePage'
import {
  getCancelButton,
  getDialog,
  getSyncTypes,
  setFullPermissions,
  setNoPermissions,
  setReadonlyPermissions,
} from '../../support/pages/directoryPage'

const directoryListUrl = '#/settings/companydirectory/'
const editDirectoryInstanceUrl = `#/companyDirectory/azure/${directoryInstanceMock[0].id}`

const MIN_LIMIT = 0
const MAX_LIMIT = 65534
const MIN_NESTING_LEVEL = -1
const MAX_NESTING_LEVEL = 65534

const MIN_INTERVAL = 15
const MAX_INTERVAL = 1440
const DEFAULT_INTERVAL_MIN = 30

const DEFAULT_TIME = '12:00 AM'

let onboardingTitle: string
let syncSettingsDescription: string
let syncSettingsOnboardingSwitchLabel: string
let syncSettingsLimitLabel: string
let syncSettingsNestingLevelLabel: string
let forceSyncSwitchLabel: string
let offboardingTitle: string
let offboardingDescription: string
let offboardingSwitchLabel: string
let offboardingProtectionSwitchLabel: string
let syncSettingsTabTitle: string
let syncScheduleTabTitle: string
let syncScheduleDescription: string
let addScheduleLabel: string
let resourceNotFoundMessage: string
let syncBetween: string
let scheduledDays: string
let scheduledDay: string
let setTime: string
let removeScheduleLabel: string
let syncTypes: Record<string, string>
let syncIterations: Record<string, string>
let weekDays: Record<string, string>

const loadStrings = () => {
  I.loadI18nNamespaces('platform/common', 'access', 'platform/validation', 'platform/time', 'components', 'general/form').then(
    () => {
      onboardingTitle = I.translate('directory.syncSettings.onboardingTitle')
      syncSettingsDescription = I.translate('directory.syncSettings.description')
      syncSettingsOnboardingSwitchLabel = I.translate('directory.syncSettings.onboarding')
      syncSettingsLimitLabel = I.translate('directory.syncSettings.limit')
      forceSyncSwitchLabel = I.translate('directory.syncSettings.forceSync')
      syncSettingsNestingLevelLabel = I.translate('directory.syncSettings.nestingLevel')
      offboardingTitle = I.translate('directory.syncSettings.offboardingTitle')
      offboardingDescription = I.translate('directory.syncSettings.offboardingDescriptionDetail')
      offboardingSwitchLabel = I.translate('directory.syncSettings.offboarding')
      offboardingProtectionSwitchLabel = I.translate('directory.syncSettings.offboardingProtection')
      syncSettingsTabTitle = I.translate('directory.syncSettings.tab')
      syncScheduleTabTitle = I.translate('directory.syncSchedule.title')
      syncScheduleDescription = I.translate('directory.syncSchedule.description')
      addScheduleLabel = I.translate('directory.syncSchedule.add')
      removeScheduleLabel = I.translate('directory.syncSchedule.remove')
      syncBetween = I.translate('directory.syncSchedule.syncBetween')
      scheduledDays = I.translate('directory.syncSchedule.scheduledDays')
      scheduledDay = I.translate('directory.syncSchedule.scheduledDay')
      setTime = I.translate('directory.syncSchedule.setTime')

      syncTypes = getSyncTypes()
      syncIterations = {
        INTERVAL: I.translate('directory.syncSchedule.interval.interval'),
        DAILY: I.translate('directory.syncSchedule.interval.onceADay'),
        ONCE: I.translate('directory.syncSchedule.interval.noRecurrence'),
      }
      weekDays = {
        monday: I.translate('platform/time:monday'),
        tuesday: I.translate('platform/time:tuesday'),
        wednesday: I.translate('platform/time:wednesday'),
        thursday: I.translate('platform/time:thursday'),
        friday: I.translate('platform/time:friday'),
        saturday: I.translate('platform/time:saturday'),
        sunday: I.translate('platform/time:sunday'),
      }
    },
  )
}

const init = () => {
  loadStrings()
  BasePage.clearLocalStorage()
  BasePage.setLocalStorageState()
  I.visit(directoryListUrl)

  const { id, name } = directoryInstanceMock[0]
  I.findByLabelText(id).findByText(name).click()
}

const getSyncSettingsTab = () => I.findByRole('tab', { name: syncSettingsTabTitle })
const getSyncScheduleTab = () => I.findByRole('tab', { name: syncScheduleTabTitle })
const getDirectoryOnboardingSwitch = () => I.findByRole('checkbox', { name: syncSettingsOnboardingSwitchLabel })
const getDirectoryOnboardingLabel = () => I.findByText(syncSettingsOnboardingSwitchLabel)
const getSyncLimitInput = () => I.findByRole('spinbutton', { name: syncSettingsLimitLabel })
const getSyncLimitHelperText = () => I.findByText(I.translate('directory.syncSettings.limitDescription'))
const getNestingLevelInput = () => I.findByRole('spinbutton', { name: syncSettingsNestingLevelLabel })
const getNestingLevelHelperText = () => I.findByText(I.translate('directory.syncSettings.nestingLevelDescription'))
const getForceSyncSwitch = () => I.findByRole('checkbox', { name: forceSyncSwitchLabel })
const getForceSyncLabel = () => I.findByText(forceSyncSwitchLabel)
const getOffboardingTitle = () => I.findByRole('heading', { name: offboardingTitle })
const getOffboardingDescription = () => I.findByText(offboardingDescription)
const getDeleteUserSwitch = () => I.findByRole('checkbox', { name: offboardingSwitchLabel })
const getDeleteUserLabel = () => I.findByText(offboardingSwitchLabel)
const getOffboardingProtectionSwitch = () => I.findByRole('checkbox', { name: offboardingProtectionSwitchLabel })
const getOffboardingProtectionLabel = () => I.findByText(offboardingProtectionSwitchLabel)
const getEpmtyFieldValidation = fieldName => I.findByText(I.translate('platform/validation:emptyField', { fieldName }))
const getOutOfRangeValidation = (min, max) => I.findByText(I.translate('platform/validation:outOfRange', { min, max }))
const getInvalidFieldValidation = fieldName => I.findByText(I.translate('platform/validation:invalidField', { fieldName }))
const getAddScheduleButton = () => I.findByRole('button', { name: addScheduleLabel })
const getSaveButton = () => BasePage.findButton('general/form:commonLabels.save')
const getSubmitButton = () => BasePage.findButton('general/form:commonLabels.submit')
const getTable = () => I.findByRole('table', { name: syncScheduleTabTitle })
const getSyncIterationField = () => I.findByRole('spinbutton', { name: syncIterations.INTERVAL })

const checkWeekDaysByRole = role => {
  Object.values(weekDays).forEach(day => {
    I.findByRole(role, { name: day }).should('exist')
  })
}

const verifyPageDetails = (editable: boolean, directory: DirectoryInstance) => {
  getSyncSettingsTab().should('exist').and('be.visible').click()

  I.findByRole('heading', { name: onboardingTitle }).should('exist').and('be.visible')
  I.findByText(syncSettingsDescription).should('exist').and('be.visible')

  const enabled = editable ? 'enabled' : 'disabled'
  const onboardingChecked = directory.syncEnableOnboarding ? 'be.checked' : 'not.be.checked'
  const forceSyncChecked = directory.syncForce ? 'be.checked' : 'not.be.checked'
  const offboardingChecked = directory.syncEnableOffboarding ? 'be.checked' : 'not.be.checked'
  const onboardingConfigVisible = onboardingChecked ? 'be.visible' : 'not.be.visible'

  getDirectoryOnboardingSwitch().should(`be.${enabled}`).and(onboardingChecked)
  getDirectoryOnboardingLabel().should('exist').and('be.visible')
  getSyncLimitInput().should('exist').and(onboardingConfigVisible).and(`be.${enabled}`)
  getSyncLimitHelperText().should('exist').and('be.visible')
  getNestingLevelInput().should('exist').and(onboardingConfigVisible).and(`be.${enabled}`)
  getNestingLevelHelperText().should('exist').and('be.visible')
  getForceSyncSwitch().should(`be.${enabled}`).and(forceSyncChecked)
  getForceSyncLabel().should('exist').and('be.visible')
  getOffboardingTitle().should('exist').and(onboardingConfigVisible)
  getOffboardingDescription().should('exist').and(onboardingConfigVisible)
  getDeleteUserSwitch().should(`be.${enabled}`).and(offboardingChecked)
  getDeleteUserLabel().should('exist').and('be.visible')

  getSyncScheduleTab().should('exist').and('be.visible').click()

  I.findByRole('heading', { name: syncScheduleTabTitle }).should('exist').and('be.visible')
  I.findByText(syncScheduleDescription).should('exist').and('be.visible')

  if (editable) {
    getAddScheduleButton().should('exist').and('be.visible')
  } else {
    getAddScheduleButton().should('not.exist')
  }

  // Table should be visible for both
  getTable().should('exist').and('be.visible')

  // Remove buttons for schedules should only be visible in edit mode
  assert(directory.directorySyncSchedules.length > 0, "Mock directory doesn't have any sync schedules configured")

  if (editable) {
    I.findAllByLabelText(removeScheduleLabel).its('length').should('be.eq', directory.directorySyncSchedules.length)
  } else {
    I.findAllByLabelText(removeScheduleLabel).should('not.exist')
  }
}

describe('Directory details navigation test cases', () => {
  beforeEach(() => {
    init()
  })

  it('Should navigate to Directory details page', () => {
    BasePage.checkLocationHashWithCurrent(editDirectoryInstanceUrl)
  })

  it('Should navigate back to Directory Connection page on Cancel button click', () => {
    getCancelButton().click()
    BasePage.checkLocationHashWithCurrent(directoryListUrl)
  })

  it('Should navigate back to Directory Connection page on Go Back button click', () => {
    BasePage.getGoBackButton().click()
    BasePage.checkLocationHashWithCurrent(directoryListUrl)
  })
})

describe('Directory details general test cases', () => {
  before(() => {
    init()
  })

  it('Should check all content on the page', () => {
    BasePage.getGoBackButton().should('exist').and('be.visible')
    I.findByText(I.translate('directory.azureConnection.edit'))
    BasePage.getHelpLink().should('exist').should('have.attr', 'href', BasePage.HELP_LINKS.DIRECTORY_CONNECTIONS)
    verifyPageDetails(true, directoryInstanceMock[0])
    getCancelButton().should('exist').and('be.visible')
    getSaveButton().should('exist').and('be.visible').and('be.enabled')
  })

  it('Should check Sync Settings elements', () => {
    getSyncSettingsTab().click()

    getDirectoryOnboardingSwitch().click().should('not.be.checked')
    getDirectoryOnboardingLabel().should('exist').and('be.visible')
    getSyncLimitInput().should('not.exist')
    getSyncLimitHelperText().should('not.exist')
    getNestingLevelInput().should('not.exist')
    getNestingLevelHelperText().should('not.exist')
    getForceSyncSwitch().should('not.exist')
    getForceSyncLabel().should('not.exist')
    getOffboardingTitle().should('not.exist')
    getOffboardingDescription().should('not.exist')
    getDeleteUserSwitch().should('not.exist')
    getDeleteUserLabel().should('not.not.exist')

    getDirectoryOnboardingSwitch().click().should('be.checked')

    getForceSyncSwitch().should('exist').click().should('be.checked')

    getOffboardingProtectionSwitch().should('not.exist')
    getOffboardingProtectionLabel().should('not.exist')
    getDeleteUserSwitch().should('exist').click().should('be.checked')
    getOffboardingProtectionSwitch().should('exist').and('not.be.checked').click().should('be.checked')
    getOffboardingProtectionLabel().should('exist')
  })

  it('Should check Sync Settings inputs validation', () => {
    getSaveButton().should('exist').and('be.visible').and('be.enabled')

    getSyncLimitInput().clear()
    getEpmtyFieldValidation(syncSettingsLimitLabel).should('exist')

    getSyncLimitInput().type((MIN_LIMIT - 1).toString())
    getOutOfRangeValidation(MIN_LIMIT, MAX_LIMIT).should('exist')

    getSyncLimitInput()
      .clear()
      .type((MAX_LIMIT + 1).toString())
    getOutOfRangeValidation(MIN_LIMIT, MAX_LIMIT).should('exist')

    getSaveButton().should('exist').and('be.visible').and('be.not.enabled')
    getSyncLimitInput().clear().type('5')
    getSaveButton().should('exist').and('be.visible').and('be.enabled')

    getNestingLevelInput().clear()
    getEpmtyFieldValidation(syncSettingsNestingLevelLabel).should('exist')

    getNestingLevelInput().type((MIN_NESTING_LEVEL - 1).toString())
    getOutOfRangeValidation(MIN_NESTING_LEVEL, MAX_NESTING_LEVEL).should('exist')

    getNestingLevelInput()
      .clear()
      .type((MAX_NESTING_LEVEL + 1).toString())
    getOutOfRangeValidation(MIN_NESTING_LEVEL, MAX_NESTING_LEVEL).should('exist')

    getSaveButton().should('exist').and('be.visible').and('be.not.enabled')
    getNestingLevelInput().clear().type('5')
    getSaveButton().should('exist').and('be.visible').and('be.enabled')
  })

  it('Should check Sync Schedule table', () => {
    const theadsTitles = [
      'directory.syncSchedule.type',
      'directory.syncSchedule.recurrence',
      'directory.syncSchedule.time',
      'directory.syncSchedule.days',
    ]

    const tableContent = [
      {
        syncType: syncTypes.USERS_AND_GROUPS,
        recurrence: syncIterations.DAILY,
        time: DEFAULT_TIME,
        days: 'Mon, Wed, Thu, Fri, Sat, Sun',
      },
      {
        syncType: syncTypes.USERS_AND_GROUPS,
        recurrence: syncIterations.ONCE,
        time: '8:40 AM',
        days: 'Mon',
      },
    ]

    getSyncScheduleTab().click()

    getTable()
      .find('thead')
      .within(() => {
        theadsTitles.forEach(title => {
          I.findByText(I.translate(title))
        })
      })

    getTable().within(() => {
      tableContent.forEach((content, index) => {
        const { syncType, recurrence, time, days } = content

        BasePage.getTableRowByIndex(index + 1).within(() => {
          I.findByText(syncType).should('exist')
          I.findByText(recurrence).should('exist')
          I.findByText(time).should('exist')
          I.findByText(days).should('exist')
          I.findByLabelText(removeScheduleLabel).should('exist')
        })
      })
    })
  })

  it('Should remove all Sync Schedules from the table', () => {
    getSyncScheduleTab().click()

    const tableRowQuantity = directoryInstanceMock[0].directorySyncSchedules.length

    for (let i = tableRowQuantity; i >= 1; i--) {
      BasePage.getTableRowByIndex(i).should('exist')
      BasePage.getTableRowByIndex(i).findByLabelText(removeScheduleLabel).click()
      BasePage.getTableRowByIndex(i).should('not.exist')
    }

    getTable().should('contain', I.translate('directory.syncSchedule.emptyTableMessage'))
  })

  it('Should check Add schedule form elements', () => {
    getSyncScheduleTab().click()
    getAddScheduleButton().click()

    getDialog().within(() => {
      I.findByText(addScheduleLabel).should('exist').and('be.visible')
      I.findByLabelText(syncTypes.USERS_AND_GROUPS).should('exist').and('be.visible').click()
    })
    I.findByRole('listbox').within(() => {
      Object.values(syncTypes).forEach(type => {
        I.findByText(type).should('exist').and('be.visible')
      })

      I.findByRole('option', { name: syncTypes.USER_ATTRIBUTES }).click()
    })
    I.findByLabelText(syncTypes.USER_ATTRIBUTES).should('exist').and('be.visible')

    getDialog().within(() => {
      I.findByLabelText(syncIterations.INTERVAL).should('exist').and('be.visible')
      getSyncIterationField().should('exist').and('be.visible').clear()
      I.findByText(syncBetween).should('exist').and('be.visible')
      I.findAllByDisplayValue(DEFAULT_TIME).should('have.length', 2)
      I.findByText(scheduledDays).should('exist').and('be.visible')
      checkWeekDaysByRole('checkbox')
      I.findByLabelText(syncIterations.INTERVAL).click()
    })

    I.findByRole('listbox').within(() => {
      Object.values(syncIterations).forEach(iteration => {
        I.findByText(iteration).should('exist').and('be.visible')
      })
      I.findByRole('option', { name: syncIterations.DAILY }).click()
    })

    getDialog().within(() => {
      getSyncIterationField().should('not.exist')
      I.findByText(syncBetween).should('not.exist')
      I.findByText(setTime).should('exist').and('be.visible')
      I.findAllByDisplayValue(DEFAULT_TIME).should('have.length', 1)
      I.findByText(scheduledDays).should('exist').and('be.visible')
      checkWeekDaysByRole('checkbox')

      I.findByLabelText(syncIterations.DAILY).should('exist').and('be.visible').click()
    })

    I.findByRole('listbox').findByRole('option', { name: syncIterations.ONCE }).click()

    getDialog().within(() => {
      getSyncIterationField().should('not.exist')
      I.findByText(syncBetween).should('not.exist')
      I.findByText(setTime).should('exist').and('be.visible')
      I.findAllByDisplayValue(DEFAULT_TIME).should('have.length', 1)
      I.findByText(scheduledDays).should('not.exist')
      I.findByText(scheduledDay).should('exist').and('be.visible')
      checkWeekDaysByRole('radio')
      I.findByRole('radio', { name: weekDays.monday }).should('be.checked')
      I.findByRole('radio', { name: weekDays.friday }).should('not.be.checked').click().should('be.checked')
      I.findByRole('radio', { name: weekDays.monday }).should('not.be.checked')

      getSubmitButton().should('exist').and('be.visible')
      getCancelButton().should('exist').and('be.visible').click()
    })

    getDialog().should('not.exist')
  })

  it('Should check Add schedule form validation', () => {
    getSyncScheduleTab().click()
    getAddScheduleButton().click()

    getDialog().within(() => {
      getSyncIterationField().should('exist').and('be.visible').clear()
      getInvalidFieldValidation(syncIterations.INTERVAL).should('exist').and('be.visible')
      getSubmitButton().should('exist').and('be.disabled')
      getSyncIterationField().type((MIN_INTERVAL - 1).toString())
      getOutOfRangeValidation(MIN_INTERVAL, MAX_INTERVAL).should('exist').and('be.visible')
      getSubmitButton().should('exist').and('be.disabled')
      getSyncIterationField()
        .clear()
        .type((MAX_INTERVAL + 1).toString())
      getOutOfRangeValidation(MIN_INTERVAL, MAX_INTERVAL).should('exist').and('be.visible')
      getSyncIterationField().clear().type(DEFAULT_INTERVAL_MIN.toString())
      getOutOfRangeValidation(MIN_INTERVAL, MAX_INTERVAL).should('not.exist')
      getInvalidFieldValidation(syncIterations.INTERVAL).should('not.exist')
      getSubmitButton().should('exist').and('not.be.disabled')

      getCancelButton().should('exist').and('be.visible').click()
    })
  })

  it('Should add new Sync Schedules to the table', () => {
    getSyncScheduleTab().click()
    getAddScheduleButton().click()

    const newSchedule = {
      syncType: syncTypes.USER_ATTRIBUTES,
      recurrence: syncIterations.ONCE,
      time: DEFAULT_TIME,
      day: weekDays.friday,
    }

    getDialog().findByLabelText(syncTypes.USERS_AND_GROUPS).click()
    I.findByRole('listbox').findByRole('option', { name: newSchedule.syncType }).click()

    getDialog().findByLabelText(syncIterations.INTERVAL).click()
    I.findByRole('listbox').findByRole('option', { name: newSchedule.recurrence }).click()
    I.findByRole('radio', { name: newSchedule.day }).click()

    getSubmitButton().click()

    I.findAllByRole('row')
      .contains(syncTypes.USER_ATTRIBUTES)
      .parent()
      .within(() => {
        I.findByText(syncIterations.ONCE).should('exist')
        I.findByText(DEFAULT_TIME).should('exist')
        I.findByText(newSchedule.day.slice(0, 3)).should('exist')
        I.findByLabelText(removeScheduleLabel).should('exist')
      })
  })

  it('Should appear notification when creating duplicate Schedule', () => {
    getSyncScheduleTab().click()
    getAddScheduleButton().click()
    getSubmitButton().click()
    getAddScheduleButton().click()
    getDialog().findByText(I.translate('directory.error.duplicateSchedule')).should('exist').and('be.visible')
    getCancelButton().click()
  })
})

describe('Directory details RBAC test cases', () => {
  before(() => {
    init()
  })

  it('Edit directory details - full access', () => {
    setFullPermissions()
    verifyPageDetails(true, directoryInstanceMock[0])
  })

  it('Edit directory details - readonly access', () => {
    setReadonlyPermissions()
    verifyPageDetails(false, directoryInstanceMock[0])
  })

  it('Edit directory details - no access', () => {
    setNoPermissions()
    BasePage.findNotFoundMessage().should('exist').and('be.visible')
    I.findByRole('generic').contains(Permission.ECS_DIRECTORY_READ)
  })
})

describe('Edit directory details - invalid connection id', () => {
  before(() => {
    BasePage.clearLocalStorage()
    I.loadI18nNamespaces('access').then(() => {
      resourceNotFoundMessage = I.translate('access:errors.notFound.title')
    })
  })

  it('Edit directory details - invalid connection', () => {
    Cypress.on('uncaught:exception', err => {
      return false
    })

    BasePage.setLocalStorageState()
    BasePage.setLocalStorageBypassMock('true')
    setFullPermissions()

    I.intercept('GET', '/**/api/platform/v1/directory/instance/*', {
      statusCode: 400,
      body: { subStatusCode: 110 },
    })

    I.visit('#/settings/companyDirectory/azure/blah')

    I.findByText(resourceNotFoundMessage).should('exist').and('be.visible')
  })
})
