import { sharedlocators } from '../shared/globallistmobile'

const start = 'input[name="start"]'
const end = 'input[name="end"]'
const description = 'input[name="description"]'
const locators = {
  manuallyEnterIPAddressInfo() {
    return I.findByText(I.translate('mtd/common:exclusion.webAddresses.addManually'))
  },
  importIpFromCSVFile() {
    return I.findByText(I.translate('mtd/common:exclusion.webAddresses.addViaImport'))
  },
  addIpAddrModalTitle() {
    return I.findByRole('dialog', { timeout: 5000 }).findByRole('heading', {
      level: 2,
      name: I.translate('mtd/common:exclusion.webAddresses.addFormName'),
      timeout: 10000,
    })
  },
  editIpAddr() {
    return I.findByRole('dialog', { timeout: 10000 }).findByRole('heading', {
      level: 2,
      name: I.translate('mtd/common:exclusion.webAddresses.editFormName'),
      timeout: 10000,
    })
  },
}
export default {
  goToIpAddressSafeListPage() {
    I.visit('/uc/console#/settings/global-list/safe/ipAddresses')
    sharedlocators.addNewIpAddressBtn().isVisible()
  },
  goToIpAddressRestrictedListPage() {
    I.visit('/uc/console#/settings/global-list/restricted/ipAddresses')
    sharedlocators.addNewIpAddressBtn().isVisible()
  },
  openAddIpAddressesDialog() {
    sharedlocators.addNewIpAddressBtn().click()
    locators.manuallyEnterIPAddressInfo().isVisible()
    locators.importIpFromCSVFile().isVisible()
    locators.manuallyEnterIPAddressInfo().click()
  },
  checkIfAddIPAddressDialogIsVisible() {
    locators.addIpAddrModalTitle().isVisible()
    I.findByLocator(start).isVisible()
    I.findByLocator(end).isVisible()
    I.findByLocator(description).isVisible()
  },
  addIPAddressList(startIpAddress: string, endipAddress: string, desc: string) {
    this.checkIfAddIPAddressDialogIsVisible()
    I.findByLocator(start).as('startipAddress').fill(startIpAddress)
    I.findByLocator(end).as('endipAddress').fill(endipAddress)
    I.findByLocator(description).as('description').fill(desc)
    sharedlocators.addBtn().click()
    sharedlocators.addConfirmationAlertMsg().isVisible()
  },
  editIpAddressList(startIpAddressUpdated: string, endipAddressUpdated: string, descUpdated: string) {
    sharedlocators.saveBtn().isDisabled()
    I.findByLocator(start).as('startipAddress').fill(startIpAddressUpdated)
    I.findByLocator(end).as('endipAddress').fill(endipAddressUpdated)
    I.findByLocator(description).as('description').fill(descUpdated)
    sharedlocators.saveBtn().isEnabled()
    sharedlocators.saveBtn().click()
    sharedlocators.editConfirmationAlertMsg().isVisible()
  },
  clickCancelBtn() {
    sharedlocators.cancelBtn().click()
  },
  deleteIpAddressList(startIpAddress: string) {
    I.findByText(startIpAddress, { timeout: 30000 }).isVisible()
    I.findByRole('cell', { name: 'select-0' }).findByRole('checkbox').click()
    sharedlocators.deleteIpAddr().click()
    sharedlocators.deleteConfirmation().isVisible()
    sharedlocators.deleteModalBtn().click()
    sharedlocators.deleteConfirmationAlertMsg().isVisible()
  },
  openEditIpAddressDialog(startIpAddress: string) {
    I.findByText(startIpAddress, { timeout: 30000 }).click()
    locators.editIpAddr().isVisible()
  },
  assertIpAddressList(startIpAddress: string, endipAddress: string, description: string) {
    I.findByRole('dialog', { timeout: 5000 }).findByDisplayValue(startIpAddress).should('exist')
    I.findByRole('dialog', { timeout: 5000 }).findByDisplayValue(endipAddress).should('exist')
    I.findByRole('dialog', { timeout: 5000 }).findByDisplayValue(description).should('exist')
    sharedlocators.saveBtn().isDisabled()
    sharedlocators.cancelBtn().click()
  },
}
