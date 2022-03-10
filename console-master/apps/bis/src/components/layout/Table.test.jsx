import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import { Column } from 'react-virtualized'

import { render, screen } from '@testing-library/react'

import Table from './Table'

const DEFAULT_PROPS = {
  rowClassName: ({ index }) => (index < 0 ? 'headerRow' : 'row'),
  headerHeight: 25,
  height: 100,
  rowGetter: () => {},
  rowHeight: 35,
  rowCount: 10,
  width: 150,
  gridWidth: 150,
}

const createSut = props => {
  return render(<Table {...DEFAULT_PROPS} {...props} />)
}

describe('Table', () => {
  it('should render grid with passed styles', () => {
    createSut()

    expect(screen.getByRole('rowgroup', { name: 'grid' })).toHaveStyle(`
      height: 100px;
      width: 150px;
    `)
  })

  it('should render header with passed styles', () => {
    // when
    createSut()

    // then
    const header = screen.queryAllByRole('row')[0]
    expect(header).toHaveStyle(`
      height: 25px;
      width: 150px;
    `)
    expect(header).toHaveClass('headerRow')
  })

  it('should render columns without flex-shrink', () => {
    // given
    const cellDataGetter = () => {}
    const children = [
      <Column key="col1" dataKey="col1" cellDataGetter={cellDataGetter} width={40} maxWidth={50} />,
      <Column key="col2" dataKey="col2" cellDataGetter={cellDataGetter} width={40} minWidth={30} />,
      <Column key="col3" dataKey="col3" cellDataGetter={cellDataGetter} width={40} />,
    ]

    // when
    createSut({ children })

    // then
    const columnHeaders = screen.queryAllByRole('columnheader')
    expect(columnHeaders[0]).toHaveStyle(`
      flex: 0 0 40px;
      max-width: 50px;
    `)
    expect(columnHeaders[1]).toHaveStyle(`
      flex: 0 0 40px;
      min-width: 30px;
    `)
    expect(columnHeaders[2]).toHaveStyle(`
      flex: 0 0 40px;
    `)
  })
})
