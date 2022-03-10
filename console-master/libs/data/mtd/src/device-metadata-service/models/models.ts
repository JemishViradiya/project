//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import { axiosInstance, baseUrl } from '../../config.rest'
import type ModelsInterface from './models-interface'
import type { Model } from './models-types'

export const makeModelsEndpoint = (osFamily?: string): string => {
  const osFamilySearch = osFamily ? `?osFamily=${osFamily}` : ''
  return `/v1/device-metadata/hardwaremodels${osFamilySearch}`
}

export const makeModelsUrl = (osFamily?: string): string => `${baseUrl}${makeModelsEndpoint(osFamily)}`

class ModelsClass implements ModelsInterface {
  readAll(osFamily?: string): Response<Array<Model>> {
    return axiosInstance().get(makeModelsUrl(osFamily))
  }
}

const Models = new ModelsClass()

export { Models }
