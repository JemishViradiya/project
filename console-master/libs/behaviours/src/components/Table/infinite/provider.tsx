import React, { createContext, memo, useContext, useMemo } from 'react'

import type { TableProviderProps } from '../provider'
import { TableProvider } from '../provider'
import type { RenderingProps } from '../types'
import { useInfiniteTable } from './infiniteTableHooks'

export type InfiniteTableProviderProps = {
  rowCount: number
  rowGetter: (row: { index: number }) => any
  renderingProps: RenderingProps
  classes?: any
}

export type InfiniteTableProviderInputProps = TableProviderProps & { data: any[] }

export const InfiniteTableContext = createContext<InfiniteTableProviderProps>(null)
export const useInfiniteTableContext = () => useContext(InfiniteTableContext)

const InfiniteTableInnerProvider = ({ children, data }) => {
  const { renderingProps, classes } = useInfiniteTable({ data })
  const value = useMemo(
    () => ({
      rowCount: data?.length,
      rowGetter: ({ index }) => data[index] ?? {},
      renderingProps,
      classes,
    }),
    [data, renderingProps, classes],
  )

  return <InfiniteTableContext.Provider value={value}>{children}</InfiniteTableContext.Provider>
}

export const InfiniteTableProvider = memo((props: InfiniteTableProviderInputProps) => {
  const { children, ...simpleTableProps } = props

  return (
    <TableProvider {...simpleTableProps}>
      <InfiniteTableInnerProvider data={props.data}>{children}</InfiniteTableInnerProvider>
    </TableProvider>
  )
})
