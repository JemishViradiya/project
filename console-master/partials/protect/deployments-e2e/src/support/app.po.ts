export const getHeader = () => I.get('.MuiTypography-h2')

// #region - update strategies list
export const getUpdateStrategiesLinearLoader = () => I.get('[data-autoid="deployments-update-strategies-list-linearLoader"]')
export const getUpdateStrategiesCircularLoader = () => I.get('[data-autoid="deployments-update-strategies-list-circularLoader"]')
export const getUpdateStrategiesNoData = () => I.get('[data-autoid="deployments-update-strategies-list-noData"]')
export const getUpdateRulesLinearLoader = () => I.get('[data-autoid="deployments-update-rules-list-linearLoader"]')
export const getUpdateRulesCircularLoader = () => I.get('[data-autoid="deployments-update-rules-list-circularLoader"]')
export const getUpdateRulesNoData = () => I.get('[data-autoid="deployments-update-rules-list-noData"]')
// #endregion

// #region - update strategy
export const getUpdateStrategiesExpansionSummary = () => I.get('[data-autoid="update-strategies-expansion-summary"]')
export const getUpdateStrategiesExpansionDetails = () => I.get('[data-autoid="update-strategies-expansion-details"]')
// static
export const getUpdateStrategiesStaticSummary = () => I.get('[data-autoid="update-strategies-static-summary"]')
export const getUpdateStrategiesStaticName = () => I.get('[data-autoid="update-strategies-static-name"]')
export const getUpdateStrategiesStaticProducts = () => I.get('[data-autoid="update-strategies-static-products"]')
export const getUpdateStrategiesStaticModifiedDate = () => I.get('[data-autoid="update-strategies-static-modified-date"]')
export const getUpdateStrategiesEditButton = () => I.get('[data-autoid="update-strategies-edit"]')
export const getUpdateStrategiesDeleteButton = () => I.get('[data-autoid="update-strategies-delete"]')
export const getUpdateStrategiesStaticDetails = () => I.get('[data-autoid="update-strategies-static-details"]')
export const getUpdateStrategiesStaticDescription = () => I.get('[data-autoid="update-strategies-static-description"]')
export const getUpdateStrategiesStaticStrategies = () => I.get('[data-autoid="update-strategies-static-strategies"]')
export const getUpdateStrategiesStaticStrategiesProduct = () => I.get('[data-autoid="update-strategies-static-strategies-product"]')
export const getUpdateStrategiesStaticStrategiesTypeVersion = () =>
  I.get('[data-autoid="update-strategies-static-strategies-type-version"]')
// editable
export const getUpdateStrategiesEditableSummary = () => I.get('[data-autoid="update-strategies-editable-summary"]')
export const getUpdateStrategiesEditableSummaryName = () => I.get('[data-autoid="update-strategies-editable-summary-name"]')
export const getUpdateStrategiesEditableSummaryProducts = () => I.get('[data-autoid="update-strategies-editable-summary-products"]')
export const getUpdateStrategiesEditableSummaryModifiedDate = () =>
  I.get('[data-autoid="update-strategies-editable-summary-modified-date"]')
export const getUpdateStrategiesCancelEditButton = () => I.get('[data-autoid="update-strategies-cancel-edit"]')
export const getUpdateStrategiesSaveEditButton = () => I.get('[data-autoid="update-strategies-save-edit"]')
export const getUpdateStrategiesEditableDetails = () => I.get('[data-autoid="update-strategies-editable-details"]')
export const getUpdateStrategiesEditableProductStrategy = () => I.get('[data-autoid="update-strategies-edit-product-strategy"]')
export const getUpdateStrategiesEditableName = () => I.get('[data-autoid="update-strategies-edit-name"]')
export const getUpdateStrategiesEditableDescription = () => I.get('[data-autoid="update-strategies-edit-description"]')
export const getUpdateStrategiesAddAnotherProductLink = () =>
  I.get('[data-autoid="update-strategies-edit-add-another-product-link"]')
export const getUpdateStrategiesAddAnotherProductLinkDisabled = () =>
  I.get('[data-autoid="update-strategies-edit-add-another-product-link-disabled"]')
export const getUpdateStrategiesEditStrategyProductStaticProtect = () =>
  I.get('[data-autoid="update-strategies-edit-strategy-product-static-protect"]')
export const getUpdateStrategiesEditStrategyProductSelect = index =>
  I.get(`[data-autoid="update-strategies-edit-strategy-${index}-product-name"]`)
export const getUpdateStrategiesEditStrategyProductSelectMenuItem = (strategyIndex, itemIndex) =>
  I.get(`[data-autoid="update-strategies-edit-strategy-${strategyIndex}-product-name-menu"]`).find('li').eq(itemIndex)
export const getUpdateStrategiesEditStrategyTypeSelect = index =>
  I.get(`[data-autoid="update-strategies-edit-strategy-${index}-strategy-type"]`)
export const getUpdateStrategiesEditStrategyTypeSelectMenuItem = (strategyIndex, itemIndex) =>
  I.get(`[data-autoid="update-strategies-edit-strategy-${strategyIndex}-strategy-type-menu"]`).find('li').eq(itemIndex)
export const getUpdateStrategiesEditStrategyVersionSelect = index =>
  I.get(`[data-autoid="update-strategies-edit-strategy-${index}-version"]`)
export const getUpdateStrategiesEditStrategyVersionMenuItem = (strategyIndex, itemIndex) =>
  I.get(`[data-autoid="update-strategies-edit-strategy-${strategyIndex}-version-menu"]`).find('li').eq(itemIndex)
// #endregion

// #region - update rule
export const getUpdateRulesPanelHeaders = () => I.get('[data-autoid="update-rules-panel-header"]')
export const getUpdateRulesPanelContentBodies = () => I.get('[data-autoid="update-rules-panel-content"]')
// #endregion

// #region - installer packages
export const getInstallerPackageDownloadButton = () => I.get('[data-autoid="deployments-download-installer"]')
export const getInstallerPackageProductField = () => I.get('[data-autoid="deployments-product-select"]')
export const getInstallerPackageProductFieldLabel = () => I.get('[data-autoid="deployments-product-select"] label')
export const getInstallerPackageProductOption = () => I.get('[data-autoid="deployments-product-select-Protect"]')
export const getInstallerPackageHybridOption = () => I.get('[data-autoid="deployments-product-select-Hybrid"]')
export const getInstallerPackageOsField = () => I.get('[data-autoid="deployments-os-select"]')
export const getInstallerPackageOsFieldLabel = () => I.get('[data-autoid="deployments-os-select"] label')
export const getInstallerPackageOsOption = () => I.get('[data-autoid="deployments-os-select-mac"]')
export const getInstallerPackageVersionField = () => I.get('[data-autoid="deployments-version-select"]')
export const getInstallerPackageVersionFieldLabel = () => I.get('[data-autoid="deployments-version-select"] label')
export const getInstallerPackageVersionOption = () => I.get('[data-autoid="deployments-buildVersion-select-2.0.1"]')
export const getInstallerPackageFormatField = () => I.get('[data-autoid="deployments-format-select"]')
export const getInstallerPackageFormatFieldLabel = () => I.get('[data-autoid="deployments-format-select"] label')
export const getInstallerPackageFormatOption = () => I.get('[data-autoid="deployments-packageFormat-select-exe"]')
export const getOsMenu = () => I.get('[data-autoid="deployments-os-menu"]')
export const getWindowsOs = () => I.get('[data-autoid="deployments-os-select-windows"]')
export const getMacOs = () => I.get('[data-autoid="deployments-os-select-mac"]')
export const getLinuxOs = () => I.get('[data-autoid="deployments-os-select-linux"]')
export const getInstallerDownloadError = () => I.get('.MuiAlert-filledError')
export const getHybridInstallerScriptBtn = () => I.get('[data-autoid="hybrid-installer-script-btn"]')
export const getHybridLicenseKeyBtn = () => I.get('[data-autoid="hybrid-license-key-btn"]')
export const getHybridLicenseKeySizeText = () => I.get('[data-autoid="hybrid-license-key-size-text"]')
export const getHybridInstallerScriptSizeText = () => I.get('[data-autoid="hybrid-installer-script-size-text"]')
// #endregion

// #region - mock tokens
export const mockAdminRoleToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRpZCI6IjZkZjVkM2IzLTdmM2UtNGU2NS04ZjgxLTA4NjcxN2U3MDEzNSIsInVzZXJsb2dpbiI6IkRldkFkbWluQGN5bGFuY2UuY29tIiwidXNlcmlkIjoiMTdjMjllNWEtNDczYi00MjYwLWEwMDMtNWNjOGViMzdhMjYxIiwiZ2hvc3R1c2VybmFtZSI6bnVsbCwidGVuYW50ZGVmYXVsdHN0eXBlIjowLCJzaGFyZGlkIjoxLCJyb2xlIjpbeyJuYW1lIjoiYWRtaW5pc3RyYXRvciIsImlzQ3VzdG9tIjpmYWxzZSwiem9uZWlkcyI6W10sInJiYWMiOnt9fV0sImp0aSI6IjRkYjMzNDI3LTY0NjgtNGYwYy05OTM1LTk0NzBiMTkzMTEzZCIsImlhdCI6MTU4MDQ5OTA0NiwibmJmIjoxNTgwNDk5MDQ2LCJleHAiOjI1ODA1MDI2NDYsImlzcyI6ImN5bGFuY2UuY29tIn0.E28jD16DS0MUVQsYo9t7BIjVLtxXF8T5QAoUgJeZxcE'
export const mockUserRoleToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRpZCI6IjZkZjVkM2IzLTdmM2UtNGU2NS04ZjgxLTA4NjcxN2U3MDEzNSIsInVzZXJsb2dpbiI6IkRldkFkbWluQGN5bGFuY2UuY29tIiwidXNlcmlkIjoiMTdjMjllNWEtNDczYi00MjYwLWEwMDMtNWNjOGViMzdhMjYxIiwiZ2hvc3R1c2VybmFtZSI6bnVsbCwidGVuYW50ZGVmYXVsdHN0eXBlIjowLCJzaGFyZGlkIjoxLCJyb2xlIjpbeyJuYW1lIjoidXNlciIsImlzQ3VzdG9tIjpmYWxzZSwiem9uZWlkcyI6W10sInJiYWMiOnt9fV0sImp0aSI6IjRkYjMzNDI3LTY0NjgtNGYwYy05OTM1LTk0NzBiMTkzMTEzZCIsImlhdCI6MTU4MDQ5OTA0NiwibmJmIjoxNTgwNDk5MDQ2LCJleHAiOjI1ODA1MDI2NDYsImlzcyI6ImN5bGFuY2UuY29tIn0.B_nBiqxattFzK8Cy4o3mNPcw0Ot7cis0H1IXZNB0Y5Q'
export const mockZoneManagerRoleToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRpZCI6IjZkZjVkM2IzLTdmM2UtNGU2NS04ZjgxLTA4NjcxN2U3MDEzNSIsInVzZXJsb2dpbiI6IkRldkFkbWluQGN5bGFuY2UuY29tIiwidXNlcmlkIjoiMTdjMjllNWEtNDczYi00MjYwLWEwMDMtNWNjOGViMzdhMjYxIiwiZ2hvc3R1c2VybmFtZSI6bnVsbCwidGVuYW50ZGVmYXVsdHN0eXBlIjowLCJzaGFyZGlkIjoxLCJyb2xlIjpbeyJuYW1lIjoiem9uZW1hbmFnZXIiLCJpc0N1c3RvbSI6ZmFsc2UsInpvbmVpZHMiOltdLCJyYmFjIjp7fX1dLCJqdGkiOiI0ZGIzMzQyNy02NDY4LTRmMGMtOTkzNS05NDcwYjE5MzExM2QiLCJpYXQiOjE1ODA0OTkwNDYsIm5iZiI6MTU4MDQ5OTA0NiwiZXhwIjoyNTgwNTAyNjQ2LCJpc3MiOiJjeWxhbmNlLmNvbSJ9.gYooEk5EYAQW0xx9F7nKNB9Kiov2wjXVyDwB2vQvnaU'
export const mockInstallerDownloadToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRpZCI6IjZkZjVkM2IzLTdmM2UtNGU2NS04ZjgxLTA4NjcxN2U3MDEzNSIsInVzZXJsb2dpbiI6IkRldkFkbWluQGN5bGFuY2UuY29tIiwidXNlcmlkIjoiMTdjMjllNWEtNDczYi00MjYwLWEwMDMtNWNjOGViMzdhMjYxIiwiZ2hvc3R1c2VybmFtZSI6bnVsbCwidGVuYW50ZGVmYXVsdHN0eXBlIjowLCJzaGFyZGlkIjoxLCJyb2xlIjpbeyJuYW1lIjoibm90LWFkbWluaXN0cmF0b3IiLCJpc0N1c3RvbSI6dHJ1ZSwiem9uZWlkcyI6W10sInJiYWMiOnsiSW5zdGFsbGVyRG93bmxvYWQiOiJBbGwifX1dLCJqdGkiOiI0ZGIzMzQyNy02NDY4LTRmMGMtOTkzNS05NDcwYjE5MzExM2QiLCJpYXQiOjE1ODA0OTkwNDYsIm5iZiI6MTU4MDQ5OTA0NiwiZXhwIjoyNTgwNTAyNjQ2LCJpc3MiOiJjeWxhbmNlLmNvbSJ9.6p2Rl7t-Sqe_YnbcDZpa-0-1-H8La3GWKYhe8y0bUGI'
export const mockNoAdminNoPermissionToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRpZCI6IjZkZjVkM2IzLTdmM2UtNGU2NS04ZjgxLTA4NjcxN2U3MDEzNSIsInVzZXJsb2dpbiI6IkRldkFkbWluQGN5bGFuY2UuY29tIiwidXNlcmlkIjoiMTdjMjllNWEtNDczYi00MjYwLWEwMDMtNWNjOGViMzdhMjYxIiwiZ2hvc3R1c2VybmFtZSI6bnVsbCwidGVuYW50ZGVmYXVsdHN0eXBlIjowLCJzaGFyZGlkIjoxLCJyb2xlIjpbeyJuYW1lIjoibm90LWFkbWluaXN0cmF0b3IiLCJpc0N1c3RvbSI6ZmFsc2UsInpvbmVpZHMiOltdLCJyYmFjIjp7fX1dLCJqdGkiOiI0ZGIzMzQyNy02NDY4LTRmMGMtOTkzNS05NDcwYjE5MzExM2QiLCJpYXQiOjE1ODA0OTkwNDYsIm5iZiI6MTU4MDQ5OTA0NiwiZXhwIjoyNTgwNTAyNjQ2LCJpc3MiOiJjeWxhbmNlLmNvbSJ9.3bl1_4nWxGsxPw_qRad4gi4w42j65HEfqnPFfIE5U78'
// #endregion
