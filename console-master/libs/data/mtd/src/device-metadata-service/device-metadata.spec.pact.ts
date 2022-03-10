//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { OK } from 'http-status-codes'

import { Interaction } from '@pact-foundation/pact'

import {
  deviceMetadataProvider,
  MTD_DEVICE_METADATA_PACT_CONSUMER_NAME,
  MTD_DEVICE_METADATA_PACT_PROVIDER_NAME,
} from '../config.pact'
import { queryDeviceBrandsMock } from '../metadata/device-brand'
import { queryAndroidDeviceModelsMock, queryIosDeviceModelsMock } from '../metadata/device-model'
import { queryAndroidDeviceOsVersionsMock, queryIosDeviceOsVersionsMock } from '../metadata/device-os-version'
import { Brands, makeBrandsEndpoint } from './brands/brands'
import { makeModelsEndpoint, Models } from './models/models'
import { makeOSVersionsEndpoint, OSVersions } from './osversions/osversions'

const COMPONENT_NAME = 'device-metadata'
const OS_VERSION_COMPONENT_NAME = 'device os versions'
const MODEL_COMPONENT_NAME = 'device models'
const BRAND_COMPONENT_NAME = 'device brands'
const JSON_CONTENT_TYPE = 'application/json'
const ANDROID_OS_FAMILY = 'android'
const IOS_OS_FAMILY = 'ios'
const ANDROID_OS_FAMILY_QUERY_PARAM = 'osFamily=android'
const IOS_OS_FAMILY_QUERY_PARAM = 'osFamily=ios'

jest.mock('../config.rest', () => jest.requireActual('../config.pact').mockedAxiosConfig('deviceMetadataProvider'))

describe(`${MTD_DEVICE_METADATA_PACT_CONSUMER_NAME}-${MTD_DEVICE_METADATA_PACT_PROVIDER_NAME} ${COMPONENT_NAME} pact`, () => {
  beforeAll(async () => await deviceMetadataProvider.setup())

  afterAll(async () => await deviceMetadataProvider.finalize())

  describe(`get ${ANDROID_OS_FAMILY} ${OS_VERSION_COMPONENT_NAME} data`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`getAndroidDeviceOsVersions`)
        .uponReceiving(`request to get ${ANDROID_OS_FAMILY} ${OS_VERSION_COMPONENT_NAME} data`)
        .withRequest({
          method: 'GET',
          path: makeOSVersionsEndpoint(),
          query: ANDROID_OS_FAMILY_QUERY_PARAM,
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': JSON_CONTENT_TYPE,
          },
          body: queryAndroidDeviceOsVersionsMock.deviceOsVersions,
        })

      return deviceMetadataProvider.addInteraction(interaction)
    })

    afterAll(() => deviceMetadataProvider.verify())

    it(`should get ${ANDROID_OS_FAMILY} ${OS_VERSION_COMPONENT_NAME} data`, async () => {
      const response = await OSVersions.readAll(ANDROID_OS_FAMILY)

      expect(response.data).toEqual(queryAndroidDeviceOsVersionsMock.deviceOsVersions)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`get ${IOS_OS_FAMILY} ${OS_VERSION_COMPONENT_NAME} data`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`getIosDeviceOsVersions`)
        .uponReceiving(`request to get ${IOS_OS_FAMILY} ${OS_VERSION_COMPONENT_NAME} data`)
        .withRequest({
          method: 'GET',
          path: makeOSVersionsEndpoint(),
          query: IOS_OS_FAMILY_QUERY_PARAM,
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': JSON_CONTENT_TYPE,
          },
          body: queryIosDeviceOsVersionsMock.deviceOsVersions,
        })

      return deviceMetadataProvider.addInteraction(interaction)
    })

    afterAll(() => deviceMetadataProvider.verify())

    it(`should get ${IOS_OS_FAMILY} ${OS_VERSION_COMPONENT_NAME} data`, async () => {
      const response = await OSVersions.readAll(IOS_OS_FAMILY)

      expect(response.data).toEqual(queryIosDeviceOsVersionsMock.deviceOsVersions)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`get ${ANDROID_OS_FAMILY} ${MODEL_COMPONENT_NAME} data`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`getAndroidDeviceModels`)
        .uponReceiving(`request to get ${ANDROID_OS_FAMILY} ${MODEL_COMPONENT_NAME} data`)
        .withRequest({
          method: 'GET',
          path: makeModelsEndpoint(),
          query: ANDROID_OS_FAMILY_QUERY_PARAM,
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': JSON_CONTENT_TYPE,
          },
          body: queryAndroidDeviceModelsMock.deviceModels,
        })

      return deviceMetadataProvider.addInteraction(interaction)
    })

    afterAll(() => deviceMetadataProvider.verify())

    it(`should get ${ANDROID_OS_FAMILY} ${MODEL_COMPONENT_NAME} data`, async () => {
      const response = await Models.readAll(ANDROID_OS_FAMILY)

      expect(response.data).toEqual(queryAndroidDeviceModelsMock.deviceModels)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`get ${IOS_OS_FAMILY} ${MODEL_COMPONENT_NAME} data`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`getIosDeviceModels`)
        .uponReceiving(`request to get ${IOS_OS_FAMILY} ${MODEL_COMPONENT_NAME} data`)
        .withRequest({
          method: 'GET',
          path: makeModelsEndpoint(),
          query: IOS_OS_FAMILY_QUERY_PARAM,
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': JSON_CONTENT_TYPE,
          },
          body: queryIosDeviceModelsMock.deviceModels,
        })

      return deviceMetadataProvider.addInteraction(interaction)
    })

    afterAll(() => deviceMetadataProvider.verify())

    it(`should get ${IOS_OS_FAMILY} ${MODEL_COMPONENT_NAME} data`, async () => {
      const response = await Models.readAll(IOS_OS_FAMILY)

      expect(response.data).toEqual(queryIosDeviceModelsMock.deviceModels)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`get ${ANDROID_OS_FAMILY} ${BRAND_COMPONENT_NAME} data`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`getAndroidDeviceBrands`)
        .uponReceiving(`request to get ${ANDROID_OS_FAMILY} ${BRAND_COMPONENT_NAME} data`)
        .withRequest({
          method: 'GET',
          path: makeBrandsEndpoint(),
          query: ANDROID_OS_FAMILY_QUERY_PARAM,
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': JSON_CONTENT_TYPE,
          },
          body: queryDeviceBrandsMock.deviceBrands,
        })

      return deviceMetadataProvider.addInteraction(interaction)
    })

    afterAll(() => deviceMetadataProvider.verify())

    it(`should get ${ANDROID_OS_FAMILY} ${BRAND_COMPONENT_NAME} data`, async () => {
      const response = await Brands.readAll(ANDROID_OS_FAMILY)

      expect(response.data).toEqual(queryDeviceBrandsMock.deviceBrands)
      expect(response.status).toEqual(OK)
    })
  })
})
