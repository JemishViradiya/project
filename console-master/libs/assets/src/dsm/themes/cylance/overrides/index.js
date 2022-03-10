export const create = (overrides, theme) => {
  const output = {}
  for (const key of Object.keys(overrides)) {
    if (key === 'create') {
      continue
    }
    const value = overrides[key]
    output[key] = typeof value === 'function' ? value(theme) : value
  }
  return output
}

export * from './MuiResponsiveDrawer'

export { default as MuiAccordion } from './MuiAccordion'
export { default as MuiAccordionDetails } from './MuiAccordionDetails'
export { default as MuiAccordionSummary } from './MuiAccordionSummary'

export { default as MuiAlert } from './MuiAlert'

export { default as MuiAppBar } from './MuiAppBar'
export { default as MuiAutocomplete } from './MuiAutocomplete'
export { default as MuiButton } from './MuiButton'
export { default as MuiButtonGroup } from './MuiButtonGroup'
export { default as MuiCard } from './MuiCard'
export { default as MuiCardContent } from './MuiCardContent'
export { default as MuiCardHeader } from './MuiCardHeader'
export { default as MuiCheckbox } from './MuiCheckbox'
export { default as MuiChip } from './MuiChip'
export { default as MuiCssBaseline } from './MuiCssBaseline'
export { default as MuiDataGrid } from './MuiDataGrid'
export { default as MuiDialogActions } from './MuiDialogActions'
export { default as MuiDialogContent } from './MuiDialogContent'
export { default as MuiDialogTitle } from './MuiDialogTitle'
export { default as MuiExpansionPanel } from './MuiExpansionPanel'
export { default as MuiExpansionPanelDetails } from './MuiExpansionPanelDetails'
export { default as MuiExpansionPanelSummary } from './MuiExpansionPanelSummary'
export { default as MuiFab } from './MuiFab'
export { default as MuiFilledInput } from './MuiFilledInput'
export { default as MuiFormHelperText } from './MuiFormHelperText'
export { default as MuiFormControl } from './MuiFormControl'
export { default as MuiFormGroup } from './MuiFormGroup'
export { default as MuiFormLabel } from './MuiFormLabel'
export { default as MuiInputBase } from './MuiInputBase'
export { default as MuiIconButton } from './MuiIconButton'
export { default as MuiInputLabel } from './MuiInputLabel'
export { default as MuiLink } from './MuiLink'
export { default as MuiListItem } from './MuiListItem'
export { default as MuiListItemIcon } from './MuiListItemIcon'
export { default as MuiMenu } from './MuiMenu'
export { default as MuiPagination } from './MuiPagination'
export { default as MuiPaper } from './MuiPaper'
export { default as MuiPickersClock } from './MuiPickersClock'
export { default as MuiPickersClockPointer } from './MuiPickersClockPointer'
export { default as MuiPickersDay } from './MuiPickersDay'
export { default as MuiPickersToolbar } from './MuiPickersToolbar'
export { default as MuiPopover } from './MuiPopover'
export { default as MuiRadio } from './MuiRadio'
export { default as MuiSnackbar } from './MuiSnackbar'
export { default as MuiSvgIcon } from './MuiSvgIcon'
export { default as MuiStepIcon } from './MuiStepIcon'
export { default as MuiStepper } from './MuiStepper'
export { default as MuiSwitch } from './MuiSwitch'
export { default as MuiTab } from './MuiTab'
export { default as MuiTable } from './MuiTable'
export { default as MuiTableBody } from './MuiTableBody'
export { default as MuiTableCell } from './MuiTableCell'
export { default as MuiTablePagination } from './MuiTablePagination'
export { default as MuiTableRow } from './MuiTableRow'
export { default as MuiTabs } from './MuiTabs'
export { default as MuiTextField } from './MuiTextField'
export { default as MuiTypography } from './MuiTypography'
export { default as MuiLinearProgress } from './MuiLinearProgress'
export { default as PrivateTabIndicator } from './PrivateTabIndicator'
export { default as MuiTooltip } from './MuiTooltip'
export { default as MuiSelect } from './MuiSelect'
export { default as MuiTableSortLabel } from './MuiTableSortLabel'
