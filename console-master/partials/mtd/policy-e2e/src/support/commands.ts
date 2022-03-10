/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import '@testing-library/cypress/add-commands'

import { notExist } from './settings'

export const payloads = 'payloads.json'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ChainableI<Subject> {
      verifySnackbarMsg(message: string): void
    }
  }
}

Cypress.Commands.add('verifySnackbarMsg', (msg: string) => {
  I.findByRole('alert').should('contain', msg).find('button').click()
  // Make sure testcase is synchronized with message being removed
  I.findByRole('alert').should(notExist)
})
