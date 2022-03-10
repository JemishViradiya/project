import type { AsyncQuery } from '@ues-data/shared'
import { UesSessionApi } from '@ues-data/shared'

import type { EntitiesPageableResponse } from '../../../types'
import { ExclusionReadPermissions } from '../../shared/permissions'
import { ExclusionType } from '../common-types'
import { ApplicationsApi } from './applications-api'
import { ApprovedApplicationsApiMock, RestrictedApplicationsApiMock } from './applications-api-mock'
import type { IAppInfo } from './applications-api-types'

export const queryApplicationsForExport: AsyncQuery<
  EntitiesPageableResponse<IAppInfo>,
  { offset: number; max: number; exclusionType: ExclusionType }
> = {
  permissions: ExclusionReadPermissions,
  query: async ({ offset, max, exclusionType }) => {
    const data = await ApplicationsApi.search(
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
  mockQueryFn: async ({ exclusionType }) => {
    if (exclusionType === ExclusionType.Approved) {
      const data = await ApprovedApplicationsApiMock.search(UesSessionApi.getTenantId(), { query: { type: exclusionType } })

      return data.data
    } else {
      const data = await RestrictedApplicationsApiMock.search(UesSessionApi.getTenantId(), { query: { type: exclusionType } })

      return data.data
    }
  },
}
