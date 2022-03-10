//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { serializeParams } from './serialize-params'

describe('serializeParams', () => {
  it('should parse object to valid query string', () => {
    expect(
      serializeParams({
        max: 20,
        offset: 0,
        sortBy: 'rank',
      }),
    ).toStrictEqual('max=20&offset=0&sortBy=rank')
  })

  it('should parse object with nested objects to valid query string', () => {
    expect(
      serializeParams({
        max: 20,
        query: {
          entityType: 'NetworkAccessControl',
          serviceId: 'big.blackberry.com',
        },
        sortBy: 'rank',
      }),
    ).toStrictEqual('max=20&query=entityType%3DNetworkAccessControl,serviceId%3Dbig.blackberry.com&sortBy=rank')
  })
})
