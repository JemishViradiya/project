// //******************************************************************************
// // Copyright 2020 BlackBerry. All Rights Reserved.

import React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import { Box, TableBody, TableCell, TableRow } from '@material-ui/core'

import { BasicDrag as DragIndicator } from '@ues/assets'

import type { DraggableProps, TableDragChange } from '../types'

const getItemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,
  ...(isDragging &&
    {
      // place to set custom styles for draggable row
    }),
})

export const DraggableHandler = (id: string, index: number, additionalCellButtons: React.ReactNode): React.FC => props => (
  <Draggable draggableId={id} index={index}>
    {(provided, snapshot) => (
      <TableRow
        ref={provided.innerRef}
        {...provided.draggableProps}
        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
        {...props}
      >
        <TableCell {...provided.dragHandleProps} padding="checkbox">
          <Box display="flex" alignItems="center" justifyContent="center">
            <DragIndicator />
            {additionalCellButtons}
          </Box>
        </TableCell>
        {props.children}
      </TableRow>
    )}
  </Draggable>
)

export const DroppableHandler = (onDragEnd: (result, provided) => void): React.FC => props => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId={'1'} direction="vertical">
      {provided => {
        return (
          <TableBody ref={provided.innerRef} {...provided.droppableProps} {...props}>
            {props.children}
            {provided.placeholder}
          </TableBody>
        )
      }}
    </Droppable>
  </DragDropContext>
)

export const reorderData = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[],
  { fromIndex, toIndex }: Pick<TableDragChange, 'fromIndex' | 'toIndex'>,
  onDataReorder: DraggableProps['onDataReorder'],
): // eslint-disable-next-line @typescript-eslint/no-explicit-any
any[] => {
  const result = Array.from(data)
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)

  return typeof onDataReorder === 'function' ? result.map(onDataReorder) : result
}
