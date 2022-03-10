import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, cleanup, createEvent, fireEvent, render } from '@testing-library/react'

import { useStatefulApolloMutation, useStatefulApolloQuery } from '@ues-data/shared'

import useClientParams from '../../components/hooks/useClientParams'
import { useEventListContext } from '../../providers/EventListProvider'
import EventList from './EventList'

const defaultParams = {
  privacyMode: { mode: false, maxZoom: 10, maxPrecision: 5, audit: null },
  features: { RiskScoreResponseFormat: false },
}

const mockUseClientParams = (key, params = defaultParams) => (key ? params[key] : params)

jest.mock('../../components/hooks/useClientParams', () => jest.fn().mockImplementation(key => mockUseClientParams(key)))

jest.mock('@ues-data/shared', () => ({
  ...jest.requireActual('@ues-data/shared'),
  useStatefulApolloQuery: jest.fn().mockImplementation(() => ({ data: { eventListColumns: { columns: [] } } })),
  useStatefulApolloMutation: jest.fn().mockImplementation(() => [jest.fn()]),
  useStatefulApolloSubscription: jest.fn().mockImplementation(() => ({ data: {} })),
}))
jest.mock('../../providers/EventListProvider', () => ({
  useEventListContext: jest.fn().mockReturnValue({
    reset: jest.fn(),
    total: 100,
    data: [
      {
        assessment: {
          behavioralRiskLevel: 'critical',
          geozoneRiskLevel: 'high',
          behavioral: { score: 74.6 },
          userInfo: { displayName: 'DisplayName' },
          mappings: {
            behavioral: { score: 74.6 },
          },
          ipAddress: '192.168.0.1',
          location: { lat: 12, lon: 12 },
          datapoint: {
            source: {
              deviceModel: 'DeviceModel',
              appName: 'AppName',
            },
          },
        },
        datetime: Date.now(),
      },
      {
        assessment: {
          behavioralRiskLevel: 'high',
          geozoneRiskLevel: 'low',
          behavioral: { score: 24 },
          userInfo: { displayName: 'DisplayName' },
          mappings: {
            behavioral: { score: 10 },
          },
        },
        datetime: Date.now(),
      },
    ],
    variables: { sortBy: 'a', sortDirection: 'ASC' },
    loadMoreRows: jest.fn(),
  }),
}))

const allColumns = [
  'riskScore',
  'geozoneRiskLevel',
  'fixup',
  'ipAddress',
  'userInfo',
  'deviceModel',
  'appOrService',
  'location',
  'actions',
]

const allColumnsWithoutLocation = [
  'riskScore',
  'geozoneRiskLevel',
  'fixup',
  'ipAddress',
  'userInfo',
  'deviceModel',
  'appOrService',
  'actions',
]

const props = {
  onSort: jest.fn(),
  onLoadMoreRows: jest.fn(),
  selectionState: {
    selected: {},
    deselected: {},
  },
  onSelected: jest.fn(),
  onSelectAll: jest.fn(),
  selectedAll: false,
}

jest.useFakeTimers()

const clickTooltip = node => {
  const myEvent = createEvent.click(node, { pageX: 100, pageY: 100 })
  myEvent.pageX = 100
  myEvent.pageY = 100
  fireEvent.click(node, myEvent)
  jest.runOnlyPendingTimers()
}

describe('EventList', () => {
  beforeAll(() => {
    Object.defineProperties(window.HTMLElement.prototype, {
      offsetHeight: { get: jest.fn().mockReturnValue(1280) },
      offsetWidth: { get: jest.fn().mockReturnValue(1050) },
    })
  })
  afterEach(() => {
    cleanup()
    jest.clearAllTimers()
    jest.clearAllMocks()
  })

  test('data formatters', () => {
    useStatefulApolloQuery.mockImplementationOnce(() => ({ data: { eventListColumns: { columns: allColumns } } }))
    const wrapper = render(<EventList {...props} />)

    expect(wrapper.getByLabelText('Critical risk level blob')).toBeVisible()
    expect(wrapper.getByText('75%')).toBeVisible()
    expect(wrapper.getByTitle('Low geozone risk')).toBeVisible()
    expect(wrapper.getByTitle('192.168.0.1')).toBeVisible()
    expect(wrapper.getByTitle('DeviceModel')).toBeVisible()
    expect(wrapper.getAllByText('DisplayName')).toHaveLength(2)
    expect(wrapper.getByTitle('12.00000, 12.00000')).toBeVisible()
    cleanup()
  })

  test('renders', () => {
    const wrapper = render(<EventList {...props} />)
    expect(wrapper.container).not.toBeEmptyDOMElement()
  })

  test('renders null when loading', () => {
    useEventListContext.mockReturnValue({
      variables: { sortBy: 'a', sortDirection: 'ASC' },
      loadMoreRows: jest.fn(),
    })
    const wrapper = render(<EventList {...props} />)
    expect(wrapper.container).toBeEmptyDOMElement()
  })

  test('renders null on error', () => {
    useEventListContext.mockReturnValue({
      error: true,
      variables: { sortBy: 'a', sortDirection: 'ASC' },
      loadMoreRows: jest.fn(),
    })
    const wrapper = render(<EventList {...props} />)
    expect(wrapper.container).toBeEmptyDOMElement()
  })

  test('resets scroll when required', () => {
    useEventListContext.mockReturnValue({
      reset: true,
      data: [],
      total: 10,
      variables: { sortBy: 'a', sortDirection: 'ASC' },
      loadMoreRows: jest.fn(),
    })
    const wrapper = render(<EventList {...props} />)
    expect(wrapper.container).not.toBeEmptyDOMElement()
  })

  test('always keeps disabled headers visible', () => {
    useStatefulApolloQuery.mockReturnValue({ data: { eventListColumns: { columns: [] } } })
    const wrapper = render(<EventList {...props} />)
    Object.keys(wrapper.getAllByRole('columnheader')).forEach(header => {
      expect(header.visible).toEqual(header.disabled)
    })
  })

  test('loads saved headers', () => {
    useStatefulApolloQuery.mockReturnValue({ data: { eventListColumns: { columns: ['actions', 'location'] } } })
    const wrapper = render(<EventList {...props} />)
    Object.keys(wrapper.getAllByRole('columnheader')).forEach(header => {
      if (header.dataKey === 'actions' || header.dataKey === 'location') {
        expect(header.visible).toBe(true)
      } else {
        expect(header.visible).toEqual(header.disabled)
      }
    })
  })

  test('saves header visibility', async () => {
    useStatefulApolloQuery.mockReturnValue({ data: { eventListColumns: { columns: ['actions', 'location'] } } })
    render(<EventList {...props} />)
    const headersToSave = ['location', 'actions']
    await cleanup()
    expect(useStatefulApolloMutation.mock.results[0].value[0]).toBeCalledWith(
      expect.objectContaining({ variables: { columns: headersToSave } }),
    )
  })

  describe('more columns handling', () => {
    test('select all', async () => {
      const wrapper = render(<EventList {...props} />)
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

    test('show one more column', async () => {
      useStatefulApolloQuery.mockReturnValue({
        data: { eventListColumns: { columns: ['riskScore', 'geozoneRiskLevel', 'fixup', 'userInfo', 'location'] } },
      })
      const wrapper = render(<EventList {...props} />)
      clickTooltip(wrapper.getByTitle('Customize columns'))

      const input = wrapper.getByLabelText('Applied actions')
      await act(async () => fireEvent.click(input))
      await cleanup()

      expect(useStatefulApolloMutation.mock.results[0].value[0]).toBeCalledWith({
        variables: {
          columns: ['riskScore', 'geozoneRiskLevel', 'fixup', 'userInfo', 'location', 'actions'],
        },
      })
    })

    test('hide one more column', async () => {
      useStatefulApolloQuery.mockReturnValueOnce({ data: { eventListColumns: { columns: allColumns } } })
      const wrapper = render(<EventList {...props} />)
      clickTooltip(wrapper.getByTitle('Customize columns'))

      const input = wrapper.getByLabelText('Applied actions')
      await act(async () => fireEvent.click(input))
      await cleanup()

      expect(useStatefulApolloMutation.mock.results[0].value[0]).toBeCalledWith({
        variables: {
          columns: ['riskScore', 'geozoneRiskLevel', 'fixup', 'ipAddress', 'userInfo', 'deviceModel', 'appOrService', 'location'],
        },
      })
    })
  })

  describe('more columns handling when privacyMode is enabled', () => {
    beforeEach(() => {
      const params = { ...defaultParams, privacyMode: { mode: true, maxZoom: 10, maxPrecision: 5, audit: null } }
      useClientParams.mockImplementation(key => mockUseClientParams(key, params))
    })

    it('select all when privacyMode is enabled', async () => {
      const wrapper = render(<EventList {...props} />)
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
      useStatefulApolloQuery.mockReturnValueOnce({
        data: { eventListColumns: { columns: ['riskScore', 'geozoneRiskLevel', 'fixup', 'userInfo', 'location'] } },
      })
      const wrapper = render(<EventList {...props} />)
      clickTooltip(wrapper.getByTitle('Customize columns'))

      const input = wrapper.getByLabelText('Applied actions')
      await act(async () => fireEvent.click(input))
      await cleanup()

      expect(useStatefulApolloMutation.mock.results[0].value[0]).toBeCalledWith({
        variables: {
          columns: ['riskScore', 'geozoneRiskLevel', 'fixup', 'userInfo', 'actions'],
        },
      })
    })

    test('hide one more column when privacyMode is enabled', async () => {
      useStatefulApolloQuery.mockReturnValueOnce({ data: { eventListColumns: { columns: allColumns } } })
      const wrapper = render(<EventList {...props} />)
      clickTooltip(wrapper.getByTitle('Customize columns'))

      const input = wrapper.getByLabelText('Applied actions')
      await act(async () => fireEvent.click(input))
      await cleanup()

      expect(useStatefulApolloMutation.mock.results[0].value[0]).toBeCalledWith({
        variables: {
          columns: ['riskScore', 'geozoneRiskLevel', 'fixup', 'ipAddress', 'userInfo', 'deviceModel', 'appOrService'],
        },
      })
    })
  })
})
