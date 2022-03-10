/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

export type UseMobileAlertsInput = {
  data: any
  fetchMore: (variables: any) => Promise<any>
  searchConfig?: any
  onRowClick?(rowData: any)
  loading?: boolean
}

export type UseMobileAlertsReturn = {
  selectionModel?: any
  unselectAll?: () => void
  tableProps: any
  providerProps: any
  filterPanelProps: any
  drawerProps?: any
  exportAction?: any
  toolbarProps?: any
}
