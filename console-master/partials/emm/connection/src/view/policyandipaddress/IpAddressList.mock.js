export const IpAddressListQueryMock = {
  getIpAddressList: {
    ipAddressListId: '1acfffb5-f450-4268-8db7-144e9f69645a',
    name: 'AdminAllowed',
    ipAddresses: [
      '11.1.1.1',
      '10.0.0.1',
      '192.168.1.1',
      '11.1.3.24',
      '12.1.21.24',
      '12.1.21.25',
      '15.1.21.5',
      '18.3.6.0/24',
      '15.21.12-67',
    ],
    isBlacklist: false,
    listType: 'vendor',
    vendorUrl: 'https://lists.blocklist.de/lists/all.txt',
  },
}

export const IpAddressListAddMutationMock = {
  addIpAddressList: { name: 'Test1', listType: 'user', vendorUrl: null, ipAddresses: ['192.168.1.1'], isBlacklist: false },
}

export const IpAddressListUpdateMutationMock = { data: { updateIpAddressList: '31b05dbd-be3d-4633-b536-7fc8ada0579f' } }

export const IpAddressListDeleteMutationMock = {
  deleteIpAddresses: { success: ['31b05dbd-be3d-4633-b536-7fc8ada0579f'], fail: [] },
}
