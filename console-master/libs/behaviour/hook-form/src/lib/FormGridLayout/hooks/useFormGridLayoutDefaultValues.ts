//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { flatten, isEmpty } from 'lodash-es'
import { useMemo } from 'react'

import type { FormGridLayoutProps } from '../types'

export const useFormGridLayoutDefaultValues = (initialValues: FormGridLayoutProps['initialValues']) =>
  useMemo(
    () =>
      !isEmpty(initialValues)
        ? Object.assign(
            {},
            ...flatten(initialValues.map((row, rowIndex) => row.map((col, colIndex) => ({ [`${rowIndex}${colIndex}`]: col })))),
          )
        : {},
    [initialValues],
  )
