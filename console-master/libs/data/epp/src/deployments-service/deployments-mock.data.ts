import type {
  BuildVersions,
  DownloadUrlResponse,
  OsFamilyResponse,
  PackagesResponse,
  Product,
  ProductVersionsItem,
  StrategiesListItem,
  UpdateRule,
} from './deployments-types'

export const ProductsMock: Product[] = [
  {
    name: 'CylancePROTECT',
    value: 'Protect',
  },
  {
    name: 'CylanceOPTICS',
    value: 'Optics',
  },
  {
    name: 'CylanceHYBRID',
    value: 'Hybrid',
  },
]

export const OsFamiliesMock: OsFamilyResponse = {
  osFamily: [
    {
      name: 'Ubuntu 16.04',
      value: 'Ubuntu1604',
    },
    {
      name: 'CentOS 7',
      value: 'CentOs7',
    },
    {
      name: 'MacOSX',
      value: 'MacOSX',
    },
    {
      name: 'Windows 8',
      value: 'Windows8',
    },
    {
      name: 'Windows 10',
      value: 'Windows10',
    },
  ],
}

export const BuildVersionsMock: BuildVersions = { versions: ['1.0.0', '2.0.0', '2.0.1'] }

export const ProductsVersionsMock: ProductVersionsItem = { product: 'Protect', versions: ['1.0.0', '2.0.0', '2.0.1'] }

export const ProtectVersionsMock: ProductVersionsItem = { product: 'Protect', versions: ['1.0.0', '1.4.2', '2.0.0'] }

export const PersonaVersionsMock: ProductVersionsItem = { product: 'Persona', versions: ['1.0.0'] }

export const OpticsVersionsMock: ProductVersionsItem = {
  product: 'Optics',
  versions: ['1.1.1', '2.3.2001', '4.21.1', '4.3.55', '4.8.6', '5.0.0', '5.1.0'],
}

export const StrategiesMock: StrategiesListItem[] = [
  {
    updateStrategyId: '5A134EEC001248E182A0DA8F53CD1C3A',
    tenantId: '5A134EEC001248E182A0DA8F53CD1C3A',
    name: 'CylancePROTECT_Do not update',
    description: 'Strategy description goes here',
    strategies: [
      {
        productName: 'Protect',
        strategyType: 'DoNotUpdate',
        version: '1.4.2',
        errors: ['CylanceOPTICS product version is no longer supported.'],
      },
      {
        productName: 'Optics',
        strategyType: 'Fixed',
        version: '2.3.2001',
        errors: [],
      },
    ],
    errors: [],
    modifiedBy: '',
    created: '2020-02-27T21:28:48.663Z',
    modified: '2020-02-27T21:28:49.663Z',
  },
  {
    updateStrategyId: 'F15EA913AD264DAB9EF331EC0F54E463',
    tenantId: 'F15EA913AD264DAB9EF331EC0F54E463',
    name: 'CylancePROTECT_Auto-update',
    description: 'Strategy description for Autoupdate goes here',
    strategies: [
      {
        productName: 'Optics',
        strategyType: 'AutoUpdate',
        version: '1.1.1',
        errors: [],
      },
    ],
    errors: [],
    modifiedBy: '',
    created: '2020-02-27T21:28:50.663Z',
    modified: '2020-02-27T21:28:51.663Z',
  },
]

export const UpdateRulesMock: UpdateRule[] = [
  {
    id: 1,
    name: 'Test',
    zones: ['zone1', 'zone2', 'zone3'],
    strategy: 'Auto Update',
    description: 'An update rule called Test',
  },
  {
    id: 2,
    name: 'Pilot',
    zones: ['zone5', 'zone42', 'zone99', 'zone999'],
    strategy: 'CylancePROTECT_Do not update1',
    description: 'An update rule called Pilot',
  },
  {
    id: 3,
    name: 'Production (Default)',
    zones: ['zone7'],
    strategy: 'CylancePROTECT_Do not update2',
    description: 'An update rule called Production (Default)',
  },
]

export const DownloadUrlMock: DownloadUrlResponse = {
  url:
    'https://download.cylance.com/updates/CylanceProtectInstaller/test/2.0.1450.8/CylanceProtectSetup.exe?AWSAccessKeyId=AKIAIF4SHQYKSDGNB46Q&Expires=1578093205&Signature=0DrUuZDJbMk2lAVD56oabDwwfdo%3D',
}

export const mockCreateUpdateStrategy = ({
  name = '',
  description = '',
  strategies = [],
  currentTimestamp = new Date().toISOString(),
}): StrategiesListItem => ({
  updateStrategyId: '5A134EEC001248E182A0DA8F53CD1C3A',
  tenantId: '5A134EEC001248E182A0DA8F53CD1C3A',
  name,
  description,
  strategies,
  created: currentTimestamp,
  modified: currentTimestamp,
})

export const PackagesMock: PackagesResponse = {
  packages: {
    exe: 'Windows',
    'x86|msi': 'Windows',
    'x64|msi': 'Windows',
  },
}
