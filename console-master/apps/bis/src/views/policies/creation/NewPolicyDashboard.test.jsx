import React from 'react'
import { MemoryRouter } from 'react-router'
import { useNavigate } from 'react-router-dom'

import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react'

import { PolicyListAddMutation, PolicyListDetailsQuery, PolicyListQuery } from '@ues-data/bis'

import { createAvailablePolicyActionsQueryMock } from '../__fixtures__/AvailableActionsQuery.fixture'
import { MockedApolloProvider } from '../../../../tests/utils'
import useClientParamsMock from '../../../components/hooks/useClientParams'
import { createLocalGroupsQueryMock } from '../../../providers/__fixtures__/LocalGroups.fixture'
import PolicyListProvider from '../../../providers/PolicyListProvider'
import { StandaloneCapability as capability } from '../../../shared'
import { createGeozoneListQueryMock } from '../../geozones/__fixtures__/geozoneListQuery.fixture'
import { backToPolicyList as backToPolicyListMock } from '../../policyInfo/common'
import { default as NewPolicyDashboard } from '.'
import fetchRiskEnginesSettingsCallFixture from './__fixtures__/fetchRiskEnginesSettingsCallFixture'

const { query: policyListQuery } = PolicyListQuery
const { query: policyListDetailsQuery } = PolicyListDetailsQuery
const { mutation: policyListAddMutation } = PolicyListAddMutation

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn().mockReturnValue(jest.fn()),
  useLocation: jest.fn().mockReturnValue({ pathname: '/policies/create' }),
}))

jest.mock('../../policyInfo/common', () => ({
  backToPolicyList: jest.fn(),
  processReAuthAction: input => input,
  processDisabledRiskFactors: input => input,
}))
jest.mock('../../../components/hooks/useClientParams', () => jest.fn(() => ({})))

const CAPABILITIES_WITH_POLICIES = [capability.POLICIES]
const EMPTY_CAPABILITIES = []

const geozoneListMock = createGeozoneListQueryMock()
const localGroupsMock = createLocalGroupsQueryMock()
const availableActionsMock = createAvailablePolicyActionsQueryMock()

const DEFAULT_MOCKS = [
  fetchRiskEnginesSettingsCallFixture,
  {
    request: { query: policyListDetailsQuery },
    result: { data: {} },
  },
  {
    request: { query: policyListQuery },
    result: { data: { policies: [] } },
  },
  availableActionsMock,
  geozoneListMock,
  localGroupsMock,
]

const testedComponent = (mocks = DEFAULT_MOCKS) => (
  <MemoryRouter>
    <MockedApolloProvider mocks={mocks}>
      <PolicyListProvider>
        <NewPolicyDashboard />
      </PolicyListProvider>
    </MockedApolloProvider>
  </MemoryRouter>
)

const createSut = mocks => render(testedComponent(mocks))

const waitForData = () => act(async () => new Promise(resolve => setTimeout(resolve, 1)))

describe('NewPolicyDashboard', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should render loading indicator when policies are not fetched yet', () => {
    const loadingIndicatorText = 'Loading'

    const sut = createSut()

    expect(sut.getByLabelText(loadingIndicatorText)).toBeTruthy()
  })

  describe('close button', () => {
    it('should call push when history has no visited pages', async () => {
      // given
      useClientParamsMock.mockReturnValue(CAPABILITIES_WITH_POLICIES)
      const backButtonLabel = /Back/i
      const sut = createSut()
      await waitForData()

      // when
      await act(async () => {
        fireEvent.click(sut.getByLabelText(backButtonLabel))
      })

      // then
      expect(backToPolicyListMock).toHaveBeenCalled()
    })
  })

  describe.each(['Save', 'Cancel'])('%s button', buttonText => {
    it('should be rendered when user has required capability', async () => {
      // when
      useClientParamsMock.mockReturnValue(CAPABILITIES_WITH_POLICIES)
      const sut = createSut()
      await waitForData()

      // then
      expect(sut.getByText(buttonText)).toBeTruthy()
    })

    it('should not be rendered when user does not have required capability', async () => {
      // when
      useClientParamsMock.mockReturnValue(EMPTY_CAPABILITIES)
      const sut = createSut()
      await waitForData()

      // then
      expect(sut.queryByText(buttonText)).toBeFalsy()
    })
  })

  describe('submit', () => {
    const nameInputLabel = /name/i

    beforeEach(() => {
      useClientParamsMock.mockReturnValue(CAPABILITIES_WITH_POLICIES)
    })

    it('should create policy', async () => {
      // given
      const descriptionInputLabel = /description/i
      let createPolicyCall = false
      const mocks = [
        ...DEFAULT_MOCKS,
        {
          request: {
            query: policyListAddMutation,
            variables: {
              input: {
                name: 'NAME',
                description: 'DESCRIPTION',
                policyData: {
                  identityPolicy: {
                    riskFactors: ['behavioral'],
                    fixUp: { enabled: false, minimumBehavioralRiskLevel: 'HIGH', actionPauseDuration: 7200 },
                  },
                  geozonePolicy: { riskFactors: ['defined', 'learned'] },
                },
              },
            },
          },
          newData: () => {
            createPolicyCall = true
            return {
              data: {
                createPolicy: {
                  appliedGroups: null,
                  appliedUsers: null,
                  description: null,
                  name: null,
                  id: null,
                },
              },
            }
          },
        },
      ]
      const sut = createSut(mocks)
      await waitForData()
      await act(async () => {
        fireEvent.input(sut.getByLabelText(nameInputLabel), { target: { value: 'NAME' } })
        fireEvent.input(sut.getByLabelText(descriptionInputLabel), { target: { value: 'DESCRIPTION' } })
      })

      // when
      await act(async () => {
        fireEvent.click(sut.container.querySelector('button[type=submit]'))
      })
      // then
      await waitFor(() => expect(createPolicyCall).toBe(true))
    })

    it('should redirect to applied users form when click yes button on modal', async () => {
      // given
      const replaceMock = jest.fn()
      useNavigate.mockReturnValue(replaceMock)
      const modalYesButton = /yes/i
      const redirectionModalTextRegex = /The policy has been added*/i
      const mocks = [
        ...DEFAULT_MOCKS,
        {
          request: {
            query: policyListAddMutation,
            variables: {
              input: {
                name: 'NAME',
                description: '',
                policyData: {
                  identityPolicy: {
                    riskFactors: ['behavioral'],
                    fixUp: { enabled: false, minimumBehavioralRiskLevel: 'HIGH', actionPauseDuration: 7200 },
                  },
                  geozonePolicy: { riskFactors: ['defined', 'learned'] },
                },
              },
            },
          },
          result: {
            data: {
              createPolicy: {
                appliedGroups: null,
                appliedUsers: null,
                description: null,
                name: null,
                id: 'POLICY_ID',
              },
            },
          },
        },
      ]
      const sut = createSut(mocks)
      await waitForData()
      await act(async () => {
        fireEvent.input(sut.getByLabelText(nameInputLabel), { target: { value: 'NAME' } })
      })
      await act(async () => {
        fireEvent.click(sut.container.querySelector('button[type=submit]'))
      })
      await waitFor(() => sut.getByText(redirectionModalTextRegex))

      // when
      await act(async () => {
        fireEvent.click(sut.getByText(modalYesButton))
      })

      // then
      expect(replaceMock).toHaveBeenCalledWith('/policies/POLICY_ID/applied', { replace: true })
    })
  })
})
