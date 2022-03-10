export enum TranslationKey {
  Clear = 'tables:clear',
  ColumnFilterButtonTitle = 'tables:filterIcon',
  ColumnPickerTitle = 'bis/ues:gatewayAlerts.table.columnPicker.title',
  CriticalRiskLevel = 'bis/shared:risk.level.CRITICAL',
  DetectionTimeFilter = 'bis/ues:gatewayAlerts.table.headers.detectionTime',
  EventDetailsRowLabel = 'bis/ues:gatewayAlertDetails.labels.eventDetails',
  HighRiskLevel = 'bis/shared:risk.level.HIGH',
  IdentityRisk = 'bis/shared:risk.common.riskType',
  MediumRiskLevel = 'bis/shared:risk.level.MEDIUM',
  NetworkAnomalyDetection = 'bis/ues:gatewayAlerts.columns.detection.networkAnomaly',
  NoData = 'tables:noData',
  PassiveOperatingModeTitle = 'bis/ues:gatewayAlerts.alert.passiveMode.title',
  PlatformGenericClose = 'general/form:commonLabels.close',
  RiskFilter = 'bis/ues:gatewayAlerts.table.headers.risk',
  TotalResultsLabel = 'bis/ues:gatewayAlerts.table.toolbar.totalResults',
  UserDetailsHyperlink = 'bis/ues:gatewayAlertDetails.labels.userHyperlink',
  UserRowLabel = 'bis/ues:gatewayAlertDetails.labels.user',
}

export const getGrid = () => I.findByRole('grid')

export const getAllGridRows = () => getGrid().findAllByRole('row')

export const getGridToolbar = () => I.findByRole('toolbar')

export const getColumnRowsCells = (colLabel: RegExp) => I.findAllByInfiniteTableColumnLabel(colLabel).filter(index => index !== 0)

export const getColumnHeaderCell = (colLabel: RegExp) => I.findAllByInfiniteTableColumnLabel(colLabel).first()

export const getColumnFilterButton = (colLabel: RegExp) =>
  getColumnHeaderCell(colLabel).findByTitle(I.translate(TranslationKey.ColumnFilterButtonTitle))

export const getPresentation = () => I.findAllByRole('presentation').first()

export const clearFilters = () => I.findByText(I.translate(TranslationKey.Clear)).click()

export const getColumnSortingButton = (colLabel: RegExp) => getColumnHeaderCell(colLabel).findByText(colLabel)

export const getColumnPickerButton = () => I.findByLabelText('columnPicker')

export const openDrawer = () => {
  getAllGridRows().first().click()
}

export const closeDrawer = () => I.findByTitle(I.translate(TranslationKey.PlatformGenericClose)).should('be.visible').click()
