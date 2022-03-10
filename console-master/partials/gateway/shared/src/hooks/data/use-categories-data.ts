//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { useMemo } from 'react'

import type { AclCategoryDefinition } from '@ues-data/gateway'
import { GatewayApi, GatewayApiMock } from '@ues-data/gateway'
import type { AsyncQuery } from '@ues-data/shared'
import { Permission, UesSessionApi, useStatefulAsyncQuery } from '@ues-data/shared'

const queryAclCategories: AsyncQuery<AclCategoryDefinition[], { tenantId: string }> = {
  query: async ({ tenantId }) => {
    const { data } = await GatewayApi.Acl.readCategories(tenantId)

    return data
  },
  mockQueryFn: async ({ tenantId }) => {
    const { data } = await GatewayApiMock.Acl.readCategories(tenantId)

    return data
  },
  permissions: new Set([Permission.BIG_ACL_READ]),
}

type UseCategoriesDataFn = () => {
  error: unknown
  loading: boolean
  categories: AclCategoryDefinition[]
  categoryIdsMap: Record<string, string>
  categoryNamesMap: Record<string, string>
}

export const useCategoriesData: UseCategoriesDataFn = () => {
  const tenantId = UesSessionApi.getTenantId()

  const { data, loading, error } = useStatefulAsyncQuery(queryAclCategories, {
    variables: { tenantId },
  })

  const { categoryIdsMap, categoryNamesMap } = useMemo(
    () =>
      (data ?? []).reduce(
        (categoriesAcc, category) => ({
          categoryNamesMap: {
            ...categoriesAcc.categoryNamesMap,
            [category.name]: category.id,
          },
          categoryIdsMap: {
            ...categoriesAcc.categoryIdsMap,
            [category.id]: category.name,
            ...(category?.subcategories ?? []).reduce(
              (subcategoriesAcc, subcategory) => ({
                ...subcategoriesAcc,
                [subcategory.id]: subcategory.name,
              }),
              {},
            ),
          },
        }),
        { categoryIdsMap: {}, categoryNamesMap: {} },
      ),
    [data],
  )

  const sortedData = useMemo(() => {
    return (data ?? [])
      .map(item => ({ ...item, subcategories: item.subcategories.sort((a, b) => a.name.localeCompare(b.name)) }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [data])

  return { error, loading, categories: sortedData, categoryIdsMap, categoryNamesMap }
}
