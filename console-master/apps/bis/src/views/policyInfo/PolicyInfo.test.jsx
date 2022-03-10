import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router'

import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'

import { PolicyListDetailsQuery, PolicyListQuery, PolicyListUpdateMutation, RiskEnginesSettingsQuery } from '@ues-data/bis'

import { MockedApolloProvider } from '../../../tests/utils'
import useClientParamsMock from '../../components/hooks/useClientParams'
import { createLocalGroupsQueryMock } from '../../providers/__fixtures__/LocalGroups.fixture'
import PolicyListProvider from '../../providers/PolicyListProvider'
import { createGeozoneListQueryMock } from '../geozones/__fixtures__/geozoneListQuery.fixture'
import { createAvailablePolicyActionsQueryMock } from '../policies/__fixtures__/AvailableActionsQuery.fixture'
import PolicyInfo from '.'

const { query: policyListQuery } = PolicyListQuery
const { query: policyListDetailsQuery } = PolicyListDetailsQuery
const { mutation: policyListUpdateMutation } = PolicyListUpdateMutation
const riskEnginesSettingsQuery = RiskEnginesSettingsQuery(false, false).query

jest.mock('../../components/hooks/useClientParams', () => jest.fn(() => []))

const POLICY_ID = 'POLICY_ID'
const POLICIES_CAPABILITY = 'policies'
const CAPABILITIES_WITH_POLICIES = [POLICIES_CAPABILITY]
const EMPTY_CAPABILITIES = []

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({
    id: POLICY_ID,
  })),
}))
const defaultPoliciesQueryResult = {
  loading: false,
  data: {
    policies: [
      {
        appliedGroups: null,
        appliedUsers: null,
        description: null,
        name: null,
        id: POLICY_ID,
      },
    ],
  },
}

const defaultPolicyQueryResult = {
  loading: false,
  data: {
    policy: {
      id: POLICY_ID,
      appliedGroups: null,
      appliedUsers: null,
      description: null,
      name: null,
      updatedByUser: null,
      updatedAt: null,
      policyData: {
        identityPolicy: null,
        geozonePolicy: null,
      },
    },
  },
}

const defaultRiskEnginesSettingsQueryResult = {
  loading: false,
  data: {
    settings: {
      definedGeozones: { enabled: null },
      learnedGeozones: {
        enabled: null,
        geozoneDistance: {
          innerRadius: null,
          outerRadius: null,
        },
      },
      behavioral: {
        enabled: null,
        riskLevels: null,
      },
      appAnomalyDetection: { enabled: null },
      ipAddress: {
        enabled: null,
      },
    },
  },
}

const riskEngineSettingsCallMock = {
  request: { query: riskEnginesSettingsQuery },
  result: defaultRiskEnginesSettingsQueryResult,
}

const policiesCallMock = {
  request: { query: policyListQuery },
  result: defaultPoliciesQueryResult,
}

const policyCallMock = {
  request: { query: policyListDetailsQuery, variables: { id: POLICY_ID } },
  result: defaultPolicyQueryResult,
}

const geozoneListMock = createGeozoneListQueryMock()
const localGroupsMock = createLocalGroupsQueryMock()
const availableActionsMock = createAvailablePolicyActionsQueryMock()

const defaultMocks = [
  riskEngineSettingsCallMock,
  policiesCallMock,
  policyCallMock,
  geozoneListMock,
  localGroupsMock,
  availableActionsMock,
]

const testedComponent = (props, mocks = defaultMocks) => {
  return (
    <MockedApolloProvider mocks={mocks}>
      <MemoryRouter initialEntries={[`/TENANT_ID/policies/${POLICY_ID}`]}>
        <PolicyListProvider>
          <PolicyInfo {...props} />
        </PolicyListProvider>
      </MemoryRouter>
    </MockedApolloProvider>
  )
}

const createSut = (props, mocks) => {
  return render(testedComponent(props, mocks))
}

describe('PolicyInfo', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should render loading indicator when page is initialized', () => {
    const loadingIndicatorText = 'Loading'

    const sut = createSut()

    expect(sut.getByLabelText(loadingIndicatorText)).toBeTruthy()
  })

  describe.each(['Save', 'Cancel'])('%s button', buttonText => {
    it('should be rendered when user has required capability', async () => {
      // when
      useClientParamsMock.mockReturnValue(CAPABILITIES_WITH_POLICIES)
      const sut = createSut()
      await waitFor(() => sut.getByText(buttonText))

      // then
      expect(sut.getByText(buttonText)).toBeTruthy()
    })

    it('should not be rendered when user does not have required capability', async () => {
      // when
      useClientParamsMock.mockReturnValue(EMPTY_CAPABILITIES)
      const sut = createSut()
      await waitFor(() => sut.queryByText(buttonText))

      // then
      expect(sut.queryByText(buttonText)).toBeFalsy()
    })
  })

  describe('Delete button', () => {
    const deleteName = 'Delete'
    it('should be rendered when user has required capability', async () => {
      // when
      useClientParamsMock.mockReturnValue(CAPABILITIES_WITH_POLICIES)
      const sut = createSut()
      await waitFor(() => sut.getByTitle(deleteName))

      // then
      expect(sut.getByTitle(deleteName)).toBeTruthy()
    })

    it('should not be rendered when user does not have required capability', async () => {
      // when
      useClientParamsMock.mockReturnValue(EMPTY_CAPABILITIES)
      const sut = createSut()
      await waitFor(() => sut.queryByTitle(deleteName))

      // then
      expect(sut.queryByTitle(deleteName)).toBeFalsy()
    })
  })

  describe('submit', () => {
    it('should call', async () => {
      // given
      useClientParamsMock.mockReturnValue(CAPABILITIES_WITH_POLICIES)
      const updateMock = jest.fn()
      const mocks = [
        ...defaultMocks,
        {
          request: {
            query: policyListUpdateMutation,
            variables: {
              id: 'POLICY_ID',
              input: {
                name: 'NAME_INPUT_VALUE',
                description: 'DESCRIPTION_INPUT_VALUE',
                policyData: {},
              },
            },
          },
          result: updateMock.mockReturnValue({
            data: {
              ...defaultPolicyQueryResult.data,
              updatePolicy: {
                id: POLICY_ID,
                appliedGroups: null,
                appliedUsers: null,
                description: null,
                name: null,
              },
            },
          }),
        },
      ]
      const sut = createSut({}, mocks)
      await waitFor(() => sut.getByLabelText(/name/i))
      await act(async () => {
        await fireEvent.input(sut.getByLabelText(/name/i), { target: { value: 'NAME_INPUT_VALUE' } })
        await fireEvent.input(sut.getByLabelText(/description/i), { target: { value: 'DESCRIPTION_INPUT_VALUE' } })
      })

      await act(async () => {
        // when
        await fireEvent.click(sut.container.querySelector('button[type=submit]'))
      })

      // then
      await waitFor(() => expect(updateMock).toHaveBeenCalled())
    })
  })

  describe('Settings', () => {
    const settingsTabText = 'Settings'

    describe('input field', () => {
      const nameInputLabelRegExp = /name/i
      const descriptionInputLabelRegExp = /description/i

      describe.each`
        inputLabelRegExp               | inputLabel
        ${nameInputLabelRegExp}        | ${'Name'}
        ${descriptionInputLabelRegExp} | ${'Description'}
      `('$inputLabel', ({ inputLabelRegExp }) => {
        it('should not be disabled when user has got required capability', async () => {
          // when
          useClientParamsMock.mockReturnValue(CAPABILITIES_WITH_POLICIES)
          const sut = createSut()
          await waitFor(() => sut.getByLabelText(inputLabelRegExp))

          // then
          expect(sut.getByLabelText(inputLabelRegExp).disabled).toBe(false)
        })

        it('should be disabled when user does not have required capability', async () => {
          // when
          useClientParamsMock.mockReturnValue(EMPTY_CAPABILITIES)
          const sut = createSut()
          await waitFor(() => sut.getByLabelText(inputLabelRegExp))

          // then
          expect(sut.getByLabelText(inputLabelRegExp).disabled).toBe(true)
        })
      })

      describe('validation', () => {
        let sut
        const saveButtonText = 'Save'
        const validInputValue = 'SOME_VALID_VALUE'
        const someChar = 'X'
        const some250LongString = someChar.repeat(250)
        const some251LongString = some250LongString.concat(someChar)
        const errorCases = [
          { inputValue: some251LongString, testCase: 'has more than 250 characters' },
          { inputValue: '     '.concat(some250LongString), testCase: 'has 250 characters and whitespaces prefix' },
          { inputValue: some250LongString.concat('      '), testCase: 'has 250 characters and whitespaces suffix' },
        ]

        beforeEach(async () => {
          useClientParamsMock.mockReturnValue(CAPABILITIES_WITH_POLICIES)
          sut = createSut()
          await waitFor(() => sut.getByLabelText(nameInputLabelRegExp))
        })

        describe('Name', () => {
          const errorMessageText = 'The name must be 250 characters or less.'

          it('should not show error when has 250 characters', async () => {
            // given
            await act(async () => {
              await fireEvent.input(sut.getByLabelText(nameInputLabelRegExp), { target: { value: some251LongString } })
              await fireEvent.click(sut.getByText(saveButtonText))
            })
            await waitFor(() => sut.getByText(errorMessageText))

            // when
            await act(async () => {
              await fireEvent.input(sut.getByLabelText(nameInputLabelRegExp), { target: { value: some250LongString } })
            })

            // then
            expect(sut.queryByText(errorMessageText)).toBeFalsy()
          })

          it('should show error when has only whitespaces', async () => {
            // given
            const whitespaces = '         '
            await act(async () => {
              await fireEvent.input(sut.getByLabelText(nameInputLabelRegExp), { target: { value: some251LongString } })
              await fireEvent.click(sut.getByText(saveButtonText))
            })
            await waitFor(() => sut.getByText(errorMessageText))

            // when
            await act(async () => {
              await fireEvent.input(sut.getByLabelText(nameInputLabelRegExp), { target: { value: whitespaces } })
            })

            // then
            expect(sut.queryByText('Invalid name')).toBeTruthy()
          })

          errorCases.forEach(({ inputValue, testCase }) => {
            it(`should show error when ${testCase}`, async () => {
              // when
              await act(async () => {
                await fireEvent.input(sut.getByLabelText(nameInputLabelRegExp), { target: { value: inputValue } })
                await fireEvent.click(sut.getByText(saveButtonText))
              })
              await waitFor(() => sut.getByText(errorMessageText))

              // then
              expect(sut.getByText(errorMessageText)).toBeTruthy()
            })
          })
        })

        describe('Description', () => {
          const errorMessageText = 'The description must be 250 characters or less.'

          it('should not show error when has 250 characters', async () => {
            // given
            await act(async () => {
              await fireEvent.input(sut.getByLabelText(nameInputLabelRegExp), { target: { value: validInputValue } })
              await fireEvent.input(sut.getByLabelText(descriptionInputLabelRegExp), { target: { value: some251LongString } })
              await fireEvent.click(sut.getByText(saveButtonText))
            })
            await waitFor(() => sut.getByText(errorMessageText))

            // when
            await act(async () => {
              await fireEvent.input(sut.getByLabelText(descriptionInputLabelRegExp), { target: { value: some250LongString } })
            })

            // then
            expect(sut.queryByText(errorMessageText)).toBeFalsy()
          })

          errorCases.forEach(({ inputValue, testCase }) => {
            it(`should show error when ${testCase}`, async () => {
              // given
              await act(async () => {
                await fireEvent.input(sut.getByLabelText(nameInputLabelRegExp), { target: { value: validInputValue } })
              })

              // when
              await act(async () => {
                await fireEvent.input(sut.getByLabelText(descriptionInputLabelRegExp), { target: { value: inputValue } })
                await fireEvent.click(sut.getByText(saveButtonText))
              })
              await waitFor(() => sut.getByText(errorMessageText))

              // then
              expect(sut.getByText(errorMessageText)).toBeTruthy()
            })
          })
        })
      })
    })

    describe('risk factors switches', () => {
      const switchesRole = 'checkbox'
      const enabled = true
      const riskEnginesSettingsWithEnabledEnginesQueryResult = {
        loading: false,
        data: {
          settings: {
            definedGeozones: { enabled },
            learnedGeozones: {
              enabled: true,
              geozoneDistance: {
                innerRadius: null,
                outerRadius: null,
              },
            },
            behavioral: {
              enabled,
              riskLevels: null,
            },
            appAnomalyDetection: { enabled },
            ipAddress: { enabled },
          },
        },
      }

      it('should be enabled when user has required capability', async () => {
        // given
        const mocks = [
          {
            request: { query: riskEnginesSettingsQuery },
            result: riskEnginesSettingsWithEnabledEnginesQueryResult,
          },
          policiesCallMock,
          policyCallMock,
          geozoneListMock,
          localGroupsMock,
          availableActionsMock,
        ]

        // when
        useClientParamsMock.mockReturnValue(CAPABILITIES_WITH_POLICIES)
        const sut = createSut({}, mocks)
        await waitFor(() => sut.getByText(settingsTabText))

        // then
        const switchElements = sut.getAllByRole(switchesRole)
        switchElements.forEach(switchElement => {
          expect(switchElement.parentElement.parentElement).not.toHaveClass('Mui-disabled')
        })
      })

      it('should be disabled when user does not have required capability', async () => {
        // given
        const mocks = [
          {
            request: { query: riskEnginesSettingsQuery },
            result: riskEnginesSettingsWithEnabledEnginesQueryResult,
          },
          policiesCallMock,
          policyCallMock,
          geozoneListMock,
          localGroupsMock,
          availableActionsMock,
        ]

        // when
        useClientParamsMock.mockReturnValue(EMPTY_CAPABILITIES)
        const sut = createSut({}, mocks)
        await waitFor(() => sut.getByText(settingsTabText))

        // then
        const switchElements = sut.getAllByRole(switchesRole)
        switchElements.forEach(switchElement => {
          expect(switchElement.parentElement.parentElement).toHaveClass('Mui-disabled')
        })
      })
    })
  })
})
