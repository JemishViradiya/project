import type { OPERATOR_VALUES, TableSortDirection } from '@ues/behaviours'

export enum ColumnDataKey {
  Name = 'name',
  Description = 'description',
  SaasApps = 'tenantId',
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
