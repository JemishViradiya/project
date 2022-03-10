/* eslint-env node, codeceptjs/codeceptjs, mocha */
/* eslint-disable no-unused-expressions */

import data from '../fixtures/endpointsrcipAddressList.json'
import endpointsrcipaddress from '../pages/endpointsrcipaddress/endpointsrcipaddress'

// const t = I.loadI18nNamespaces('bis/ues', 'mtd/common')
// currently disabled
xFeature('Endpoint Source IP Address')

Before(async ({ login }) => {
  await login('admin')
})
const testData = data.testConfig
Scenario('Add/Edit/Delete Safelist Endpoint Source IP Address', async () => {
  endpointsrcipaddress.goToIpAddressListPage('safe')
  endpointsrcipaddress.addIPAddress(testData.ipAddressName, testData.ipAddress)
  endpointsrcipaddress.assertIpAddressList(testData.ipAddressName, testData.ipAddress)
  endpointsrcipaddress.editIPAddress(testData.ipAddressName, testData.ipAddressNameUpdated, testData.ipAddressUpdated)
  endpointsrcipaddress.assertIpAddressList(testData.ipAddressNameUpdated, testData.ipAddressUpdated)
  endpointsrcipaddress.deleteIpAddress(testData.ipAddressNameUpdated)
})
  .tag('TestID=C104396529')
  .tag('EndpointSourceIPAddress')

Scenario('Add/Edit/Delete Restrictedlist Endpoint Source IP Address', async () => {
  endpointsrcipaddress.goToIpAddressListPage('restricted')
  endpointsrcipaddress.addIPAddress(testData.ipAddressName, testData.ipAddress)
  endpointsrcipaddress.assertIpAddressList(testData.ipAddressName, testData.ipAddress)
  endpointsrcipaddress.editIPAddress(testData.ipAddressName, testData.ipAddressNameUpdated, testData.ipAddressUpdated)
  endpointsrcipaddress.assertIpAddressList(testData.ipAddressNameUpdated, testData.ipAddressUpdated)
  endpointsrcipaddress.deleteIpAddress(testData.ipAddressNameUpdated)
})
  .tag('TestID=C104396530')
  .tag('EndpointSourceIPAddress')
