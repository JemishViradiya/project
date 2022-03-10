//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type React from 'react'

import type { GridProps } from '@material-ui/core'

export interface FormGridLayoutProps {
  columns: {
    renderCell: (rowIndex: number, rowsCount: number) => React.ReactElement
    dataKey: string
    label?: string
    renderLabel?: () => React.ReactElement
    muiProps?: Partial<GridProps>
  }[]
  disabled?: boolean
  initialValues?: Record<string, unknown>[][][]
  muiProps?: Partial<GridProps>
  noDataPlaceholder?: string
  onChange?: () => void
}
