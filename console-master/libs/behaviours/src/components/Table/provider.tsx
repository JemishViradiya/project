import React, { memo, useMemo } from 'react'

import type { FilterProps } from '../../filters'
import type { UseSelected } from '../../tables/useSelected/useSelected'
import type { UseSort } from '../../tables/useSort/useSort'
import type { BasicTableProps, ExpandableProps } from './types'
import { TableBasicContext, TableExpandableContext, TableFilterContext, TableSelectionContext, TableSortingContext } from './types'
import { filterOutHiddenColumns } from './utils'

export type TableProviderProps = {
  children: React.ReactNode
  basicProps: BasicTableProps
  filterProps?: FilterProps<any>
  sortingProps?: UseSort
  selectedProps?: UseSelected<any>
  expandableProps?: ExpandableProps
}

const Wrap = ({ props, Context, children }) => <Context.Provider value={props}>{children}</Context.Provider>

const BasicTableProvider = ({ basicProps, children }) => {
  const filteredBasicProps = useMemo(() => {
    return {
      ...basicProps,
      columns: filterOutHiddenColumns(basicProps.columns),
    }
  }, [basicProps])

  return <TableBasicContext.Provider value={filteredBasicProps}>{children}</TableBasicContext.Provider>
}

export const TableProvider = memo((props: TableProviderProps) => {
  const { children, basicProps, filterProps, sortingProps, selectedProps, expandableProps } = props

  return (
    <BasicTableProvider basicProps={basicProps}>
      <Wrap Context={TableFilterContext} props={filterProps}>
        <Wrap Context={TableSortingContext} props={sortingProps}>
          <Wrap Context={TableSelectionContext} props={selectedProps}>
            <Wrap Context={TableExpandableContext} props={expandableProps}>
              {children}
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
    </BasicTableProvider>
  )
})
