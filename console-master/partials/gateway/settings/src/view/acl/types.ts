//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AclRule, PageableRequestParams } from '@ues-data/gateway'
import type { OPERATOR_VALUES, TableSortDirection } from '@ues/behaviours'

export enum ColumnDataKey {
  Action = 'action',
  Category = 'category',
  Description = 'description',
  Disposition = 'disposition',
  Enabled = 'enabled',
  Name = 'name',
  NetworkProtection = 'networkProtection',
  Notify = 'notify',
  Rank = 'rank',
  Risk = 'risk',
  Target = 'target',
  Privacy = 'privacy',
  UsersOrGroups = 'usersOrGroups',
}

export interface CommonCellProps {
  item?: AclRule
  disabled?: boolean
  hidden?: boolean
}

export interface CurrentTableData {
  filters?: Partial<
    Record<
      ColumnDataKey,
      {
        value: any
        operator?: OPERATOR_VALUES
      }
    >
  >
  sort?: {
    sortBy: ColumnDataKey
    sortDir: TableSortDirection
  }
}

export interface AclListProps {
  loading: boolean
  readOnly?: boolean
  refetch: (params: PageableRequestParams) => void
  total: number
}
