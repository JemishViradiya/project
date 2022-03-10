/* eslint-disable sonarjs/no-duplicate-string */

export class addIntuneAppConfigPolicies {
  getAddGenerateConfigHeading() {
    return I.findAllByRole('heading', { name: I.translate('emm.appConfig.heading') })
  }

  getAddGenerateConfigDescription() {
    return I.findByText(I.translate('emm.appConfig.description'))
  }

  getAndroidSwitchButton() {
    return I.findByRole('checkbox', { name: I.translate('emm.appConfig.androidCheckBoxLabel') })
  }

  getIosSwitchButtonLabel() {
    return this.getIosSwitchButton().parents('label').findByText(I.translate('emm.appConfig.iosCheckBoxLabel'))
  }

  getAndroidSwitchButtonLabel() {
    return this.getAndroidSwitchButton().parents('label').findByText(I.translate('emm.appConfig.androidCheckBoxLabel'))
  }

  getIosSwitchButton() {
    return I.findByRole('checkbox', { name: I.translate('emm.appConfig.iosCheckBoxLabel') })
  }

  getAndroidNameTextBox() {
    return this.getAndroidSwitchButton()
      .parents('label')
      .next()
      .findByRole('textbox', { name: I.translate('emm.appConfig.androidAppName') })
  }

  getAndroidTargetedNameTextBox() {
    return this.getAndroidSwitchButton()
      .parents('label')
      .parent()
      .findByRole('textbox', { name: I.translate('emm.appConfig.androidTargetedApp') })
  }

  getIosNameTextBox() {
    return this.getIosSwitchButton()
      .parents('label')
      .next()
      .findByRole('textbox', { name: I.translate('emm.appConfig.iosAppName') })
  }

  getIosTargetedNameTextBox() {
    return this.getIosSwitchButton()
      .parents('label')
      .parent()
      .findByRole('textbox', { name: I.translate('emm.appConfig.iosTargetedApp') })
  }

  getSuccessAlert() {
    return I.findByRole('alert').findByText(I.translate('emm.appConfig.success'))
  }

  getFailureAlert() {
    return I.findByRole('alert').findByText(I.translate('server.error.intune.addAppConfig.4010'))
  }

  getErrorOnEmptyAndroidNameTextBox() {
    return this.getAndroidNameTextBox().parent().parent().findByText(I.translate('emm.validation.emptyField'))
  }

  getErrorOnEmptyAndroidTargetedNameTextBox() {
    return this.getAndroidTargetedNameTextBox().parent().parent().findByText(I.translate('emm.validation.emptyField'))
  }

  getErrorOnEmptyIosNameTextBox() {
    return this.getIosNameTextBox().parent().parent().findByText(I.translate('emm.validation.emptyField'))
  }

  getErrorOnEmptyIosTargetedNameTextBox() {
    return this.getIosTargetedNameTextBox().parent().parent().findByText(I.translate('emm.validation.emptyField'))
  }
  getGroupAssignmentTitleForIos() {
    return this.getIosSwitchButton()
      .parents('label')
      .parent()
      .findAllByRole('heading', { name: I.translate('emm.appConfig.groupAssignmentTitle') })
  }
  getIosAllGroupsButton() {
    return this.getIosSwitchButton()
      .parents('label')
      .parent()
      .findByRole('checkbox', { name: I.translate('emm.appConfig.groupSwitchTitle') })
  }
  getIosAllGroupsButtonText() {
    return this.getIosSwitchButton().parents('label').parent().findByText(I.translate('emm.appConfig.groupSwitchTitle'))
  }
  getIosTableHeader() {
    return this.getIosSwitchButton()
      .parents('label')
      .parent()
      .findByRole('columnheader', { name: I.translate('emm.appConfig.table.group') })
  }
  getIosTableHeaderPlusButton() {
    return this.getIosSwitchButton().parents('label').parent().findAllByRole('columnheader').eq(1).findByRole('button')
  }
  getIosTableNoDataMessage() {
    return this.getIosSwitchButton()
      .parents('label')
      .parent()
      .findByRole('cell', { name: I.translate('noItem') })
  }
  getGroupAssignmentTitleForAndroid() {
    return this.getAndroidSwitchButton()
      .parents('label')
      .parent()
      .findAllByRole('heading', { name: I.translate('emm.appConfig.groupAssignmentTitle') })
  }
  getAndroidAllGroupsButton() {
    return this.getAndroidSwitchButton()
      .parents('label')
      .parent()
      .findByRole('checkbox', { name: I.translate('emm.appConfig.groupSwitchTitle') })
  }
  getAndroidAllGroupsButtonText() {
    return this.getAndroidSwitchButton().parents('label').parent().findByText(I.translate('emm.appConfig.groupSwitchTitle'))
  }
  getAndroidTableHeader() {
    return this.getAndroidSwitchButton()
      .parents('label')
      .parent()
      .findByRole('columnheader', { name: I.translate('emm.appConfig.table.group') })
  }
  getAndroidTableHeaderPlusButton() {
    return this.getAndroidSwitchButton().parents('label').parent().findAllByRole('columnheader').eq(1).findByRole('button')
  }
  getAndroidTableNoDataMessage() {
    return this.getAndroidSwitchButton()
      .parents('label')
      .parent()
      .findByRole('cell', { name: I.translate('noItem') })
  }
  getGroupsDailogBox() {
    return I.findByRole('dialog')
  }
  getGroupsDailogBoxCrossButton() {
    return this.getGroupsDailogBoxHeading().parent().findByRole('button')
  }
  getGroupsDailogBoxHeading() {
    return I.findByRoleWithin('dialog', 'heading', { name: I.translate('emm.appConfig.groupAssignment.title') })
  }
  getGroupsDailogBoxDescriptionText() {
    return I.findByText(I.translate('emm.appConfig.groupAssignment.description'))
  }
  getGroupsDailogBoxSearchBox() {
    return I.findByRoleWithin('dialog', 'textbox')
  }
  getGroupsDailogBoxSearchButton() {
    return this.getGroupsDailogBoxSearchBox().next().findByRole('button')
  }
  getGroupsDailogBoxSearchBoxLabelText() {
    return this.getGroupsDailogBoxSearchBox()
      .parent()
      .parent()
      .findByLabelText(I.translate('emm.appConfig.groupAssignment.searchText'))
  }
  getSelectedGroupsInDailogBox(groupName) {
    return this.getGroupsDailogBoxSearchBox().parent().parent().next().findByRole('button', { name: groupName })
  }
  getCrossButtonForSelectedGroupInDailogBox(groupName) {
    return this.getSelectedGroupsInDailogBox(groupName).children().eq(1)
  }
  getGroupsDailogBoxCancelButton() {
    return I.findByRoleWithin('dialog', 'button', { name: I.translate('emm.appConfig.groupAssignment.cancelButton') })
  }
  getGroupsDailogBoxAddButton() {
    return I.findByRoleWithin('dialog', 'button', { name: I.translate('emm.appConfig.groupAssignment.addButton') })
  }
  getGroupsDailogBoxList() {
    return I.findByRoleWithin('dialog', 'list')
  }
  getGroupsDailogBoxGroupName(groupName: string) {
    return this.getGroupsDailogBoxList().findByRole('button', { name: groupName })
  }
  getGroupsDailogBoxGroupCheckBox(groupName: string) {
    return this.getGroupsDailogBoxList().findByRole('checkbox', { name: groupName })
  }
  getGroupsDailogBoxNoResultsText() {
    return this.getGroupsDailogBoxList().findByText(I.translate('emm.appConfig.groupAssignment.list.noResults'))
  }
  getIosSelectedGroup(groupName: string) {
    return this.getIosSwitchButton().parents('label').parent().findByRole('cell', { name: groupName })
  }
  getIosSelectedGroupDeleteButton(groupName: string) {
    return this.getIosSelectedGroup(groupName).next().findByRole('button')
  }
  getAndroidSelectedGroup(groupName: string) {
    return this.getAndroidSwitchButton().parents('label').parent().findByRole('cell', { name: groupName })
  }
  getAndroidSelectedGroupDeleteButton(groupName: string) {
    return this.getAndroidSelectedGroup(groupName).next().findByRole('button')
  }
  getFailureAlertForMessage(msg: string) {
    return I.findByRole('alert').findByText(msg)
  }
  getAndroidTextBoxHidden() {
    return I.findByRole('checkbox', { name: I.translate('emm.appConfig.androidCheckBoxLabel') })
      .parents('label')
      .next()
  }
  getIOSTextBoxHidden() {
    return I.findByRole('checkbox', { name: I.translate('emm.appConfig.iosCheckBoxLabel') })
      .parents('label')
      .next()
  }
  getDefaultErrorMessage() {
    return I.findByText(I.translate('emm.appConfig.error.loadGroup'))
  }
  getErrorForLengthyString() {
    return I.findByText(I.translate('server.error.intune.addAppConfig.11019'))
  }
}
