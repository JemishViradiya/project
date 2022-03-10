//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import { axiosInstance, baseUrl } from '../config.rest'
import type TenantsInterface from './tenants-interface'
import type { TenantConfiguration, TenantHealthEntity } from './tenants-types'

export const makeTenantConfigEndpoint = (tenantId: string): string => `/tenant/v1/${tenantId}/configuration`

export const makeTenantHealthEndpoint = (tenantId: string): string => `/tenant/v1/${tenantId}/health`

export const makeTenantUrl = (endpoint: string): string => `${baseUrl}${endpoint}`

class TenantsClass implements TenantsInterface {
  readConfig(tenantId: string): Response<TenantConfiguration> {
    return axiosInstance().get(makeTenantUrl(makeTenantConfigEndpoint(tenantId)))
  }

  updateConfig(tenantId: string, config: Partial<TenantConfiguration>): Response<Partial<TenantConfiguration>> {
    return axiosInstance().patch(makeTenantUrl(makeTenantConfigEndpoint(tenantId)), config)
  }

  readHealth(tenantId: string): Response<TenantHealthEntity> {
    return axiosInstance().get(makeTenantUrl(makeTenantHealthEndpoint(tenantId)))
  }
}

const Tenants = new TenantsClass()

export { Tenants }
