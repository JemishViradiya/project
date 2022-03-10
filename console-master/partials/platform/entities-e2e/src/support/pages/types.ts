import type { FILTER_TYPE } from '@ues/behaviours/types'

enum ColumnId {
  AGENT,
  DEVICE,
  EMAIL,
  EMM_CONNECTIONS,
  ENROLLMENT,
  OS,
  OS_SECURITY_PATCH,
  OS_VERSION,
  RISK,
  USER,
}

type ColumnConfig = {
  id: ColumnId
  labelKey: string
  canBeHidden: boolean
  filterType: FILTER_TYPE
  value?: any
  tPrefix?: string
}

interface CheckFilterParams {
  column: ColumnConfig
  filterChipOnly?: boolean
}

export { ColumnConfig, ColumnId, CheckFilterParams }
