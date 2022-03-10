import i18n from 'i18next'

import { I18nFormats } from '@ues-behaviour/shared-e2e'
import type { AggregatedEndpoint } from '@ues-data/platform/entities/types'
import { DeviceOs, EmmConnectionRegistrationStatus, EmmConnectionType, RiskLevelStatus } from '@ues-data/platform/entities/types'
import { Permission } from '@ues-data/shared-types'
import type { FILTER_TYPE } from '@ues/behaviours/types'
import { FILTER_TYPES } from '@ues/behaviours/types'

import type { CheckFilterParams, ColumnConfig } from './types'
import { ColumnId } from './types'

const HELP_LINK = 'https://docs.blackberry.com/en/unified-endpoint-security/console/help/assets-mobile-devices'

const filterColumnName = 'Filter column' // not localized, comes from x-grid

enum FIND_BY {
  TEXT = 'byText',
  LABEL_TEXT = 'byLabelText',
  CONTAINS = 'contains',
}

const columns = [
  {
    id: ColumnId.RISK,
    order: 1,
    labelKey: 'platform/endpoints:endpoint.fields.riskLevelStatus',
    canBeHidden: true,
    filterType: FILTER_TYPES.CHECKBOX,
    value: Object.values(RiskLevelStatus),
    tPrefix: `platform/endpoints:endpoint.risk.`,
  },
  {
    id: ColumnId.DEVICE,
    order: 2,
    labelKey: 'platform/endpoints:endpoint.fields.device',
    canBeHidden: false,
    filterType: FILTER_TYPES.QUICK_SEARCH,
    value: 'Galaxy',
  },
  {
    id: ColumnId.USER,
    order: 3,
    labelKey: 'platform/endpoints:endpoint.fields.userName',
    canBeHidden: false,
    filterType: FILTER_TYPES.QUICK_SEARCH,
    value: '資産',
  },
  {
    id: ColumnId.EMAIL,
    order: 4,
    labelKey: 'platform/endpoints:endpoint.fields.userEmail',
    canBeHidden: true,
    filterType: FILTER_TYPES.QUICK_SEARCH,
    value: 'blackberry',
  },
  {
    id: ColumnId.OS,
    order: 5,
    labelKey: 'platform/endpoints:endpoint.fields.os',
    canBeHidden: true,
    filterType: FILTER_TYPES.CHECKBOX,
    value: Object.values(DeviceOs),
    tPrefix: `general/form:os.`,
  },
  {
    id: ColumnId.OS_VERSION,
    order: 6,
    labelKey: 'platform/endpoints:endpoint.fields.osVersion',
    canBeHidden: true,
    filterType: FILTER_TYPES.QUICK_SEARCH,
    value: '1',
  },
  {
    id: ColumnId.AGENT,
    order: 7,
    labelKey: 'platform/endpoints:endpoint.fields.agent',
    canBeHidden: true,
    filterType: FILTER_TYPES.QUICK_SEARCH,
    value: 'blackberry',
  },
  {
    id: ColumnId.EMM_CONNECTIONS,
    labelKey: 'platform/endpoints:endpoint.fields.emmConnections',
    canBeHidden: true,
    sortable: true,
    filterType: FILTER_TYPES.CHECKBOX,
    value: Object.values(EmmConnectionType),
    tPrefix: `platform/endpoints:emmConnection.type.`,
  },
  {
    id: ColumnId.ENROLLMENT,
    order: 8,
    labelKey: 'platform/endpoints:endpoint.fields.enrollment',
    canBeHidden: true,
    filterType: FILTER_TYPES.DATE_PICKER,
    value: [new Date(), new Date()],
  },
  {
    id: ColumnId.OS_SECURITY_PATCH,
    order: 9,
    labelKey: 'platform/endpoints:endpoint.fields.osSecurityPatch',
    canBeHidden: true,
    filterType: FILTER_TYPES.QUICK_SEARCH,
    value: '2021',
  },
]

const BUTTONS = {
  REMOVE: 'general/form:commonLabels.remove',
}

const clickAway = () => I.findAllByRole('presentation').first().click('top', { timeout: 1000 })
const getRemoveButton = () => I.findByRole('toolbar').findByText(I.translate(BUTTONS.REMOVE))

const getSelectAllUsersCheckbox = () =>
  I.findByXGridHeader(1).within(() => {
    I.findByRole('checkbox')
  })

const setReadonlyDevicePermissions = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_DEVICES_READ] = true
  overridePermissionsObj[Permission.ECS_DEVICES_DELETE] = false
  I.overridePermissions({ ...overridePermissionsObj })
}

const setNoDevicesPermissions = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_DEVICES_READ] = false
  I.overridePermissions({ ...overridePermissionsObj })
}

const findNotFoundMessage = () => I.findByText(I.translate('access:errors.notFound.title'))

const openColumnPicker = () => {
  I.findAllByRole('columnheader')
    .then($headers => {
      return $headers.slice(-2, -1)
    })
    .click('center')
}

const findColumnInPickerById = (id: ColumnId) => {
  return findColumnInPickerByLabelKey(columns.find(x => x.id === id)[0].labelKey)
}

const findColumnInPickerByLabelKey = (labelKey: string) => {
  return I.findByLabelText(I.translate(labelKey))
}

const showColumn = (column: ColumnConfig) => {
  openColumnPicker()
  const colCheckbox = findColumnInPickerByLabelKey(column.labelKey)
  colCheckbox.check()
  clickAway()
}

const hideColumn = (column: ColumnConfig) => {
  openColumnPicker()
  findColumnInPickerByLabelKey(column.labelKey).uncheck()
  clickAway()
}

const clickOutsideModal = (position?: Cypress.PositionType) => {
  return I.findAllByRole('presentation')
    .first()
    .click(position || 'top', { timeout: 1000 })
}

const checkFilter = (checkFilterConfig: CheckFilterParams) => {
  const { column, filterChipOnly = false } = checkFilterConfig
  const filterType: FILTER_TYPE = column.filterType

  const columnLabel = I.translate(column.labelKey)
  I.say(`Checking filter for {${columnLabel}} column`)
  const values = []
  switch (filterType) {
    case FILTER_TYPES.CHECKBOX:
      for (let i = 0; i < column.value.length; i++) {
        const value = column.value[i]
        const valueName = I.translate(`${column.tPrefix}${value}`)
        values.push(valueName)

        if (!filterChipOnly) {
          I.findByRole('columnheader', { name: columnLabel })
            .findByRole('button', { name: filterColumnName })
            .scrollIntoView()
            .click('center')

          I.findByRole('menu').within(() => I.findByLabelText(valueName).click())
          clickAway()
          I.findByRole('button', { name: getCheckboxFilterName(columnLabel, values) })
        }
      }
      I.findByRole('button', { name: getCheckboxFilterName(columnLabel, values) })

      break
    case FILTER_TYPES.QUICK_SEARCH:
      if (!filterChipOnly) {
        I.findByRole('columnheader', { name: columnLabel })
          .findByRole('button', { name: 'Filter column' })
          .scrollIntoView()
          .click('center')
        I.findByRole('textbox').type(column.value)
        clickAway()
      }
      I.findByRole('button', { name: getQuickSearchFilterName(columnLabel, column.value) })
      break
  }
}

const findColumnHeader = (column: ColumnConfig) => I.findByRole('columnheader', { name: I.translate(column.labelKey) })

const findColumnHeaderById = (columnId: ColumnId) => {
  return findColumnHeader(columns.find(x => x.id === columnId))
}

const getCheckboxFilterName = (label, values) => {
  return I.translate('tables:filterLabelValue', {
    label: label,
    value: I.translate('tables:isIn', { value: values.join(',') }),
  })
}

const getQuickSearchFilterName = (label, value) => {
  return I.translate('tables:filterLabelValueOperator', { label: label, operator: I.translate('tables:contains'), value: value })
}

const testRiskColumn = (entities: AggregatedEndpoint[]) => {
  I.findAllByTableColumnLabel(I.translate('endpoint.fields.riskLevelStatus')).each((cell, index) => {
    // skip header
    if (index !== 0) {
      const rowData: AggregatedEndpoint = entities[index]
      const riskStatusLabel = rowData.riskLevelStatus && I.translate(`platform/endpoints:endpoint.risk.${rowData.riskLevelStatus}`)

      if (rowData.riskLevelStatus && rowData.riskLevelStatus !== RiskLevelStatus.UNKNOWN) {
        I.wrap(cell).findByLabelText(riskStatusLabel).should('exist')
      } else {
        I.wrap(cell).findByLabelText(riskStatusLabel).should('not.exist')
      }
    }
  })
}

const testTextColumn = (
  entities: AggregatedEndpoint[],
  headerKey: string,
  text: (rowData: AggregatedEndpoint) => string,
  field: string,
  findBy: FIND_BY,
  index?: number,
): Cypress.Chainable<JQuery<HTMLElement>> => {
  return I.findAllByTableColumnLabel(new RegExp('^' + I.translate(headerKey) + '$', 'i'), index).each((cell, index) => {
    // skip header
    if (index !== 0) {
      const rowData: AggregatedEndpoint = entities[index]
      const dataText = text(rowData)

      if (rowData[field] && findBy) {
        switch (findBy) {
          case FIND_BY.LABEL_TEXT: {
            I.wrap(cell).findByLabelText(dataText).should('exist')
            break
          }
          case FIND_BY.CONTAINS: {
            I.wrap(cell).contains(dataText)
            break
          }
          case FIND_BY.TEXT:
          default: {
            console.log('find by text: ' + dataText)
            I.wrap(cell).findByText(dataText).should('exist')
          }
        }
      }
    }
  })
}

const testDeviceColumn = (entities: AggregatedEndpoint[]): Cypress.Chainable<JQuery<HTMLElement>> => {
  return testTextColumn(
    entities,
    'endpoint.fields.device',
    rowData => I.translate('general/form:ariaLabels.viewDeviceDetails', { deviceName: rowData.device }),
    'device',
    FIND_BY.LABEL_TEXT,
  )
}

const testUserColumn = (entities: AggregatedEndpoint[]): Cypress.Chainable<JQuery<HTMLElement>> => {
  return testTextColumn(entities, 'endpoint.fields.userName', rowData => rowData.userDisplayName, 'userDisplayName', FIND_BY.TEXT)
}

const testAgentColumn = (entities: AggregatedEndpoint[]) => {
  return testTextColumn(entities, 'endpoint.fields.agent', rowData => rowData.agent.substring(0, 10), 'agent', FIND_BY.CONTAINS)
}

const testDeviceOsColumn = (entities: AggregatedEndpoint[]) => {
  return testTextColumn(
    entities,
    'endpoint.fields.os',
    rowData => I.translate(`general/form:os.${rowData.osPlatform.toLowerCase()}`),
    'osPlatform',
    FIND_BY.LABEL_TEXT,
    6,
  )
}

const testEmmConnectionsColumn = (entities: AggregatedEndpoint[]) => {
  I.findAllByTableColumnLabel(I.translate('endpoint.fields.emmConnections')).each((cell, index) => {
    // skip header
    if (index !== 0) {
      const rowData: AggregatedEndpoint = entities[index]
      const connectionTypeLabel = rowData.emmType && I.translate(`platform/endpoints:emmConnection.type.${rowData.emmType}`)
      if (rowData.emmType) {
        I.wrap(cell).findByText(connectionTypeLabel).should('exist')

        if (
          rowData.emmRegistrationStatus &&
          [EmmConnectionRegistrationStatus.ERROR, EmmConnectionRegistrationStatus.PENDING].includes(rowData.emmRegistrationStatus)
        ) {
          const statusAriaLabel =
            rowData.emmType &&
            rowData.emmRegistrationStatus &&
            I.translate('platform/endpoints?:emmConnection.statusAriaLabel', { status: rowData.emmRegistrationStatus })

          const statusLabel = I.translate(`platform/endpoints?:emmConnection.status.${rowData.emmRegistrationStatus}`)
        }
      } else {
        I.wrap(cell).findByLabelText(connectionTypeLabel).should('not.exist')
      }
    }
  })
}

const testOsVersionColumn = (entities: AggregatedEndpoint[]) => {
  return testTextColumn(entities, 'endpoint.fields.osVersion', rowData => rowData.osVersion, 'osVersion', FIND_BY.TEXT, 7)
}

const testOsSecurityPatchColumn = (entities: AggregatedEndpoint[]) => {
  return testTextColumn(
    entities,
    'endpoint.fields.osSecurityPatch',
    rowData => rowData.osSecurityPatch,
    'osSecurityPatch',
    FIND_BY.TEXT,
    11,
  )
}

const testEnrollmentColumn = (entities: AggregatedEndpoint[]) => {
  return testTextColumn(
    entities,
    'endpoint.fields.enrollment',
    rowData => i18n.format(rowData.enrollmentTime, I18nFormats.DateTimeShort),
    'enrollmentTime',
    FIND_BY.TEXT,
  )
}

export const MobileDevicesGrid = {
  checkFilter,
  clickOutsideModal,
  columns,
  findColumnHeader,
  findColumnHeaderById,
  findColumnInPickerById,
  findColumnInPickerByLabelKey,
  findNotFoundMessage,
  getRemoveButton,
  getSelectAllUsersCheckbox,
  hideColumn,
  openColumnPicker,
  setNoDevicesPermissions,
  setReadonlyDevicePermissions,
  showColumn,
  testAgentColumn,
  testDeviceColumn,
  testDeviceOsColumn,
  testEmmConnectionsColumn,
  testEnrollmentColumn,
  testOsSecurityPatchColumn,
  testOsVersionColumn,
  testRiskColumn,
  testTextColumn,
  testUserColumn,
  HELP_LINK,
}
