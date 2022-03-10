//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { filterOutHiddenColumns } from './utils'

const columns = [
  {
    dataKey: 'anomaly',
    label: 'Anomaly',
    hidden: true,
    sortable: true,
  },
  {
    dataKey: 'user',
    label: 'User',
    persistent: true,
  },
  {
    dataKey: 'platform',
    label: 'Platform',
  },
]

describe('Table - Utils', () => {
  describe('filterOutHiddenColumns', () => {
    const expectedColumns = [
      {
        dataKey: 'user',
        label: 'User',
        persistent: true,
      },
      {
        dataKey: 'platform',
        label: 'Platform',
      },
    ]

    it('should return only not hidden columns', () => {
      expect(filterOutHiddenColumns(columns)).toStrictEqual(expectedColumns)
    })
  })
})
