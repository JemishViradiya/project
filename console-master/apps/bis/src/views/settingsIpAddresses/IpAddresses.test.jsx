import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import { MemoryRouter } from 'react-router'
import { useNavigate } from 'react-router-dom'

import { act, findByTestId, fireEvent, render, screen } from '@testing-library/react'

import { MockedApolloProvider } from '../../../tests/utils'
import useCapabilityMock from '../../components/hooks/useCapability'
import IpAddresses from '.'
import { createIpAddresses, createSingleIpAddresses } from './__fixtures__/ipAddresses.fixture'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn().mockReturnValue(jest.fn()),
}))

jest.mock('../../components/hooks/useCapability')

jest.mock('react-virtualized', () => ({
  ...jest.requireActual('react-virtualized'),
  AutoSizer: ({ children }) => <div>{children({ width: 100, height: 100 })}</div>,
}))

const DEFAULT_SUT_PARAMS = {
  mocks: [createIpAddresses({ isBlacklist: false })],
  props: {
    ipAddressListTab: 'trusted',
  },
}

const ERROR_MESSAGES = {
  FIELD_REQUIRED: 'This field is required',
  INVALID_FORMAT: 'The format of one or more IP addresses is invalid',
  INVALID_NAME: 'Invalid name',
}

const createSut = ({ props, mocks } = DEFAULT_SUT_PARAMS) => {
  return render(
    <MemoryRouter initialEntries={['/TENANT_ID/settings/ip-addresses/trusted']}>
      <MockedApolloProvider mocks={mocks}>
        <IpAddresses {...props} />
      </MockedApolloProvider>
    </MemoryRouter>,
  )
}

describe('IpAddresses', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render title', () => {
    useCapabilityMock.mockReturnValue([true])
    createSut()

    expect(screen.getByText('IP address configuration')).toBeTruthy()
  })

  describe('tab', () => {
    it('should render tabs', () => {
      // given
      useCapabilityMock.mockReturnValue([true])
      createSut()

      // then
      const tabs = screen.getAllByRole('tab')
      expect(tabs[0]).toHaveTextContent('Trusted IP addresses')
      expect(tabs[1]).toHaveTextContent('Untrusted IP addresses')
    })

    it('should call navigate on untrusted tab click', () => {
      // given
      useCapabilityMock.mockReturnValue([true])
      const navigateMock = jest.fn()
      useNavigate.mockReturnValue(navigateMock)
      createSut()

      // when
      const blacklistTab = screen.getByText('Untrusted IP addresses')
      fireEvent.click(blacklistTab)

      // then
      expect(navigateMock).toHaveBeenCalledWith('./untrusted')
    })
  })

  it('should render headers', async () => {
    // given
    useCapabilityMock.mockReturnValue([true])
    const mocks = [createIpAddresses({ isBlacklist: false })]
    createSut({ mocks })

    // when
    await screen.findByRole('table')

    // then
    const headers = screen.getAllByRole('columnheader')
    expect(headers[1]).toHaveTextContent('Name')
    expect(headers[2]).toHaveTextContent('Detail')
  })

  it('should render add button when ipAddress capability is provided', async () => {
    // given
    useCapabilityMock.mockReturnValue([true])
    createSut()

    // then
    expect(screen.getByTitle('Add IP Address list')).toBeTruthy()
  })

  it('should render delete button when ipAddress capability is provided and at least one IP Address list is selected', async () => {
    // given
    useCapabilityMock.mockReturnValue([true])
    const mocks = [createIpAddresses({ isBlacklist: false })]
    createSut({ mocks })

    // when
    await act(async () => {
      await screen.findByRole('table')
      fireEvent.click(screen.getAllByRole('checkbox')[1])
    })

    // then
    expect(screen.getByTitle('Delete')).toBeTruthy()
    expect(screen.queryByText('1 item selected')).toBeTruthy()
  })

  it('should render more buttons when at least 4 or more ipAddresses provided', async () => {
    // given
    useCapabilityMock.mockReturnValue([true])
    const mocks = [createIpAddresses({ isBlacklist: false, ipAddressesLength: 4 })]
    createSut({ mocks })

    // when
    await act(async () => {
      await screen.findByRole('table')
    })

    // then
    expect(screen.getAllByText('1 more').length).toBe(3)
  })

  it('should render modal after more button is clicked', async () => {
    // given
    useCapabilityMock.mockReturnValue([true])
    const commonIpAddressMockOptions = { isBlacklist: false, ipAddressesLength: 4 }
    const mocks = [
      createIpAddresses(commonIpAddressMockOptions),
      createSingleIpAddresses({ ...commonIpAddressMockOptions, ipAddressListIndex: 0 }),
    ]
    createSut({ mocks })

    // when
    await act(async () => {
      await screen.findByRole('table')
      fireEvent.click(screen.getAllByText('1 more')[0])
    })

    screen.findByTestId('ip-address-modal-name-field')

    // then
    expect(screen.getByTestId('ip-address-modal-name-field')).toBeTruthy()
    expect(screen.getByTestId('ip-address-modal-ip-addresses-source-field')).toBeTruthy()
    expect(screen.getByTestId('ip-address-modal-ip-addresses-field')).toBeTruthy()
    expect(screen.queryByText('Cancel')).toBeTruthy()
    expect(screen.queryByText('Save')).toBeTruthy()
  })

  describe('should render proper error messages of IpAddressModal', () => {
    it.each`
      value              | errorMessage
      ${''}              | ${ERROR_MESSAGES.FIELD_REQUIRED}
      ${'  '}            | ${ERROR_MESSAGES.INVALID_NAME}
      ${'6'.repeat(250)} | ${undefined}
      ${'6'.repeat(251)} | ${ERROR_MESSAGES.INVALID_NAME}
      ${'name'}          | ${undefined}
    `(
      'should has $expectedResult error message when field name equals $value and submit has been clicked',
      async ({ value, errorMessage }) => {
        // given
        useCapabilityMock.mockReturnValue([true])
        const mocks = [createIpAddresses({ isBlacklist: false })]
        createSut({ mocks })

        // when
        await act(async () => {
          await screen.findByRole('table')
          fireEvent.click(screen.getByTitle('Add IP Address list'))
          fireEvent.input(screen.getByTestId('ipAddresses-name-input'), { target: { value } })
          fireEvent.input(screen.getByTestId('ipAddresses-list-area'), { target: { value: '66.66.66.66' } })
          fireEvent.click(screen.getByText('Save'))
        })

        // then
        if (errorMessage) {
          expect(screen.queryByText(errorMessage)).toBeTruthy()
        }
      },
    )

    it.each`
      value                                               | errorMessage
      ${''}                                               | ${ERROR_MESSAGES.FIELD_REQUIRED}
      ${' '}                                              | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'0.0.0.0'}                                        | ${undefined}
      ${'ipAddress'}                                      | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${' \n \n \n'}                                      | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'0.0.0.0\n'}                                      | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'\n0.0.0.0'}                                      | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'12.'}                                            | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'12.12.'}                                         | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'12.12.12.'}                                      | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'256.255.255.255'}                                | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'255.256.255.255'}                                | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'255.255.256.255'}                                | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'255.255.255.256'}                                | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'255.255.255.2555'}                               | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'255.255.255.6\n255.255.255.66\n'}                | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'255.255.255.255\n255.255.255.255'}               | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'255.255.255.254\n255.255.255.255\n3.3.3.3'}      | ${undefined}
      ${'255.255.255.255\n18.3.6.0/32\n255.255.255.2-26'} | ${undefined}
      ${'255.255.255.25-25'}                              | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'255.255.255.25-256'}                             | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'255.255.255.25-24'}                              | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'255.255.255.25-26'}                              | ${undefined}
      ${'18.3.6.0/32'}                                    | ${undefined}
      ${'18.3.6.0/33'}                                    | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'18.3.6.0/'}                                      | ${ERROR_MESSAGES.INVALID_FORMAT}
      ${'18.3.6/32'}                                      | ${ERROR_MESSAGES.INVALID_FORMAT}
    `(
      'should has $expectedResult error message when field ipAddresses equals $value and submit has been clicked',
      async ({ value, errorMessage }) => {
        // given
        useCapabilityMock.mockReturnValue([true])
        const mocks = [createIpAddresses({ isBlacklist: false })]
        createSut({ mocks })

        // when
        await act(async () => {
          await screen.findByRole('table')
          fireEvent.click(screen.getByTitle('Add IP Address list'))
          fireEvent.input(screen.getByTestId('ipAddresses-name-input'), { target: { value: 'name' } })
          fireEvent.input(screen.getByTestId('ipAddresses-list-area'), { target: { value } })
          fireEvent.click(screen.getByText('Save'))
        })

        // then

        if (errorMessage) {
          expect(screen.queryByText(errorMessage)).toBeTruthy()
        }
      },
    )
  })
})
