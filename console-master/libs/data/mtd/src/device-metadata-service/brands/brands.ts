//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import { axiosInstance, baseUrl } from '../../config.rest'
import type BrandsInterface from './brands-interface'
import type { Brand } from './brands-types'

export const makeBrandsEndpoint = (osFamily?: string): string => {
  const osFamilySearch = osFamily ? `?osFamily=${osFamily}` : ''
  return `/v1/device-metadata/hardwarebrands${osFamilySearch}`
}

export const makeBrandsUrl = (osFamily?: string): string => `${baseUrl}${makeBrandsEndpoint(osFamily)}`

class BrandsClass implements BrandsInterface {
  readAll(osFamily?: string): Response<Array<Brand>> {
    return axiosInstance().get(makeBrandsUrl(osFamily))
  }
}

const Brands = new BrandsClass()

export { Brands }
