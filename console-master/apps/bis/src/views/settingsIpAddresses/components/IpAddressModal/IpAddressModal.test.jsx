import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, fireEvent, render, screen } from '@testing-library/react'

import IpAddressModal from './index'

const onCloseMock = jest.fn()
const handleAddIpAddressListMock = jest.fn()
const handleUpdateIpAddressListMock = jest.fn()

const defaultProps = {
  dialogId: 'test-dialog-id',
  canEdit: true,
  onClose: onCloseMock,
  isBlacklist: false,
  handleAddIpAddressList: handleAddIpAddressListMock,
  handleUpdateIpAddressList: handleUpdateIpAddressListMock,
  isEditMode: false,
}

const createSut = props => render(<IpAddressModal {...(props || defaultProps)} />)

describe('renders IpAddressModal', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should not render components when show is disabled', () => {
    // given
    const { dialogId, ...restDefaultProps } = defaultProps
    createSut({ ...restDefaultProps })

    // then
    expect(screen.queryByText('Untrusted IP addresses')).toBeFalsy()
    expect(screen.queryByTestId('ipAddresses-name-input')).toBeFalsy()
    expect(screen.queryByTestId('ip-address-modal-ip-addresses-source-field')).toBeFalsy()
    expect(screen.queryByTestId('ipAddresses-list-area')).toBeFalsy()
    expect(screen.queryByText('Cancel')).toBeFalsy()
    expect(screen.queryByText('Save')).toBeFalsy()
  })

  it('should render proper components when show is enabled and isBlackList is disabled', () => {
    // given
    createSut()

    // then
    expect(screen.queryByText('Trusted IP addresses')).toBeTruthy()
    expect(screen.queryByTestId('ipAddresses-name-input')).toBeTruthy()
    expect(screen.queryByTestId('ip-address-modal-ip-addresses-source-field')).toBeTruthy()
    expect(screen.queryByTestId('ipAddresses-list-area')).toBeTruthy()
    expect(screen.queryByText('Cancel')).toBeTruthy()
    expect(screen.queryByText('Save')).toBeTruthy()
  })

  it('should render proper title when isBlackList is enabled', () => {
    // given
    createSut({ ...defaultProps, isBlacklist: true })

    // then
    expect(screen.queryByText('Untrusted IP addresses')).toBeTruthy()
  })

  it('should show an error message when submit has been clicked', async () => {
    // given
    createSut()

    // when
    await act(async () => {
      await fireEvent.input(screen.getByTestId('ipAddresses-name-input'), { target: { value: 'name' } })
      await fireEvent.input(screen.getByTestId('ipAddresses-list-area'), { target: { value: '' } })
      await fireEvent.click(screen.getByText('Save'))
    })

    // then
    expect(screen.queryByText('This field is required')).toBeTruthy()
  })
  it('add mutation should be called with proper data after save click', async () => {
    // given
    createSut()
    const expectedResult = {
      variables: {
        input: {
          ipAddresses: ['66.66.66.66'],
          isBlacklist: false,
          listType: 'user',
          name: 'name',
        },
      },
    }

    // when
    await act(async () => {
      await fireEvent.input(screen.getByTestId('ipAddresses-name-input'), { target: { value: 'name' } })
      await fireEvent.input(screen.getByTestId('ipAddresses-list-area'), { target: { value: '66.66.66.66' } })
      await fireEvent.click(screen.getByText('Save'))
    })

    // then
    expect(handleAddIpAddressListMock).toHaveBeenCalledWith(expectedResult)
  })
  it('update mutation should be called with proper data after save click', async () => {
    // given
    createSut({ ...defaultProps, isEditMode: true })
    const expectedResult = {
      variables: {
        id: undefined,
        input: {
          ipAddresses: ['66.66.66.66'],
          name: 'name',
        },
      },
    }

    // when
    await act(async () => {
      await fireEvent.input(screen.getByTestId('ipAddresses-name-input'), { target: { value: 'name' } })
      await fireEvent.input(screen.getByTestId('ipAddresses-list-area'), { target: { value: '66.66.66.66' } })
      await fireEvent.click(screen.getByText('Save'))
    })

    // then
    expect(handleUpdateIpAddressListMock).toHaveBeenCalledWith(expectedResult)
  })
})
