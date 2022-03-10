/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEqual } from 'lodash-es'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { usePrevious } from '@ues-behaviour/react'

import type { DraggableProps, TableDragChange } from '../types'
import { DroppableHandler, reorderData } from './draggable'

export type DraggableTableHookProps = {
  initialData: any[]
  draggable?: {
    onDragChange: (dragChange: TableDragChange) => void
    onDataReorder?: (rowData: any, index: number) => void
    hidden?: boolean
  }
  idFunction?: (rowData: any) => string
}

export interface DraggableTableHookOutputProps {
  draggableProps: DraggableProps
  data: any[]
  resetDrag: () => void
}

export const useDraggableTable = ({
  initialData,
  idFunction,
  draggable,
}: // eslint-disable-next-line sonarjs/cognitive-complexity
DraggableTableHookProps): DraggableTableHookOutputProps => {
  const [dataSource, setDataSource] = useState<DraggableTableHookProps['initialData']>(initialData ?? [])
  const previousData = usePrevious(initialData)

  useEffect(() => {
    if (!isEqual(initialData, previousData)) {
      setDataSource(initialData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  const handleDragChange = useCallback(
    dragUpdate => {
      if (!dragUpdate.destination) return

      const fromIndex = dragUpdate.source.index
      const toIndex = dragUpdate.destination.index

      const updatedDataSource = reorderData(dataSource, { fromIndex, toIndex }, draggable?.onDataReorder)

      const dragChange = {
        fromId: idFunction(dataSource[fromIndex]),
        fromIndex,
        toId: idFunction(dataSource[toIndex]),
        toIndex,
        updatedDataSource,
      }

      setDataSource(updatedDataSource)
      if (draggable?.onDragChange) draggable.onDragChange(dragChange)
    },
    [dataSource, draggable, idFunction],
  )

  const resetDrag = useCallback(() => {
    setDataSource(initialData ?? [])
  }, [initialData])

  const draggableProps: DraggableProps = useMemo(
    () =>
      draggable?.onDragChange && !draggable?.hidden ? { ...draggable, component: DroppableHandler(handleDragChange) } : undefined,
    [draggable, handleDragChange],
  )

  return { data: dataSource, draggableProps, resetDrag }
}
