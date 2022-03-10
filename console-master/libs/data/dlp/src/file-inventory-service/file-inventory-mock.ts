//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params, sonarjs/no-duplicate-string */

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { PageableSortableFileInventoryQueryParams } from '../types'
import { INFO_TYPES } from '../types'
import type FileInventoryInterface from './file-inventory-interface'
import type { FileInventoryBase, FileInventoryDetails, MetadataItem, UserDeviceCountsItem } from './file-inventory-types'

export const mockedFileInventoryList: FileInventoryBase[] = [
  {
    hash: 'd38cba4ec9054785988bbacc56b5587e',
    name: 'Product Planning.pptx',
    size: 789,
    infoTypes: [INFO_TYPES.FINANCE, INFO_TYPES.PRIVACY].map(item => item.toLocaleLowerCase()),
    policyGuids: ['138c20ca-566b-40cb-a110-e93581462dd1', '134504e3-3423-46bb-832e-a9c117847c62'],
    dataEntityGuids: ['138c20ca-566b-40cb-a110-e93581462dd1', '166a04e3-3423-46bb-832e-a9c117847c97'],
    dataEntitiesCount: 2,
    policiesCount: 2,
  },
  {
    hash: 'a327fca35c3541fabb4a05932c86aced',
    name: 'Quarterly Budget.xlsx',
    size: 1234,
    infoTypes: [INFO_TYPES.PRIVACY, INFO_TYPES.CUSTOM].map(item => item.toLocaleLowerCase()),
    policyGuids: ['134504e3-3423-46bb-832e-a9c117847c62', 'f9cc61d9-4f03-4921-9502-22743a5e580d'],
    dataEntityGuids: ['134504e3-3423-46bb-832e-a9c117847c62', 'f9cc61d9-4f03-4921-9502-22743a5e580d'],
    dataEntitiesCount: 2,
    policiesCount: 2,
  },
  {
    hash: '3c4afecf66f04cdcb1b4f2574ef53b45',
    name: 'Employee Comp.docx',
    size: 324,
    infoTypes: [INFO_TYPES.CUSTOM, INFO_TYPES.HEALTH].map(item => item.toLocaleLowerCase()),
    policyGuids: ['f9cc61d9-4f03-4921-9502-22743a5e580d', '134504e3-4921-46bb-9502-a9c117847c62'],
    dataEntityGuids: ['f9cc61d9-4f03-4921-9502-22743a5e580d', '134504e3-4921-46bb-9502-a9c117847c62'],
    dataEntitiesCount: 2,
    policiesCount: 2,
  },
]
export const mockedFileInventoryDetailsList = [
  {
    hash: 'd38cba4ec9054785988bbacc56b5587e',
    name: 'Product Planning.pptx',
    size: 789,
    type: '.pptx',
    policies: [{ guid: '138c20ca-566b-40cb-a110-e93581462dd1' }, { guid: '134504e3-3423-46bb-832e-a9c117847c62' }],
    dataEntities: [
      { guid: '138c20ca-566b-40cb-a110-e93581462dd1', occurrences: 2 },
      { guid: '166a04e3-3423-46bb-832e-a9c117847c97', occurrences: 3 },
    ],
  },
  {
    hash: 'a327fca35c3541fabb4a05932c86aced',
    name: 'Quarterly Budget.xlsx',
    size: 1234,
    type: '.xlsx',
    policies: [{ guid: '134504e3-3423-46bb-832e-a9c117847c62' }, { guid: 'f9cc61d9-4f03-4921-9502-22743a5e580d' }],
    dataEntities: [
      { guid: '134504e3-3423-46bb-832e-a9c117847c62', occurrences: 3 },
      { guid: 'f9cc61d9-4f03-4921-9502-22743a5e580d', occurrences: 4 },
    ],
  },
  {
    hash: '3c4afecf66f04cdcb1b4f2574ef53b45',
    name: 'Employee Comp.docx',
    size: 324,
    type: '.docx',
    policies: [{ guid: 'f9cc61d9-4f03-4921-9502-22743a5e580d' }, { guid: '134504e3-4921-46bb-9502-a9c117847c62' }],
    dataEntities: [
      { guid: 'f9cc61d9-4f03-4921-9502-22743a5e580d', occurrences: 5 },
      { guid: '134504e3-4921-46bb-9502-a9c117847c62', occurrences: 2 },
    ],
  },
]

export const FileInventoryResponse = (
  params?: PageableSortableFileInventoryQueryParams<FileInventoryBase>,
): PagableResponse<FileInventoryBase> => ({
  totals: {
    pages: 1,
    elements: mockedFileInventoryList.length,
  },
  count: mockedFileInventoryList.length,
  elements: params ? mockedFileInventoryList.slice(0, params?.offset) : mockedFileInventoryList,
})

export const UserDevicesListMock = {
  d38cba4ec9054785988bbacc56b5587e: {
    userCount: 3,
    deviceCount: 4,
  },
  a327fca35c3541fabb4a05932c86aced: {
    userCount: 1,
    deviceCount: 2,
  },
  bc4afecf66f04cdcb1b4f2574ef53b45: {
    userCount: 5,
    deviceCount: 5,
  },
}

export const MetadataListMock = {
  d38cba4ec9054785988bbacc56b5587e: {
    filename: '572c2f964d6c20b54979dabb5bd64cd117ef9f0ec3d7fe9ffc681ed15c6d2f7c.docx.gz',
    createdby: 'oshch',
    lastmodified: '10/01/2021 16:47:07',
    lastuploadeddate: '2021-10-01 11:36:23',
  },
  f0fda58630310a6dd91a7d8f0a4ceda2: {
    filename: 'd6c20b54979dabb5bd64cd117ef9f0ec3d7fe9ffc681ed15c6d2f7c.docx.gz',
    createdby: 'oshch22',
    lastmodified: '10/10/2021 16:47:08',
    lastuploadeddate: '2021-10-10 11:36:24',
  },
  a327fca35c3541fabb4a05932c86aced: {
    filename: '572c2d6c20b54979dabb5bd64ec3d7fe9ffc681ed6c20b54979dabb5bd646d2f7c.docx.gz',
    createdby: 'oshch33',
    lastmodified: '10/01/2021 16:47:09',
    lastuploadeddate: '2021-10-01 11:36:24',
  },
}

export const UserDevicesCountsResponse = hashes => {
  const resultObj = {}
  hashes?.map(hash => UserDevicesListMock[hash] && (resultObj[hash] = UserDevicesListMock[hash]))
  return resultObj
}

export const MetaResponse = hashes => {
  const resultObj = {}
  hashes?.map(hash => MetadataListMock[hash] && (resultObj[hash] = MetadataListMock[hash]))
  return resultObj
}

class FileInventoryMockClass implements FileInventoryInterface {
  readAll(
    params?: PageableSortableFileInventoryQueryParams<FileInventoryBase>,
  ): Response<PagableResponse<FileInventoryBase> | Partial<PagableResponse<FileInventoryBase>>> {
    return Promise.resolve({ data: FileInventoryResponse() })
  }

  readUserAndDeviceCounts(hashes: string[]): Response<UserDeviceCountsItem | Partial<UserDeviceCountsItem>> {
    return Promise.resolve({ data: UserDevicesCountsResponse(hashes) })
  }

  readMetadata(hashes: string[]): Response<MetadataItem | Partial<MetadataItem>> {
    return Promise.resolve({ data: MetaResponse(hashes) })
  }

  read(fileHash: string): Response<FileInventoryDetails | Partial<FileInventoryDetails>> {
    return Promise.resolve({ data: mockedFileInventoryDetailsList.find(i => i.hash === fileHash) })
  }
}

const FileInventoryMockApi = new FileInventoryMockClass()

export { FileInventoryMockApi }
