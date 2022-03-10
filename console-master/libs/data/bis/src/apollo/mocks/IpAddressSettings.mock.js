export const IpAddressSettingsQueryMock = {
  ipAddressSettings: [
    {
      id: '1acfffb5-f450-4268-8db7-144e9f69645a',
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
    {
      id: '1874e13b-4548-4c9e-af23-e6d8712bca83',
      name: 'UnlockedIp',
      ipAddresses: ['15.1.21.5', '18.3.6.0/24', '15.21.12-67'],
      isBlacklist: false,
      listType: 'user',
      vendorUrl: null,
    },
    {
      id: '2736ddfd-da91-466e-bf1d-7117f3ed45ee',
      name: 'Whitelisted IPs',
      ipAddresses: ['192.168.1.112'],
      isBlacklist: false,
      listType: 'user',
      vendorUrl: null,
    },
  ],
}
