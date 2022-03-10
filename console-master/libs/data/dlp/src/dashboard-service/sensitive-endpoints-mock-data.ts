import { SensitiveFilesReportCategory } from './dashboard-types'

export const sensitiveEndpointsMockData = [
  {
    key: SensitiveFilesReportCategory.POLICY,
    items: [
      {
        item: '138c20ca-566b-40cb-a110-e93581462dd1',
        count: 15,
      },
      {
        item: '134504e3-3423-46bb-832e-a9c117847c62',
        count: 13,
      },
      {
        item: 'f9cc61d9-4f03-4921-9502-22743a5e580d',
        count: 10,
      },
    ],
  },
  {
    key: SensitiveFilesReportCategory.FILE_TYPE,
    items: [
      {
        item: '.xlsx',
        count: 95,
      },
      {
        item: '.dat',
        count: 89,
      },
      {
        item: '.tmp',
        count: 77,
      },
      {
        item: '.css',
        count: 55,
      },
      {
        item: '.html',
        count: 45,
      },
      {
        item: '.mp3',
        count: 18,
      },
    ],
  },
  {
    key: SensitiveFilesReportCategory.INFO_TYPE,
    items: [
      {
        item: 'finance',
        count: 55,
      },
      {
        item: 'custom',
        count: 44,
      },
      {
        item: 'health',
        count: 20,
      },
      {
        item: 'privacy',
        count: 13,
      },
    ],
  },
  {
    key: SensitiveFilesReportCategory.DATA_ENTITY,
    items: [
      {
        item: '138c20ca-566b-40cb-a110-e93581462dd1',
        count: 10,
      },
      {
        item: '134504e3-3423-46bb-832e-a9c117847c62',
        count: 9,
      },
      {
        item: 'f9cc61d9-4f03-4921-9502-22743a5e580d',
        count: 15,
      },
    ],
  },
]
