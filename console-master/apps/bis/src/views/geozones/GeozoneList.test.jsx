import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, cleanup, createEvent, fireEvent, render } from '@testing-library/react'

import { useStatefulApolloMutation, useStatefulApolloQuery } from '@ues-data/shared'

import useClientParams from '../../components/hooks/useClientParams'
import { useGeozoneListContext } from '../../providers/GeozoneListProvider'
import GeozoneList from './GeozoneList'

jest.mock('../../components/hooks/useClientParams', () =>
  jest.fn().mockReturnValue({ mode: false, maxZoom: 10, maxPrecision: 5, audit: null }),
)

jest.mock('@ues-data/shared', () => ({
  ...jest.requireActual('@ues-data/shared'),
  useStatefulApolloQuery: jest.fn().mockImplementation(() => ({ data: { eventListColumns: { columns: [] } } })),
  useStatefulApolloMutation: jest.fn().mockImplementation(() => [jest.fn()]),
  useStatefulApolloSubscription: jest.fn().mockImplementation(() => ({ data: {} })),
}))
jest.mock('../../providers/GeozoneListProvider', () => ({
  useGeozoneListContext: jest.fn().mockReturnValue({
    reset: jest.fn(),
    total: 3,
    data: [
      {
        id: 'id',
        name: 'name',
        location: 'location',
        risk: 'low',
        unit: 'm',
        geometry: {
          type: 'circle',
          center: {
            lat: 10.1,
            lon: 10.2,
          },
          radius: 10,
          coordinates: [],
        },
      },
    ],
  }),
}))

const t = global.T()
const defaultProps = {
  t: x => t(x),
  onSort: jest.fn(),
  sortBy: 'risk',
  sortDirection: 'ASC',
  onLoadMoreRows: jest.fn(),
  selectionState: {
    selected: {},
    deselected: {},
  },
  onSelected: jest.fn(),
  onRowSelected: jest.fn(),
  onSelectAll: jest.fn(),
  selectedAll: false,
  geozoneListColumns: {},
  updateGeozoneListColumns: jest.fn(),
}

const allColumns = ['name', 'location']
const allColumnsWithoutLocation = ['name']

jest.useFakeTimers()

const clickTooltip = node => {
  const myEvent = createEvent.click(node, { pageX: 100, pageY: 100 })
  myEvent.pageX = 100
  myEvent.pageY = 100
  fireEvent.click(node, myEvent)
  jest.runOnlyPendingTimers()
}

describe('GeozoneList', () => {
  beforeAll(() => {
    Object.defineProperties(window.HTMLElement.prototype, {
      offsetHeight: { get: jest.fn().mockReturnValue(1280) },
      offsetWidth: { get: jest.fn().mockReturnValue(1050) },
    })
  })
  afterEach(() => {
    cleanup()
    jest.clearAllTimers()
  })

  test('data formatters', () => {
    const wrapper = render(<GeozoneList {...defaultProps} />)
    expect(wrapper.getAllByLabelText('Low geozone risk')).toHaveLength(2)
    expect(wrapper.getAllByText('location')).toHaveLength(1)
    expect(wrapper.getAllByText('name')).toHaveLength(1)
    cleanup()
  })

  test('renders empty list', () => {
    useGeozoneListContext.mockReturnValueOnce({
      total: 0,
      data: [],
    })
    const wrapper = render(<GeozoneList {...defaultProps} />)
    expect(wrapper.container).not.toBeEmptyDOMElement()
  })

  test('renders data', () => {
    const wrapper = render(<GeozoneList {...defaultProps} />)
    expect(wrapper.container).not.toBeEmptyDOMElement()
  })

  test('renders null with no data', () => {
    useGeozoneListContext.mockReturnValueOnce({
      loading: true,
    })
    const wrapper = render(<GeozoneList {...defaultProps} />)
    expect(wrapper.container).toBeEmptyDOMElement()
    cleanup()

    useGeozoneListContext.mockReturnValueOnce({
      error: new Error('test'),
    })
    expect(() => render(<GeozoneList {...defaultProps} />)).toThrow()
  })

  test('resets scroll when required', () => {
    useGeozoneListContext.mockReturnValueOnce({
      reset: true,
    })
    const wrapper = render(<GeozoneList {...defaultProps} />)
    expect(wrapper.container).toBeEmptyDOMElement()
  })

  test('always keeps disabled headers visible', async () => {
    useStatefulApolloQuery.mockReturnValueOnce({ data: { geozoneListColumns: { columns: [] } } })
    const wrapper = render(<GeozoneList {...defaultProps} />)
    Object.keys(wrapper.getAllByRole('columnheader')).forEach(header => {
      expect(header.visible).toEqual(header.disabled)
    })
  })

  test('loads saved headers', () => {
    useStatefulApolloQuery.mockReturnValueOnce({ data: { geozoneListColumns: { columns: ['name', 'distance'] } } })
    const wrapper = render(<GeozoneList {...defaultProps} />)
    Object.keys(wrapper.getAllByRole('columnheader')).forEach(header => {
      if (header.dataKey === 'name' || header.dataKey === 'distance') {
        expect(header.visible).toBe(true)
      } else {
        expect(header.visible).toEqual(header.disabled)
      }
    })
  })

  test('saves header visibility', async () => {
    useStatefulApolloQuery.mockReturnValueOnce({ data: { geozoneListColumns: { columns: ['name'] } } })
    render(<GeozoneList {...defaultProps} />)
    const headersToSave = ['name']
    await cleanup()
    expect(useStatefulApolloMutation.mock.results[0].value[0]).toBeCalledWith(
      expect.objectContaining({ variables: { columns: headersToSave } }),
    )
  })

  describe('more columns handling', () => {
    test('select all', async () => {
      useStatefulApolloQuery.mockReturnValue({ data: { geozoneListColumns: { columns: ['name'] } } })
      const wrapper = render(<GeozoneList {...defaultProps} />)
      clickTooltip(wrapper.getByTitle('Customize columns'))

      const selectAll = wrapper.getByText('Select All')
      await act(async () => fireEvent.click(selectAll))
      await cleanup()

      expect(useStatefulApolloMutation.mock.results[0].value[0]).toBeCalledWith({
        variables: {
          columns: allColumns,
        },
      })
    })

    test('reset columns', async () => {
      useStatefulApolloQuery.mockReturnValue({ data: { geozoneListColumns: { columns: [] } } })
      const wrapper = render(<GeozoneList {...defaultProps} />)
      clickTooltip(wrapper.getByTitle('Customize columns'))

      const reset = wrapper.getByText('Reset')
      await act(async () => fireEvent.click(reset))
      await cleanup()

      expect(useStatefulApolloMutation.mock.results[0].value[0]).toBeCalledWith({
        variables: {
          columns: ['name', 'location'],
        },
      })
    })

    test('show one more column', async () => {
      useStatefulApolloQuery.mockReturnValue({ data: { geozoneListColumns: { columns: ['name'] } } })
      const wrapper = render(<GeozoneList {...defaultProps} />)
      clickTooltip(wrapper.getByTitle('Customize columns'))

      const input = wrapper.getByLabelText('Location')
      await act(async () => fireEvent.click(input))
      await cleanup()

      expect(useStatefulApolloMutation.mock.results[0].value[0]).toBeCalledWith({
        variables: {
          columns: ['name', 'location'],
        },
      })
    })

    test('hide one more column', async () => {
      useStatefulApolloQuery.mockReturnValue({ data: { geozoneListColumns: { columns: ['name', 'location'] } } })
      const wrapper = render(<GeozoneList {...defaultProps} />)
      clickTooltip(wrapper.getByTitle('Customize columns'))

      const input = wrapper.getByLabelText('Location')
      await act(async () => fireEvent.click(input))
      await cleanup()

      expect(useStatefulApolloMutation.mock.results[0].value[0]).toBeCalledWith({
        variables: {
          columns: ['name'],
        },
      })
    })
  })

  describe('more columns handling when privacyMode is enabled', () => {
    beforeEach(() => {
      useClientParams.mockReturnValueOnce({ mode: true, maxZoom: 10, maxPrecision: 5, audit: null })
    })
    test('select all when privacyMode is enabled', async () => {
      useStatefulApolloQuery.mockReturnValueOnce({ data: { geozoneListColumns: { columns: [] } } })
      const wrapper = render(<GeozoneList {...defaultProps} />)
      clickTooltip(wrapper.getByTitle('Customize columns'))

      const selectAll = wrapper.getByText('Select All')
      await act(async () => fireEvent.click(selectAll))
      await cleanup()

      expect(useStatefulApolloMutation.mock.results[0].value[0]).toBeCalledWith({
        variables: {
          columns: allColumnsWithoutLocation,
        },
      })
    })

    test('show one more column when privacyMode is enabled', async () => {
      useStatefulApolloQuery.mockReturnValueOnce({ data: { geozoneListColumns: { columns: ['location'] } } })
      const wrapper = render(<GeozoneList {...defaultProps} />)
      clickTooltip(wrapper.getByTitle('Customize columns'))

      const input = wrapper.getByLabelText('Geozone name')
      await act(async () => fireEvent.click(input))
      await cleanup()

      expect(useStatefulApolloMutation.mock.results[0].value[0]).toBeCalledWith({
        variables: {
          columns: ['name'],
        },
      })
    })

    test('hide one more column when privacyMode is enabled', async () => {
      useStatefulApolloQuery.mockReturnValueOnce({ data: { geozoneListColumns: { columns: allColumns } } })
      const wrapper = render(<GeozoneList {...defaultProps} />)
      clickTooltip(wrapper.getByTitle('Customize columns'))

      const input = wrapper.getAllByLabelText('Geozone name')[0]
      await act(async () => fireEvent.click(input))
      await cleanup()

      expect(useStatefulApolloMutation.mock.results[0].value[0]).toBeCalledWith({
        variables: {
          columns: [],
        },
      })
    })
  })
})
