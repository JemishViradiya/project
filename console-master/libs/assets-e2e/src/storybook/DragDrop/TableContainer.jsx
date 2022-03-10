import React from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'

import { useDragDrop } from './dragdrop.hooks'
import TableRow from './TableRow'

const data = [
  {
    id: 1,
    text: 'Row with rule 1',
  },
  {
    id: 2,
    text: 'Row with rule 2',
  },
  {
    id: 3,
    text: 'Row with rule 3',
  },
  {
    id: 4,
    text: 'Row with rule 4',
  },
  {
    id: 5,
    text: 'Row with rule 5',
  },
]

const Container = () => {
  const { cards, moveCard, stepUp, stepDown } = useDragDrop(data)

  const renderRow = (row, index) => {
    return (
      <TableRow key={row.id} index={index} id={row.id} text={row.text} moveCard={moveCard} stepUp={stepUp} stepDown={stepDown} />
    )
  }

  return (
    <Table stickyHeader={false}>
      <TableBody>{cards.map((card, i) => renderRow(card, i))}</TableBody>
    </Table>
  )
}

export default Container
