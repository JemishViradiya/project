//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import * as WebSocket from 'ws'

// gives time for pact mock server to start
export const DEFAULT_JEST_TEST_TIMEOUT_INTERVAL = 10000

jest.setTimeout(DEFAULT_JEST_TEST_TIMEOUT_INTERVAL)

// url is used to resolve the network layer api endpoints
global.window = Object.assign(Object.create(global), {
  location: new URL('https://test-ues.cylance.com'),
})

Object.assign(global, {
  WebSocket: WebSocket,
  btoa: src => Buffer.from(src, 'utf-8').toString('base64'),
  atob: src => Buffer.from(src, 'base64').toString('utf-8'),
})
