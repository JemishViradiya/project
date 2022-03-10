import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import { act } from 'react-dom/test-utils'

import { cleanup, render } from '@testing-library/react'

import { PolicyListQuery } from '@ues-data/bis'

import ContextFactory from '../../../tests/ContextFactory'
import { mockCache, MockedApolloProvider } from '../../../tests/utils'
import useClientParamsMock from '../../components/hooks/useClientParams'
import Data from './__fixtures__/PoliciesTestData.json'

const { query } = PolicyListQuery

jest.mock('../../components/hooks/useClientParams', () =>
  jest.fn(
    key =>
      ({
        support: {
          helpUrl: 'about:blank',
        },
        capabilities: ['policies'],
      }[key]),
  ),
)
const mockUseFilter = jest.fn().mockReturnValue({
  searchText: '',
  onSearchChange: jest.fn(),
  clearSelection: jest.fn(),
})
jest.mock('../../components/useFilters', () => ({ __esModule: true, default: mockUseFilter }))

const mockSelection = {
  onSelected: jest.fn(),
  onSelectAll: jest.fn(),
  selectionState: {},
  selectedCount: 0,
  selectedAll: false,
  deselectedCount: 0,
  selectionVariables: {},
  clearSelection: jest.fn(),
}
const mockUseSelection = jest.fn().mockReturnValue(mockSelection)
const mockHasEmptySelection = jest.fn()
const mockIsSelected = jest.fn()
jest.mock('../../components/useSelection', () => ({
  useSelection: mockUseSelection,
  hasEmptySelection: mockHasEmptySelection,
  isSelected: mockIsSelected,
}))

const TestData = Data.policies

const createContext = (policies, loading = false, error) => {
  return {
    policies: {
      total: policies.length,
      data: policies,
      loading,
      error,
    },
  }
}

const requirePoliciesDashboardView = () => {
  let PoliciesDashboardView
  PoliciesDashboardView = require('./index').PoliciesDashboardView
  return PoliciesDashboardView
}

const propFactory = props =>
  Object.assign(
    {
      onSearchChange: jest.fn(),
      searchText: '',
    },
    props,
  )

const policyListProviderPath = '../../providers/PolicyListProvider'

describe('Policies Dashboard', () => {
  afterEach(() => {
    jest.clearAllMocks()
    cleanup()
  })

  let cache

  const renderView = async (renderFunc, props) => {
    const MemoryRouter = require('react-router').MemoryRouter
    const PoliciesView = requirePoliciesDashboardView()
    cache = mockCache()
    const result = renderFunc(
      <MemoryRouter initialEntries={['/t1/policies']}>
        <MockedApolloProvider cache={cache}>
          <PoliciesView {...props} />
        </MockedApolloProvider>
      </MemoryRouter>,
    )
    await act(() => new Promise(resolve => setTimeout(resolve)))
    return result
  }

  const mountView = (context, props) => {
    jest.doMock(policyListProviderPath, () => ContextFactory(context.policies))
    jest.doMock('./PolicyList', () => () => <div data-testid="PolicyList" />)
    return renderView(render, props)
  }

  // Skipped due to random timeouts errors
  it.skip('basic rendering', async () => {
    // Mock modules.
    const context = createContext(TestData)
    const props = propFactory()
    const { rerender, queryByTestId, queryByText, queryByTitle } = await mountView(context, props)

    // Find main components.
    expect(queryByText('BlackBerry Persona policies')).toBeInTheDocument()
    expect(queryByTitle('Add policy')).toBeInTheDocument()
    expect(queryByTitle('Rank policies')).toBeInTheDocument()
    expect(queryByTestId('PolicyList')).toBeInTheDocument()

    // Reduce policies to be 1 total.
    context.policies.total = 1
    context.policies.data = [context.policies.data[0]]
    await renderView(rerender, props)
    expect(queryByTitle('Add policy')).toBeInTheDocument()
    expect(queryByTitle('Rank policies')).not.toBeInTheDocument()
  })

  // Skipped due to random timeouts errors
  it.skip('render delete button and selection count', async () => {
    // Mock modules.
    const context = createContext(TestData)
    let props = propFactory()
    mockUseSelection.mockReturnValueOnce({
      ...mockSelection,
      selectedAll: true,
      selectionState: {
        selectedAll: true,
      },
    })
    const { rerender, queryByText, queryByTitle } = await mountView(context, props)

    // Find main components.
    expect(queryByTitle('Delete')).toBeInTheDocument()
    expect(queryByText('3 items selected')).toBeInTheDocument()

    // Increase deselected items to 3.
    props = propFactory()
    mockUseSelection.mockReturnValueOnce({
      ...mockSelection,
      selectedAll: false,
      deselectedCount: 3,
      selectionState: {
        selectedAll: false,
        deselected: {},
        selected: {},
      },
    })
    mockHasEmptySelection.mockReturnValueOnce(true)
    await renderView(rerender, props)
    expect(queryByTitle('Delete')).not.toBeInTheDocument()
    expect(queryByText(/.*items selected/)).not.toBeInTheDocument()

    // Select one policy again (deselected mode).
    props = propFactory()
    mockUseSelection.mockReturnValueOnce({
      ...mockSelection,
      selectedAll: false,
      deselectedCount: 2,
      selectionState: {
        selectedAll: false,
        deselected: { a: {}, c: {} },
      },
    })
    await renderView(rerender, props)
    expect(queryByTitle('Delete')).toBeInTheDocument()
    expect(queryByText('1 item selected')).toBeInTheDocument()

    // Select two policies (selected mode).
    props = propFactory()
    mockUseSelection.mockReturnValueOnce({
      ...mockSelection,
      selectedAll: false,
      selectedCount: 2,
      selectionState: {
        selectedAll: false,
        selected: { b: {}, c: {} },
      },
    })
    await renderView(rerender, props)
    expect(queryByTitle('Delete')).toBeInTheDocument()
    expect(queryByText('2 items selected')).toBeInTheDocument()
  })

  it('delete selected', async () => {
    // Mock modules.
    const context = createContext(TestData)
    const props = propFactory()
    mockUseSelection.mockReturnValue({
      ...mockSelection,
      selectedAll: false,
      selectedCount: 2,
      selectionState: {
        selectedAll: false,
        selected: { [TestData[0].id]: TestData[0], [TestData[2].id]: TestData[2] },
        deselectedIds: {},
      },
      selectionVariables: {
        selectMode: true,
        ids: [TestData[0].id, TestData[2].id],
      },
    })
    const { getByTitle, getByText } = await mountView(context, props)

    cache.writeQuery({
      query,
      data: { policies: [...TestData] },
    })
    // Click delete button.
    const deleteButton = getByTitle('Delete')
    await act(async () => {
      await deleteButton.click()
    })
    await act(() => new Promise(resolve => setTimeout(resolve)))

    getByText('Do you want to delete the selected policies?')
    getByText(TestData[0].name)
    getByText(TestData[2].name)
  })

  describe.each(['Add policy', 'Delete'])('%s button', buttonTitle => {
    beforeEach(() => {
      mockUseSelection.mockReturnValueOnce({
        ...mockSelection,
        selectedAll: true,
        selectionState: {
          selectedAll: true,
        },
      })
    })

    it('should not be rendered when user does not have required capability', async () => {
      // given
      const capabilities = []
      const context = createContext(TestData)
      const props = propFactory()

      // when
      useClientParamsMock.mockImplementation(
        key =>
          ({
            support: {
              helpUrl: 'about:blank',
            },
            capabilities,
          }[key]),
      )
      const sut = await mountView(context, props)

      // then
      expect(sut.queryByTitle(buttonTitle)).toBeFalsy()
    })

    it('should be rendered when user have required capability', async () => {
      // given
      const capabilities = ['policies']
      const context = createContext(TestData)
      const props = propFactory()

      // when
      useClientParamsMock.mockImplementation(
        key =>
          ({
            support: {
              helpUrl: 'about:blank',
            },
            capabilities,
          }[key]),
      )
      const sut = await mountView(context, props)

      // then
      expect(sut.queryByTitle(buttonTitle)).toBeTruthy()
    })
  })
})
