//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty, reject } from 'lodash-es'

import type { FormGridLayoutProps } from './types'

export const makeFormGridLayoutValues = ({
  columns,
  formValues,
}: {
  columns: FormGridLayoutProps['columns']
  formValues: Record<string, Record<string, unknown>[]>
}) => {
  const finalFormValues = [[]]
  let rowIndex = 0

  if (isEmpty(formValues)) {
    return []
  }

  Object.values(formValues).forEach((record: Record<string, unknown>[], index) => {
    if (index > 0 && index % columns.length === 0) {
      finalFormValues.push([])
      rowIndex++
    }

    finalFormValues[rowIndex].push(reject(record, isEmpty))
  })

  return finalFormValues.reverse()
}
