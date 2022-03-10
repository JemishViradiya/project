//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params, sonarjs/no-duplicate-string */

import { v4 as uuidv4 } from 'uuid'

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { DataEntity, PageableSortableQueryParams } from '../types'
import { DATA_TYPES, INFO_TYPES, REGION } from '../types'
import type DataEntitiesInterface from './data-entity-interface'

const is = 'DataEntitiesClass'

const random = Math.random()

const DataTypesNames = [
  { name: 'Credit Card Number', description: 'A credit card number is 12 to 19 digits long' },
  { name: 'U.S. Bank Account Number', description: 'U.S. Bank Account Number' },
  { name: 'U.S. ITIN', description: 'U.S. ITIN' },
  { name: 'U.S. SSN', description: 'U.S. SSN' },
  { name: 'DEA Number', description: 'DEA Number' },
  { name: 'ICD-9-CM', description: 'ICD-9-CM' },
  { name: 'ICD-10-CM', description: 'ICD-10-CM' },
  { name: 'ABA Routing Number', description: 'ABA Routing Number' },
  { name: 'EU Debit Card Number', description: 'EU Debit Card Number' },
  { name: "EU Driver's License Number", description: "EU Driver's License Number" },
  { name: 'EU National Identification Number', description: 'EU National Identification Number' },
  { name: 'EU Passport Number', description: 'EU Passport Number' },
  { name: 'Canada Bank Account Number', description: 'Canada Bank Account Number' },
  { name: 'Canada Passport Number', description: 'Canada Passport Number' },
  { name: "Canada Driver's License Number", description: "Canada Driver's License Number" },
]

let namesIndex = 0
let descriptionsIndex = 0
let dataTypesRegionsIndex = 0
let dataTypesInfoIndex = 0

const getDataTypesNames = (prop: string, index: number) => {
  // Display all of data types names and descriptions from array of objects
  if (index < DataTypesNames.length) {
    return DataTypesNames[index][prop]
  }
}

const getDataTypeFields = (currType: any, index: number) => {
  switch (currType) {
    case REGION:
      if (index >= Object.values(REGION).length - 1) {
        dataTypesRegionsIndex = 0
      }
      return Object.values(REGION)[index]
    case INFO_TYPES:
      if (index >= Object.values(INFO_TYPES).length - 1) {
        dataTypesInfoIndex = 0
      }
      return Object.values(INFO_TYPES)[index]
    default:
      return ''
  }
}

export const DefaultDataEntity = (guid: string, templatesIndex = null): DataEntity => ({
  guid: guid,
  name: getDataTypesNames('name', templatesIndex || templatesIndex === 0 ? templatesIndex : namesIndex++),
  algorithm: 'expression',
  parameters: { Regex: '\\d+-\\d+, [a-z]' },
  description: getDataTypesNames('description', templatesIndex || templatesIndex === 0 ? templatesIndex : descriptionsIndex++),
  type: DATA_TYPES.CUSTOM,
  regions: getDataTypeFields(REGION, dataTypesRegionsIndex++),
  infoTypes: getDataTypeFields(INFO_TYPES, dataTypesInfoIndex++),
  created: '2021-02-16T09:07:44Z',
  updated: '2021-02-16T09:07:44Z',
})

export const mockedDataEntities: DataEntity[] = [
  DefaultDataEntity('0a68bd67-6fd0-4e38-8045-766e7abe3e10'),
  DefaultDataEntity('9226ad27-95ca-4544-8d33-2d8a28ebfe37'),
  DefaultDataEntity('cf3b05c1-d464-4d07-b5e4-286917a7016f'),
  DefaultDataEntity('8c59fcbd-6def-4306-bfe8-32b57b8a3ccd'),
  DefaultDataEntity('6f943b1f-39e3-4aa3-875b-96f3790b0be0'),
  DefaultDataEntity('dac363fa-a3ef-4fe0-a3ab-08cbfb9a8cc5'),
  DefaultDataEntity('2db87d24-e6a0-4771-b6f2-6efaf39ae38c'),
  DefaultDataEntity('689e9b6d-29f5-433b-b7be-7d55ff2a2389'),
  DefaultDataEntity('5679f300-0463-4449-b42e-7972fa17d228'),
  DefaultDataEntity(uuidv4()),
  DefaultDataEntity(uuidv4()),
  DefaultDataEntity('dcf08b0d-a7a8-428b-b881-688adebc27f9'),
  DefaultDataEntity('fffdc656-3584-4bb4-87b7-96c52fd57f91'),
  DefaultDataEntity('bf17099c-9e18-4515-8f70-8fb09ddf94c7'),
  DefaultDataEntity('5762e406-e16b-4385-8119-18d16743067b'),
]

export const mockedDataEntitiesByGuids: DataEntity[] = [
  DefaultDataEntity('dcf08b0d-a7a8-428b-b881-688adebc27f9'),
  DefaultDataEntity('fffdc656-3584-4bb4-87b7-96c52fd57f91'),
  DefaultDataEntity('bf17099c-9e18-4515-8f70-8fb09ddf94c7'),
  DefaultDataEntity('5762e406-e16b-4385-8119-18d16743067b'),
]

export const dataEntitiesResponse = (params?: PageableSortableQueryParams<DataEntity>): PagableResponse<DataEntity> => ({
  totals: {
    pages: 1,
    elements: mockedDataEntities.length,
  },
  navigation: {
    next: 'next',
    previous: 'prev',
  },
  count: mockedDataEntities.length,
  elements: params ? mockedDataEntities.slice(0, params?.max) : mockedDataEntities,
})

class DataEntitiesMockClass implements DataEntitiesInterface {
  create(dataEntity: DataEntity): Response<DataEntity | Partial<DataEntity>> {
    console.log(`${is}: create(${[...arguments]})`)
    dataEntity.guid = uuidv4()
    mockedDataEntities.push(dataEntity)
    console.log(`${is}: mock get dataEntities ${JSON.stringify(dataEntity)}`)
    return Promise.resolve({
      data: dataEntity,
    })
  }
  associateDataEntity(dataEntityGuids: string[]): Response<unknown> {
    console.log(`${is}: associateDataEntity(${[...arguments]})`)
    return Promise.resolve({})
  }
  read(dataEntityGuid: string): Response<DataEntity | Partial<DataEntity>> {
    console.log(`${is}: read(${dataEntityGuid})`)
    const dataEntity: DataEntity = mockedDataEntities.find(element => element.guid === dataEntityGuid)
    console.log(`${is}: read dataEntity ${JSON.stringify(dataEntity)}`)
    return Promise.resolve({ data: dataEntity })
  }
  readAll(
    params?: PageableSortableQueryParams<DataEntity>,
  ): Response<PagableResponse<DataEntity> | Partial<PagableResponse<DataEntity>>> {
    console.log(`${is}: readAll():  ${JSON.stringify(dataEntitiesResponse(params))}`)

    return Promise.resolve({ data: dataEntitiesResponse(params) })
  }
  readAllByGuids(dataEntityGuids: string[]): Response<DataEntity[] | Partial<DataEntity>[]> {
    console.log(`${is}: readAllByGuids(${dataEntityGuids})`)
    const dataEntities: DataEntity[] = mockedDataEntitiesByGuids.filter(element => dataEntityGuids.includes(element.guid))
    console.log(`${is}: readAllByGuids dataEntities ${JSON.stringify(dataEntities)}`)
    return Promise.resolve({ data: dataEntities })
  }
  readAssociated(): Response<PagableResponse<DataEntity> | Partial<PagableResponse<DataEntity>>> {
    console.log(`${is}: readAssociated():  ${JSON.stringify(dataEntitiesResponse())}`)
    return Promise.resolve({ data: dataEntitiesResponse() })
  }
  update(dataEntity: Partial<DataEntity>): Response<DataEntity | Partial<DataEntity>> {
    console.log(`${is}: update(${[...arguments]})`)
    const index = mockedDataEntities.findIndex(element => element.guid === dataEntity.guid)
    if (index >= 0) {
      mockedDataEntities[index] = { ...mockedDataEntities[index], ...dataEntity }
      return Promise.resolve({ data: mockedDataEntities[index] })
    }
    return Promise.reject({ error: 'DataEntityNotFound' })
  }
  remove(dataEntityGuid: string): Response<unknown> {
    console.log(`${is}: remove(${[...arguments]})`)
    const index = mockedDataEntities.findIndex(element => element.guid === dataEntityGuid)
    if (index >= 0) {
      if (index === 1) {
        return Promise.reject({
          response: {
            status: 400,
          },
        })
      } else {
        mockedDataEntities.splice(index, 1)
        return Promise.resolve({})
      }
    }
    return Promise.reject({ error: 'DataEntityNotFound' })
  }
}

const DataEntitiesMockApi = new DataEntitiesMockClass()

export { DataEntitiesMockApi }
