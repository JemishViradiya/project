/* eslint-env node, codeceptjs/codeceptjs, mocha */
/* eslint-disable no-unused-expressions */

import data from '../fixtures/ipAddressList.json'
import ipAddresslist from '../pages/ipaddressList/ipaddress'

const testData = data.testConfig
const t = I.loadI18nNamespaces('bis/ues', 'mtd/common')
Feature('IP Address')

Before(async ({ login }) => {
  await login('admin')
})

Scenario('Add/Edit/Delete Safelist IP Address', async () => {
  ipAddresslist.goToIpAddressSafeListPage()
  ipAddresslist.openAddIpAddressesDialog()
  ipAddresslist.addIPAddressList(testData.startIpAddress, testData.endIpAddress, testData.description)
  ipAddresslist.openEditIpAddressDialog(testData.startIpAddress)
  ipAddresslist.assertIpAddressList(testData.startIpAddress, testData.endIpAddress, testData.description)
  ipAddresslist.openEditIpAddressDialog(testData.startIpAddress)
  ipAddresslist.editIpAddressList(testData.startIpAddressUpdated, testData.endIpAddressUpdated, testData.descriptionUpdated)
  ipAddresslist.openEditIpAddressDialog(testData.startIpAddressUpdated)
  ipAddresslist.assertIpAddressList(testData.startIpAddressUpdated, testData.endIpAddressUpdated, testData.descriptionUpdated)
  ipAddresslist.deleteIpAddressList(testData.startIpAddressUpdated)
})
  .tag('TestID=C101266247')
  .tag('ipAddress')

Scenario('Add/Edit/Delete Restricted IP Address', async () => {
  ipAddresslist.goToIpAddressRestrictedListPage()
  ipAddresslist.openAddIpAddressesDialog()
  ipAddresslist.addIPAddressList(testData.startIpAddress, testData.endIpAddress, testData.description)
  ipAddresslist.openEditIpAddressDialog(testData.startIpAddress)
  ipAddresslist.assertIpAddressList(testData.startIpAddress, testData.endIpAddress, testData.description)
  ipAddresslist.openEditIpAddressDialog(testData.startIpAddress)
  ipAddresslist.editIpAddressList(testData.startIpAddressUpdated, testData.endIpAddressUpdated, testData.descriptionUpdated)
  ipAddresslist.openEditIpAddressDialog(testData.startIpAddressUpdated)
  ipAddresslist.assertIpAddressList(testData.startIpAddressUpdated, testData.endIpAddressUpdated, testData.descriptionUpdated)
  ipAddresslist.deleteIpAddressList(testData.startIpAddressUpdated)
})
  .tag('TestID=C104386709')
  .tag('ipAddress')
