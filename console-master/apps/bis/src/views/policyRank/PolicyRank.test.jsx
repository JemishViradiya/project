import React from 'react'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'

import { MockedApolloProvider } from '../../../tests/utils'
import useClientParamsMock from '../../components/hooks/useClientParams'
import PolicyRank from '.'
import { createPolicyRankMock } from './__fixtures__/policyRank.fixture'
import { createUpdatePolicyRankMock, DEFAULT_UPDATE_POLICY_RESULT } from './__fixtures__/updatePolicyRank.fixture'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn().mockReturnValue(jest.fn()),
  useLocation: jest.fn().mockReturnValue({ state: {} }),
  useParams: jest.fn().mockReturnValue({}),
}))

jest.mock('../../components/hooks/useClientParams', () => jest.fn(() => []))

const CAPABILITIES_WITH_POLICIES = ['policies']
const EMPTY_CAPABILITIES = []
const DEFAULT_MOCKS = [createPolicyRankMock(1)]

const testedComponent = (mocks = DEFAULT_MOCKS) => (
  <MemoryRouter>
    <MockedApolloProvider mocks={mocks}>
      <PolicyRank />
    </MockedApolloProvider>
  </MemoryRouter>
)

const createSut = mocks => {
  return render(testedComponent(mocks))
}

describe('PolicyRank', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should render loading indicator when policies are not fetched yet', () => {
    const loadingIndicatorText = 'Loading'

    const sut = createSut()

    expect(sut.getByLabelText(loadingIndicatorText)).toBeTruthy()
  })

  describe('Save button', () => {
    const saveButtonTestId = 'policy-rank-submit-button'

    beforeEach(() => {
      useClientParamsMock.mockReturnValue(CAPABILITIES_WITH_POLICIES)
    })

    it('should call update query when form is submitted', async () => {
      // given
      let updatePolicyRankCall = false
      const fetchPolicyRankCallMock = createPolicyRankMock(1)
      const updatePolicyRankCallMock = createUpdatePolicyRankMock({ ids: ['POLICY_ID_1'] }, () => {
        updatePolicyRankCall = true
        return DEFAULT_UPDATE_POLICY_RESULT
      })
      const mocks = [fetchPolicyRankCallMock, updatePolicyRankCallMock]
      let sut
      await act(async () => {
        sut = createSut(mocks)
        await waitFor(() => sut.getByTestId(saveButtonTestId))
        sut.rerender(testedComponent(mocks))
      })

      // when
      await act(async () => {
        fireEvent.submit(sut.getByTestId(saveButtonTestId))
        await waitFor(() => sut.getByTestId(saveButtonTestId))
      })

      // then
      expect(updatePolicyRankCall).toBe(true)
    })

    it('should call navigate -1 when form is submitted and location existing', async () => {
      // given
      const navigateMock = jest.fn()
      useNavigate.mockReturnValue(navigateMock)

      const mocks = [createPolicyRankMock(1), createUpdatePolicyRankMock({ ids: ['POLICY_ID_1'] })]
      let sut
      await act(async () => {
        sut = createSut(mocks)
        await waitFor(() => sut.getByTestId(saveButtonTestId))
        sut.rerender(testedComponent(mocks))
      })

      // when
      await act(async () => {
        fireEvent.submit(sut.getByTestId(saveButtonTestId))
        await waitFor(() => sut.getByTestId(saveButtonTestId))
      })

      // then
      expect(navigateMock).toHaveBeenCalled()
    })

    it('should call navigate  when form is submitted and location state does not exist', async () => {
      // given
      const navigateMock = jest.fn()
      useNavigate.mockReturnValue(navigateMock)
      useParams.mockReturnValue({ tenant: 'TENANT_ID' })

      const mocks = [createPolicyRankMock(1), createUpdatePolicyRankMock({ ids: ['POLICY_ID_1'] })]
      let sut
      await act(async () => {
        sut = createSut(mocks)
        await waitFor(() => sut.getByTestId(saveButtonTestId))
        sut.rerender(testedComponent(mocks))
      })

      // when
      await act(async () => {
        fireEvent.submit(sut.getByTestId(saveButtonTestId))
        await waitFor(() => sut.getByTestId(saveButtonTestId))
      })

      // then
      expect(navigateMock).toHaveBeenCalledWith('/TENANT_ID/policies')
    })

    it('should be rendered when user has required capability', async () => {
      // when
      let sut
      useClientParamsMock.mockReturnValue(CAPABILITIES_WITH_POLICIES)
      await act(async () => {
        sut = createSut()
        await waitFor(() => sut.getByTestId(saveButtonTestId))
      })

      // then
      expect(sut.getByTestId(saveButtonTestId)).toBeTruthy()
    })

    it('should not be rendered when user does not have required capability', async () => {
      // when
      let sut
      useClientParamsMock.mockReturnValue(EMPTY_CAPABILITIES)
      await act(async () => {
        sut = createSut()
        await waitFor(() => sut.queryByTestId(saveButtonTestId))
      })

      // then
      expect(sut.queryByTestId(saveButtonTestId)).toBeFalsy()
    })
  })

  describe('Cancel button', () => {
    const cancelButtonTestId = 'policy-rank-cancel-button'

    beforeEach(() => {
      useClientParamsMock.mockReturnValue(CAPABILITIES_WITH_POLICIES)
    })

    it('should call navigate -1 when location state exist', async () => {
      // given
      const navigateMock = jest.fn()
      useNavigate.mockReturnValue(navigateMock)
      useLocation.mockReturnValueOnce({ state: { goBack: 'GO_BACK' } })
      let sut
      await act(async () => {
        sut = createSut()
        await waitFor(() => sut.getByTestId(cancelButtonTestId))
      })

      // when
      fireEvent.click(sut.getByTestId(cancelButtonTestId))

      // then
      expect(navigateMock).toHaveBeenCalled()
    })

    it('should call navigate when history is not existing', async () => {
      // given
      const navigateMock = jest.fn()
      useNavigate.mockReturnValue(navigateMock)
      useParams.mockReturnValue({ tenant: 'TENANT_ID' })
      let sut
      await act(async () => {
        sut = createSut()
        await waitFor(() => sut.getByTestId(cancelButtonTestId))
      })

      // when
      fireEvent.click(sut.getByTestId(cancelButtonTestId))

      // then
      expect(navigateMock).toHaveBeenCalledWith('/TENANT_ID/policies')
    })

    it('should be rendered when user has required capability', async () => {
      // when
      let sut
      useClientParamsMock.mockReturnValue(CAPABILITIES_WITH_POLICIES)
      await act(async () => {
        sut = createSut()
        await waitFor(() => sut.getByTestId(cancelButtonTestId))
      })

      // then
      expect(sut.getByTestId(cancelButtonTestId)).toBeTruthy()
    })

    it('should not be rendered when user does not have required capability', async () => {
      // when
      let sut
      useClientParamsMock.mockReturnValue(EMPTY_CAPABILITIES)
      await act(async () => {
        sut = createSut()
        await waitFor(() => sut.queryByTestId(cancelButtonTestId))
      })

      // then
      expect(sut.queryByTestId(cancelButtonTestId)).toBeFalsy()
    })
  })

  describe('rank button', () => {
    const policyNameTextRegExp = /POLICY_NAME_/i

    beforeEach(() => {
      useClientParamsMock.mockReturnValue(CAPABILITIES_WITH_POLICIES)
    })

    const filterHiddenButtons = buttons => buttons.filter(button => button.getAttribute('aria-hidden') !== 'true')

    const getButtons = sut => ({
      increase: filterHiddenButtons(sut.queryAllByLabelText('increase')),
      decrease: filterHiddenButtons(sut.queryAllByLabelText('decrease')),
    })

    describe('with policies capability', () => {
      it('should not be rendered when only one row is displayed', async () => {
        // given
        const mocks = [createPolicyRankMock(1)]

        // when
        let sut
        await act(async () => {
          sut = createSut(mocks)
          await waitFor(() => sut.getByText('Save'))
          sut.rerender(testedComponent(mocks))
        })

        // then
        const buttons = getButtons(sut)
        expect(buttons.increase.length).toBe(0)
        expect(buttons.decrease.length).toBe(0)
      })

      it('should be rendered when many rows are displayed', async () => {
        // given
        const mocks = [createPolicyRankMock(3)]

        // when
        let sut
        await act(async () => {
          sut = createSut(mocks)
          await waitFor(() => sut.getByText('Save'))
          sut.rerender(testedComponent(mocks))
        })

        // then
        const buttons = getButtons(sut)
        expect(buttons.increase.length).toBe(2)
        expect(buttons.decrease.length).toBe(2)
      })

      it('should change row position when rank up button is clicked', async () => {
        // given
        const mocks = [createPolicyRankMock(3)]
        let sut
        await act(async () => {
          sut = createSut(mocks)
          await waitFor(() => sut.getByText('Save'))
          sut.rerender(testedComponent(mocks))
        })

        // when
        const secondPolicyIncreaseButton = sut.getByText('POLICY_NAME_2').nextSibling.querySelector('button[aria-label="increase"]')
        fireEvent.click(secondPolicyIncreaseButton)
        await sut.rerender(testedComponent(mocks))

        // then
        const policies = sut.queryAllByText(policyNameTextRegExp)
        expect(policies[0].innerHTML).toBe('POLICY_NAME_2')
        expect(policies[1].innerHTML).toBe('POLICY_NAME_1')
        expect(policies[2].innerHTML).toBe('POLICY_NAME_3')
      })

      it('should change row position when rank down button is clicked', async () => {
        // given
        const mocks = [createPolicyRankMock(3)]
        let sut
        await act(async () => {
          sut = createSut(mocks)
          await waitFor(() => sut.getByText('Save'))
          sut.rerender(testedComponent(mocks))
        })

        // when
        const secondPolicyDecreaseButton = sut.getByText('POLICY_NAME_2').nextSibling.querySelector('button[aria-label="decrease"]')
        fireEvent.click(secondPolicyDecreaseButton)
        sut.rerender(testedComponent(mocks))

        // then
        const policies = sut.queryAllByText(policyNameTextRegExp)
        expect(policies[0].innerHTML).toBe('POLICY_NAME_1')
        expect(policies[1].innerHTML).toBe('POLICY_NAME_3')
        expect(policies[2].innerHTML).toBe('POLICY_NAME_2')
      })
    })

    describe('without policies capability', () => {
      beforeEach(() => {
        useClientParamsMock.mockReturnValue(EMPTY_CAPABILITIES)
      })

      it('should not be rendered when only one row is displayed', async () => {
        // given
        const mocks = [createPolicyRankMock(1)]

        // when
        let sut
        await act(async () => {
          sut = createSut(mocks)
          await waitFor(() => sut.queryByText('Save'))
          sut.rerender(testedComponent(mocks))
        })

        // then
        const buttons = getButtons(sut)
        expect(buttons.increase.length).toBe(0)
        expect(buttons.decrease.length).toBe(0)
      })

      it('should not be rendered when many rows are displayed', async () => {
        // given
        const mocks = [createPolicyRankMock(3)]

        // when
        let sut
        await act(async () => {
          sut = createSut(mocks)
          await waitFor(() => sut.queryByText('Save'))
          sut.rerender(testedComponent(mocks))
        })

        // then
        const buttons = getButtons(sut)
        expect(buttons.increase.length).toBe(0)
        expect(buttons.decrease.length).toBe(0)
      })
    })
  })
})
