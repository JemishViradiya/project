import React from 'react'

import { cleanup, fireEvent, render } from '@testing-library/react'

import { BlockAllModal, BlockRequestingModal } from './AssignActionModal'

jest.mock('../../../../components/hooks/useClientParams', () => ({
  __esModule: true,
  default: () => ({
    helpUrl: 'http://link-to.nowhere/',
  }),
}))

describe('AssignActionModal', () => {
  afterEach(cleanup)

  describe.each`
    Component               | description
    ${BlockAllModal}        | ${"When a user is detected with the risk factors, block all BlackBerry Dynamics apps from all of the user's activated devices in UEM. Users cannot unblock the apps. The apps will be unblocked when the detected risk factor is no longer present."}
    ${BlockRequestingModal} | ${'When a user is detected with the risk factors, block only the BlackBerry Dynamics app that initiated the request (from that device). The app will be unblocked when the risk factor is no longer present.'}
  `('$Component', ({ Component, description }) => {
    it('should be rendered correctly', () => {
      const mockOnAssign = jest.fn()
      const mockOnCancel = jest.fn()

      const { getByText } = render(<Component dialogId="test-dialog-id" onAssign={mockOnAssign} onCancel={mockOnCancel} />)

      const assignBtn = getByText('Assign')
      const cancelBtn = getByText('Cancel')
      const link = getByText('Learn more')

      fireEvent.click(assignBtn)
      fireEvent.click(cancelBtn)

      expect(link).not.toBeNull()
      expect(link.href).toBe('http://link-to.nowhere/')
      expect(assignBtn).not.toBeNull()
      expect(cancelBtn).not.toBeNull()
      expect(mockOnAssign).toHaveBeenCalled()
      expect(mockOnCancel).toHaveBeenCalled()
      expect(getByText(description)).not.toBeNull()
    })
  })
})
