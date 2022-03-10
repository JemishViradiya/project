//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { serializeQueryParameter } from '@ues-data/shared'

export const encodeIdQueryValues = (ids: string[]) =>
  serializeQueryParameter('id', {
    value: encodeURI(`[${ids.join('|')}]`),
  })
