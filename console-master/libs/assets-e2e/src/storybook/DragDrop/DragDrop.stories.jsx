import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import TableContainer from './TableContainer'

export default {
  title: 'Drag and Drop',
}

export const Table = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <TableContainer />
    </DndProvider>
  )
}
