//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params */
/* eslint-disable sonarjs/no-duplicate-string */

import type { Response } from '@ues-data/shared'

import type ActivationProfilesInterface from './profiles-interface'
import type { ActivationProfile } from './profiles-types'

const is = 'ActivationProfilesClass'

export enum mockActivationProfileGuids {
  DefaultProfileGuid = '9906e78b-4ccc-4080-8b6c-fd2367c45d02',
  NoPlatformListDefinedAndNoDesktopPlatformEnabledFieldGuid = '11981ec4-f154-435a-9df9-11da7b966f7f',
  androidAndIOSButIOSInLowerCaseGuid = '74fadb2f-efb7-4ab1-a0f4-c4d0ad7cfc68',
  mobileAndDesktopEnabledWithoutPlatformSpecified = 'c4216e55-f9b4-4af8-915b-dbcf1671b16c',
}

export const activationProfilesMocks: ActivationProfile[] = [
  {
    id: mockActivationProfileGuids.DefaultProfileGuid,
    name: 'Activation Profile 1 - Default',
    description: 'Mobile iOS enabled; Desktop Windows and MacOS enabled.',
    isDefault: true,
    allowedMobilePlatformsEnabled: true,
    allowedMobilePlatformsList: ['iOS'],
    allowedDesktopPlatformsEnabled: true,
    allowedDesktopPlatformsList: ['Windows', 'macOS'],
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
  {
    id: mockActivationProfileGuids.NoPlatformListDefinedAndNoDesktopPlatformEnabledFieldGuid,
    name: 'Activation Profile 2',
    allowedMobilePlatformsEnabled: false,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
  {
    id: mockActivationProfileGuids.androidAndIOSButIOSInLowerCaseGuid,
    name: 'Activation Profile 3',
    description: 'ios is lowercase.',
    allowedMobilePlatformsEnabled: true,
    allowedMobilePlatformsList: ['ios', 'Android'],
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
  {
    id: mockActivationProfileGuids.mobileAndDesktopEnabledWithoutPlatformSpecified,
    name: 'Activation Profile 4',
    description: '',
    allowedMobilePlatformsEnabled: true,
    allowedDesktopPlatformsEnabled: true,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
]

class ActivationProfilesClass implements ActivationProfilesInterface {
  create(_data: ActivationProfile): Response<ActivationProfile> {
    console.log(`${is}: create(${[...arguments]})`)

    return Promise.resolve({ data: { ..._data } })
  }

  readOne(entityId: string): Response<ActivationProfile> {
    console.log(`${is}: readOne(${[...arguments]})`)

    const result = activationProfilesMocks.find(policy => policy.id === entityId)

    return Promise.resolve({ data: result })
  }

  update(_entityId: string, _data: ActivationProfile): Response<ActivationProfile> {
    console.log(`${is}: update(${[...arguments]})`)

    return Promise.resolve({ data: { ..._data } })
  }

  remove(_entityId: string): Promise<void> {
    console.log(`${is}: remove(${[...arguments]})`)

    return Promise.resolve()
  }

  removeMultiple(entityIds: string[]): Promise<void> {
    console.log(`${is}: removeMultiple(${[...arguments]})`)

    return Promise.resolve()
  }
}

const ActivationProfilesMock = new ActivationProfilesClass()

export { ActivationProfilesMock }
