import type { AsyncQuery } from '@ues-data/shared'
import { UesSessionApi } from '@ues-data/shared'

import type { EntitiesPageableResponse } from '../../../types'
import { ExclusionReadPermissions } from '../../shared/permissions'
import { ExclusionType } from '../common-types'
import { DeveloperCertificatesApi } from './dev-certs-api'
import { ApprovedDeveloperCertificatesApiMock, RestrictedDeveloperCertificatesApiMock } from './dev-certs-api-mock'
import type { IDeveloperCertificate } from './dev-certs-api-types'

export const queryDevCertsForExport: AsyncQuery<
  EntitiesPageableResponse<IDeveloperCertificate>,
  { offset: number; max: number; exclusionType: ExclusionType }
> = {
  permissions: ExclusionReadPermissions,
  query: async ({ offset, max, exclusionType }) => {
    const data = await DeveloperCertificatesApi.search(
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
      const data = await ApprovedDeveloperCertificatesApiMock.search(UesSessionApi.getTenantId(), {
        query: { type: exclusionType },
      })

      return data.data
    } else {
      const data = await RestrictedDeveloperCertificatesApiMock.search(UesSessionApi.getTenantId(), {
        query: { type: exclusionType },
      })

      return data.data
    }
  },
}
