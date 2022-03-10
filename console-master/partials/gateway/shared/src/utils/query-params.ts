//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'

export const makeSortByQueryParam = (sort: {
  sortBy?: string
  sortDir?: 'asc' | 'desc' | 'ASC' | 'DESC' | string
}): undefined | string => {
  if (isEmpty(sort.sortBy)) return undefined

  if (!isEmpty(sort.sortDir)) {
    return `${sort.sortBy} ${sort.sortDir.toUpperCase()}`
  }

  return sort.sortBy
}
