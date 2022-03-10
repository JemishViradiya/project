import type { AsyncQuery } from '@ues-data/shared'
import { FeatureName, FeaturizationApi, UesSessionApi } from '@ues-data/shared'

import type { EntitiesPageableResponse } from '../../../types'
import { ExclusionReadPermissions } from '../../shared/permissions'
import { ExclusionType } from '../common-types'
import { WebAddressesApi } from './web-addresses-api'
import { ApprovedIPAddressesApiMock, RestrictedIPAddressesApiMock } from './web-addresses-api-mock'
import type { IWebAddress } from './web-addresses-api-types'

export const queryWebAddressesForExport: AsyncQuery<
  EntitiesPageableResponse<IWebAddress>,
  { offset: number; max: number; exclusionType: ExclusionType }
> = {
  permissions: ExclusionReadPermissions,
  query: async ({ offset, max, exclusionType }) => {
    const data = await WebAddressesApi.searchIpAddresses(
      UesSessionApi.getTenantId(),
      {
        offset: offset,
        max: max,
        query: { type: exclusionType },
      },
      offset == 0,
    )

    return data.data
  },
  mockQueryFn: async ({ offset, max, exclusionType }) => {
    if (FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)) {
      const data = await WebAddressesApi.searchIpAddresses(
        UesSessionApi.getTenantId(),
        {
          offset: offset,
          max: max,
          query: { type: exclusionType },
        },
        offset == 0,
      )

      return data.data
    }

    if (exclusionType === ExclusionType.Approved) {
      const data = await ApprovedIPAddressesApiMock.searchIpAddresses(UesSessionApi.getTenantId(), {
        query: { type: exclusionType },
      })

      return data.data
    } else {
      const data = await RestrictedIPAddressesApiMock.searchIpAddresses(UesSessionApi.getTenantId(), {
        query: { type: exclusionType },
      })

      return data.data
    }
  },
}

export const queryDomainsForExport: AsyncQuery<
  EntitiesPageableResponse<IWebAddress>,
  { offset: number; max: number; exclusionType: ExclusionType }
> = {
  permissions: ExclusionReadPermissions,
  query: async ({ offset, max, exclusionType }) => {
    const data = await WebAddressesApi.searchDomains(
      UesSessionApi.getTenantId(),
      {
        offset: offset,
        max: max,
        query: { type: exclusionType },
      },
      offset == 0,
    )

    return data.data
  },
  mockQueryFn: async ({ offset, max, exclusionType }) => {
    if (FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)) {
      const data = await WebAddressesApi.searchDomains(
        UesSessionApi.getTenantId(),
        {
          offset: offset,
          max: max,
          query: { type: exclusionType },
        },
        offset == 0,
      )

      return data.data
    }

    if (exclusionType === ExclusionType.Approved) {
      const data = await ApprovedIPAddressesApiMock.searchDomains(UesSessionApi.getTenantId(), {
        query: { type: exclusionType },
      })

      return data.data
    } else {
      const data = await RestrictedIPAddressesApiMock.searchDomains(UesSessionApi.getTenantId(), {
        query: { type: exclusionType },
      })

      return data.data
    }
  },
}
