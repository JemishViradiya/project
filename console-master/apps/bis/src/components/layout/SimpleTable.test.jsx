import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { cleanup, render } from '@testing-library/react'

import SimpleTable from './SimpleTable'

describe('SimpleTable', () => {
  afterEach(cleanup)

  it('render with default properties', () => {
    const columns = [{ accessor: 'policy' }, { accessor: 'desc' }]
    const data = [
      { policy: 'ISS policy', desc: 'Default' },
      { policy: 'Group', desc: 'Critical risk users' },
    ]
    const { container, getAllByRole } = render(<SimpleTable columns={columns} data={data} />)

    // Check table was rendered.
    expect(container.querySelectorAll('table')).toHaveLength(1)
    expect(getAllByRole('row')).toHaveLength(2)
    expect(container.querySelectorAll('td')).toHaveLength(4)
  })

  it('merging and overwriting properties', () => {
    const { container } = render(<SimpleTable className="myTable" minRows={5} columns={[]} data={[]} />)

    // Check table was rendered.
    const table = container.querySelectorAll('table')
    expect(table.length).toEqual(1)

    // Check properties can be merged or overwritten properly.
    expect(container.querySelectorAll('.myTable')).toHaveLength(1)
  })
})
