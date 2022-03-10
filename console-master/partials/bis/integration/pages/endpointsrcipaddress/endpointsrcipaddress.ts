import { sharedlocators } from '../shared/globallistmobile'

let currType = ''
const locators = {
  addEndpointIPModalTitle() {
    if (currType === 'safe')
      return I.findByRole('dialog', { timeout: 5000 }).findByText(
        I.translate('bis/ues:settings.ipaddresses.trustedAddModalLabel'),
        { timeout: 10000 },
      )
    else
      return I.findByRole('dialog', { timeout: 5000 }).findByText(
        I.translate('bis/ues:settings.ipaddresses.untrustedAddModalLabel'),
        { timeout: 10000 },
      )
  },
  editEndpointIPModalTitle() {
    if (currType === 'safe')
      return I.findByRole('dialog', { timeout: 5000 }).findByText(
        I.translate('bis/ues:settings.ipaddresses.trustedEditModalLabel'),
        {
          timeout: 10000,
        },
      )
    else
      return I.findByRole('dialog', { timeout: 5000 }).findByText(
        I.translate('bis/ues:settings.ipaddresses.untrustedEditModalLabel'),
        { timeout: 10000 },
      )
  },
  ipAddressListName() {
    return I.findByRole('textbox', { name: 'Name', timeout: 10000 })
  },
  ipAddressListValue() {
    return I.findByRole('textbox', { name: 'IP addresses, IP ranges or CIDRs', timeout: 10000 })
  },
}
export default {
  goToIpAddressListPage(type: string) {
    if (type === 'safe') I.visit('/uc/console#/settings/global-list/safe/endpoint-source-ip-address')
    else if (type === 'restricted') I.visit('/uc/console#/settings/global-list/restricted/endpoint-source-ip-address')
    currType = type
    sharedlocators.addNewIpAddressBtn().isVisible()
  },
  addIPAddress(name: string, value: string) {
    sharedlocators.addNewIpAddressBtn().click()
    locators.addEndpointIPModalTitle().isVisible()
    sharedlocators.cancelBtn().isEnabled()
    sharedlocators.saveBtn().isDisabled()
    locators.ipAddressListName().fill(name)
    locators.ipAddressListValue().fill(value)
    sharedlocators.saveBtn().isEnabled()
    sharedlocators.saveBtn().click()
    I.findByDisplayValue(name, { timeout: 10000 }).isVisible()
  },
  assertIpAddressList(name: string, value: string) {
    I.findByText(name).click()
    locators.editEndpointIPModalTitle().isVisible()
    I.findByRole('dialog', { timeout: 5000 }).findByDisplayValue(name).should('exist')
    I.findByRole('dialog', { timeout: 5000 }).findByDisplayValue(value).should('exist')
    sharedlocators.cancelBtn().isEnabled()
    sharedlocators.saveBtn().isDisabled()
    sharedlocators.cancelBtn().click()
    I.findByRole('dialog').should('not.exist')
  },
  editIPAddress(existingname: string, updatedname: string, updatedvalue: string) {
    I.findByText(existingname, { timeout: 5000 }).click()
    locators.editEndpointIPModalTitle().isVisible()
    sharedlocators.cancelBtn().isEnabled()
    sharedlocators.saveBtn().isDisabled()
    locators.ipAddressListName().fill(updatedname)
    locators.ipAddressListValue().fill(updatedvalue)
    sharedlocators.saveBtn().isEnabled()
    sharedlocators.saveBtn().click()
    I.findByText(updatedname, { timeout: 5000 }).isVisible()
  },

  selectIPAddressList(name: string) {
    const chkboxName = 'Select row for ' + name + '.'
    return I.findByRole('checkbox', { name: chkboxName, timeout: 10000 }).click()
  },

  deleteIpAddress(name: string) {
    this.selectIPAddressList(name)
    sharedlocators.deleteIpAddr().isVisible()
    sharedlocators.deleteIpAddr().click()
    sharedlocators.deleteConfirmation().isVisible()
    sharedlocators.deleteModalBtn().click()
    I.findByRole('dialog', { name: 'Delete confirmation' }).should('not.exist')
    I.findByDisplayValue(name, { timeout: 10000 }).should('not.exist')
  },
}
