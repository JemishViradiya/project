//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty, pick } from 'lodash-es'
import { useMemo } from 'react'

import type { FormFieldOption } from '@ues-behaviour/hook-form'
import type { NetworkServiceEntityPartial, NetworkServicesV2, NetworkServicesV3 } from '@ues-data/gateway'
import { GatewayApi, GatewayApiMock } from '@ues-data/gateway'
import type { AsyncQuery } from '@ues-data/shared'
import { Permission, UesSessionApi, useStatefulAsyncQuery } from '@ues-data/shared'
import type { PagableResponse, Response } from '@ues-data/shared-types'
import { TableSortDirection } from '@ues/behaviours'

import { NETWORK_SERVICES_DEFAULT_SORT, NETWORK_SERVICES_MAX_RECORDS } from '../../config/settings'
import { makeSortByQueryParam } from '../../utils'

const fetchNetworkServices = async ({
  api,
  aclNetworkServices,
  params,
  tenantId,
}: {
  api: typeof GatewayApi | typeof GatewayApiMock
  aclNetworkServices: boolean
  params?: NetworkServicesV3.NetworkServicesRequestParams
  tenantId: string
}): Response<PagableResponse<NetworkServicesV3.NetworkServiceEntity>> => {
  if (aclNetworkServices) {
    const { data } = await api.NetworkServicesV3.read(tenantId, params)

    return { data }
  } else {
    const { data } = await api.NetworkServicesV2.read(tenantId)
    const sortedData = ((data as NetworkServicesV2.NetworkServiceEntity[]) ?? []).sort((a, b) => a?.name.localeCompare(b?.name))

    return { data: { elements: sortedData } } as any
  }
}

export const queryNetworkServices: AsyncQuery<
  PagableResponse<NetworkServicesV3.NetworkServiceEntity>,
  { tenantId: string; params?: NetworkServicesV3.NetworkServicesRequestParams; aclNetworkServices: boolean }
> = {
  query: async ({ tenantId, params, aclNetworkServices }) => {
    const { data } = await fetchNetworkServices({ api: GatewayApi, tenantId, params, aclNetworkServices })

    return data
  },
  mockQueryFn: async ({ tenantId, aclNetworkServices }) => {
    const { data } = await fetchNetworkServices({ api: GatewayApiMock, tenantId, aclNetworkServices })

    return data
  },
  permissions: new Set([Permission.BIG_NETWORKSERVICES_READ]),
}

export interface NetworkServicesDataFnArgs {
  activeNetworkServiceId?: string
  addedNetworkServices?: NetworkServiceEntityPartial[]
  fetchQueryParams?: Partial<NetworkServicesV3.NetworkServicesRequestParams>
  includeOptions?: boolean
  aclNetworkServices?: boolean
}

type UseNetworkServicesDataFn = (
  args?: NetworkServicesDataFnArgs,
) => {
  error: unknown
  loading: boolean
  makeNetworkServicesPartials: (networkServicesIds: string[], condensed?: boolean) => NetworkServiceEntityPartial[]
  networkServices: NetworkServicesV3.NetworkServiceEntity[]
  networkServicesResponse: PagableResponse<NetworkServicesV3.NetworkServiceEntity>
  networkServicesMap: Record<string, NetworkServicesV3.NetworkServiceEntity>
  networkServicesSelectOptions: FormFieldOption[]
  refetch: () => void
  fetchMore: ({
    tenantId,
    params,
  }: {
    tenantId: string
    params?: NetworkServicesV3.NetworkServicesRequestParams
  }) =>
    | Promise<PagableResponse<NetworkServicesV3.NetworkServiceEntity>>
    | PagableResponse<NetworkServicesV3.NetworkServiceEntity>
    | AsyncGenerator<PagableResponse<NetworkServicesV3.NetworkServiceEntity>, void, unknown>
}

const DEFAULT_OPTIONS_STATE = { networkServicesSelectOptions: [], networkServicesMap: {} }

export const useNetworkServicesData: UseNetworkServicesDataFn = ({
  addedNetworkServices = [],
  activeNetworkServiceId,
  includeOptions = true,
  aclNetworkServices = true,
  fetchQueryParams: {
    intrinsic,
    max = NETWORK_SERVICES_MAX_RECORDS,
    offset,
    query,
    sortBy = makeSortByQueryParam({
      sortBy: NETWORK_SERVICES_DEFAULT_SORT,
      sortDir: TableSortDirection.Asc,
    }),
  } = {},
} = {}) => {
  const tenantId = UesSessionApi.getTenantId()

  const queryVariables = useMemo(() => ({ tenantId, params: { intrinsic, sortBy, max, offset, query }, aclNetworkServices }), [
    tenantId,
    intrinsic,
    sortBy,
    max,
    offset,
    query,
    aclNetworkServices,
  ])

  const { data: networkServicesResponse, loading, error, refetch, fetchMore } = useStatefulAsyncQuery(queryNetworkServices, {
    variables: queryVariables,
  })

  const networkServices = networkServicesResponse?.elements
  const { networkServicesSelectOptions, networkServicesMap } = useMemo(() => {
    const addedNetworkServicesIds = addedNetworkServices?.map(item => item.id)

    return includeOptions
      ? (networkServices ?? []).reduce(
          (acc, networkService) => ({
            networkServicesSelectOptions: [
              ...acc.networkServicesSelectOptions,
              {
                label: networkService.name,
                value: networkService.id,
                disabled:
                  activeNetworkServiceId === networkService.id
                    ? true
                    : isEmpty(addedNetworkServicesIds)
                    ? false
                    : addedNetworkServicesIds?.includes(networkService.id),
              },
            ],
            networkServicesMap: {
              ...acc.networkServicesMap,
              [networkService.id]: networkService,
            },
          }),
          DEFAULT_OPTIONS_STATE,
        )
      : DEFAULT_OPTIONS_STATE
  }, [activeNetworkServiceId, addedNetworkServices, networkServices, includeOptions])

  const makeNetworkServicesPartials = (networkServicesIds: string[], condensed = true): NetworkServiceEntityPartial[] =>
    networkServicesIds.map(id => (condensed ? { id } : pick(networkServicesMap[id], ['id', 'name'])))

  return {
    error,
    loading,
    makeNetworkServicesPartials,
    networkServices,
    networkServicesResponse,
    networkServicesMap,
    networkServicesSelectOptions,
    refetch,
    fetchMore: args => fetchMore({ ...args, aclNetworkServices }),
  }
}
