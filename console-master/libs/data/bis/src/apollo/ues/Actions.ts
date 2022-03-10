import { Permission } from '@ues-data/shared-types'

import { ActionTypesQuery } from '../Actions'

export const UESActionTypesQuery = {
  ...ActionTypesQuery,
  permissions: new Set([Permission.BIS_RISKPROFILE_READ]),
}
