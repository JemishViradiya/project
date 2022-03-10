/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

describe('console', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
  })

  beforeEach(() => {
    I.visit('/')
  })

  it('should display side nav', () => {
    I.findByRole('navigation').should('be.visible')
    I.findByRole('main').should('not.be.empty')
  })
})
