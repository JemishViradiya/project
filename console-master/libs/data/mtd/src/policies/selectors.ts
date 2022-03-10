/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import { createSelector } from 'reselect'

import type { UesReduxState } from '@ues-data/shared'

export const PoliciesReduxSlice = 'app.mtd.policies'

type Policy = {
  loading: boolean
  creating?: boolean
  error?: Error
  redirect?: boolean
  deleting?: boolean
  data: any
  policyToCreate?: unknown
  isFormDirty?: boolean
  deletePayload?: any
}

const selectRoot = (state: UesReduxState<typeof PoliciesReduxSlice, Policy>) => state[PoliciesReduxSlice]

export const selectPolicy = createSelector(selectRoot, state => state)
