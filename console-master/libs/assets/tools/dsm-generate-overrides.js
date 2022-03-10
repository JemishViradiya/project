/* eslint-disable @typescript-eslint/no-var-requires */
const dsm = require('../src/dsm/themes/ues/manual_dsm_extraction')
const prettier = require('prettier')
const templates = require('../src/dsm/themes/ues/templates')
const path = require('path')
const fs = require('fs')

const output = '../../libs/assets/src/dsm/themes/ues/overrides/'

const prettierConfig = fs.readFileSync('../../.prettierrc', {
  encoding: 'utf-8',
})

const components = {
  'MuiButton.js': templates.muiButtonTemplate(dsm),
  'MuiButtonGroup.js': templates.muiButtonGroupTemplate(dsm),
  'MuiCheckbox.js': templates.muiCheckboxTemplate(dsm),
  'MuiChip.js': templates.muiChipTemplate(dsm),
  'MuiDialogActions.js': templates.muiDialogActionsTemplate(dsm),
  'MuiDialogContent.js': templates.muiDialogContentTemplate(dsm),
  'MuiDialogTitle.js': templates.muiDialogTitleTemplate(dsm),
  'MuiFormHelperText.js': templates.muiFormHelperTextTemplate(dsm),
  'MuiFormLabel.js': templates.muiFormLabelTemplate(dsm),
  'MuiIconButton.js': templates.muiIconButtonTemplate(dsm),
  'MuiInputBase.js': templates.muiInputBaseTemplate(dsm),
  'MuiInputLabel.js': templates.muiInputLabelTemplate(dsm),
  'MuiLinearProgress.js': templates.muiLinearProgressTemplate(dsm),
  'MuiLink.js': templates.muiLinkTemplate(dsm),
  'MuiMenu.js': templates.muiMenuTemplate(dsm),
  'MuiOutlinedInput.js': templates.muiOutlinedInputTemplate(dsm),
  'MuiRadio.js': templates.muiRadioTemplate(dsm),
  'MuiSwitch.js': templates.muiSwitchTemplate(dsm),
  'MuiSelect.js': templates.muiSelectTemplate(dsm),
  'MuiTab.js': templates.muiTabTemplate(dsm),
  'MuiTableBody.js': templates.muiTableBodyTemplate(dsm),
  'MuiTableCell.js': templates.muiTableCellTemplate(dsm),
  'MuiTableRow.js': templates.muiTableRowTemplate(dsm),
  'MuiTabs.js': templates.muiTabsTemplate(dsm),
  'MuiTextField.js': templates.muiTextFieldTemplate(dsm),
  'MuiTypography.js': templates.muiTypographyTemplate(dsm),
}

for (const [fileName, jsModule] of Object.entries(components)) {
  const filePath = path.join(output, fileName)
  process.stdout.write('Writing to ' + filePath + '... ')
  fs.writeFileSync(filePath, prettier.format(jsModule, { filepath: filePath, ...prettierConfig }))
  process.stdout.write('done\n')
}
