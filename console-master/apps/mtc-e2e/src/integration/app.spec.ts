/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { getGreeting } from '../support/app.po'

describe('mtc', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
  })

  beforeEach(() => {
    I.visit('/')
  })

  it('should display welcome message', () => {
    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains('Multi-Tenant Console Sign-In')
  })
})
