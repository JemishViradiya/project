//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import { axiosInstance, baseUrl } from '../../config.rest'
import type OSVersionsInterface from './osversions-interface'
import type { OSVersion } from './osversions-types'

export const makeOSVersionsEndpoint = (osFamily?: string): string => {
  const osFamilySearch = osFamily ? `?osFamily=${osFamily}` : ''
  return `/v1/device-metadata/deviceos${osFamilySearch}`
}

export const makeOSVersionsUrl = (osFamily?: string): string => `${baseUrl}${makeOSVersionsEndpoint(osFamily)}`

class OSVersionsClass implements OSVersionsInterface {
  readAll(osFamily?: string): Response<Array<OSVersion>> {
    return axiosInstance().get(makeOSVersionsUrl(osFamily))
  }
}

const OSVersions = new OSVersionsClass()

export { OSVersions }
