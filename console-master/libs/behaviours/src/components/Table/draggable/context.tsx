//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import React, { createContext, memo, useContext } from 'react'

import type { TableProviderProps } from '../provider'
import { TableProvider } from '../provider'
import type { DraggableProps } from '../types'

export const DraggableTableContext = createContext<DraggableProps>(null)

export const useDraggableTableProps = () => useContext(DraggableTableContext)

export type DraggableTableProviderInputProps = TableProviderProps & { draggableProps: DraggableProps }

export const DraggableTableProvider = memo((props: DraggableTableProviderInputProps) => {
  const { children, draggableProps, ...simpleTableProps } = props

  return (
    <TableProvider {...simpleTableProps}>
      <DraggableTableContext.Provider value={draggableProps}>{children}</DraggableTableContext.Provider>
    </TableProvider>
  )
})
