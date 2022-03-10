//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { stringify } from 'query-string'

interface Params {
  [name: string]: string | number | Params
}

export const serializeParams = <TParams = Params>(params: TParams): string =>
  stringify(
    Object.entries(params).reduce(
      (acc, [name, value]) => ({
        ...acc,
        [name]: typeof value === 'object' ? Object.entries(value).map(([name, value = '']) => `${name}=${value}`) : value,
      }),
      {},
    ),
    { arrayFormat: 'comma', skipNull: true },
  )
