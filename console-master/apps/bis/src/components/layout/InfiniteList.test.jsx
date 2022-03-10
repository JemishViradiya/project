import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'

import { createHeaders, createTableData } from './__fixtures__'
import { InfiniteList } from './InfiniteList'

jest.mock('react-virtualized', () => ({
  ...jest.requireActual('react-virtualized'),
  AutoSizer: ({ children }) => <div>{children({ width: 100, height: 100 })}</div>,
}))

const t = global.T()
const DEFAULT_PROPS = {
  onLoadMoreRows: jest.fn(),
  onSort: jest.fn(),
  selectionState: { selected: {}, deselected: {} },
  onSelected: jest.fn(),
  onSelectAll: jest.fn(),
  selectedAll: false,
  sortBy: 'datetime',
  onRowClick: jest.fn(),
  sortDirection: 'ASC',
  data: [],
  total: 100,
  headers: {},
  t: x => t(x),
  onMenuAllSelection: jest.fn(),
  onMenuReset: jest.fn(),
  onMenuCheckbox: jest.fn(),
  onRowsRendered: jest.fn(),
  saveHeaders: jest.fn(),
  theme: { custom: { bisOffsets: { table: { header: {} } } } },
}

const createSut = props => {
  return render(<InfiniteList {...DEFAULT_PROPS} {...props} />)
}

describe('InfiniteList', () => {
  test('renders', () => {
    // given
    const tableRole = 'table'

    // when
    createSut()

    // then
    expect(screen.getByRole(tableRole)).toBeTruthy()
  })

  test('Sets up resetEnabled correctly', () => {
    let wrapper = new InfiniteList(DEFAULT_PROPS)
    expect(wrapper.state.resetEnabled).toBe(false)
    wrapper = new InfiniteList({
      ...DEFAULT_PROPS,
      headers: {
        h1: {
          disabled: true,
          visible: true,
          defaultVisible: true,
        },
        h2: {
          disabled: true,
          visible: true,
          defaultVisible: false,
        },
        h3: {
          disabled: true,
          visible: false,
          defaultVisible: true,
        },
        h4: {
          disabled: true,
          visible: false,
          defaultVisible: false,
        },
        h5: {
          disabled: false,
          visible: true,
          defaultVisible: true,
        },
        h6: {
          disabled: false,
          visible: true,
          defaultVisible: false,
        },
        h7: {
          disabled: false,
          visible: false,
          defaultVisible: true,
        },
        h8: {
          disabled: false,
          visible: false,
          defaultVisible: false,
        },
      },
    })
    expect(wrapper.state.resetEnabled).toBe(true)
    wrapper = new InfiniteList({
      ...DEFAULT_PROPS,
      headers: {
        h1: {
          disabled: true,
          visible: true,
          defaultVisible: true,
        },
        h2: {
          disabled: true,
          visible: true,
          defaultVisible: false,
        },
        h3: {
          disabled: true,
          visible: false,
          defaultVisible: true,
        },
        h4: {
          disabled: true,
          visible: false,
          defaultVisible: false,
        },
        h5: {
          disabled: false,
          visible: true,
          defaultVisible: true,
        },
        h8: {
          disabled: false,
          visible: false,
          defaultVisible: false,
        },
      },
    })
    expect(wrapper.state.resetEnabled).toBe(false)
  })

  test('saves headers on column menu hide and before component is unmounted', () => {
    const wrapper = new InfiniteList(DEFAULT_PROPS)
    expect(wrapper.state.showColumnsMenu).toBe(false)

    wrapper.componentDidUpdate({}, { showColumnsMenu: false })
    expect(wrapper.props.saveHeaders).not.toBeCalled()

    wrapper.state.showColumnsMenu = true
    wrapper.componentDidUpdate({}, { showColumnsMenu: false })
    expect(wrapper.props.saveHeaders).not.toBeCalled()

    wrapper.state.showColumnsMenu = true
    wrapper.componentDidUpdate({}, { showColumnsMenu: true })
    expect(wrapper.props.saveHeaders).not.toBeCalled()

    wrapper.state.showColumnsMenu = false
    wrapper.componentDidUpdate({}, { showColumnsMenu: true })
    expect(wrapper.props.saveHeaders).toBeCalled()

    wrapper.componentWillUnmount()
    expect(wrapper.props.saveHeaders).toBeCalled()
  })

  describe('sort indicator', () => {
    it('should not be rendered', () => {
      // given
      const headers = createHeaders()
      const props = { headers }

      // when
      createSut(props)

      // then
      expect(screen.getByLabelText('COLUMN_NAME_1')).toHaveAttribute('aria-sort', 'none')
    })

    it('should be rendered', () => {
      // given
      const headers = createHeaders()
      const props = { headers, sortBy: 'HEADER_1' }

      // when
      createSut(props)

      // then
      expect(screen.getByLabelText('COLUMN_NAME_1')).toHaveAttribute('aria-sort', 'ascending')
    })
  })

  describe('all entries selection checkbox', () => {
    const selectAllLabelText = /select all entries/i

    it('should be rendered on header', () => {
      // when
      createSut()

      // then
      expect(screen.getByLabelText(selectAllLabelText)).toBeTruthy()
    })

    it('should check all when is clicked', () => {
      // given
      const onSelectAllMock = jest.fn()
      const props = { onSelectAll: onSelectAllMock }
      createSut(props)

      // when
      fireEvent.click(screen.getByLabelText(selectAllLabelText))

      // then
      expect(onSelectAllMock).toHaveBeenCalled()
    })

    it('should be checked when selectedAll props is passed', () => {
      // given
      const props = { selectedAll: true }

      // when
      createSut(props)

      // then
      expect(screen.getByLabelText(selectAllLabelText)).toHaveAttribute('checked')
    })
  })

  describe('row selection checkboxes', () => {
    it('should not be selected by default', () => {
      // given
      const headers = createHeaders()
      const data = createTableData()
      const props = { headers, data }

      // when
      createSut(props)

      // then
      expect(screen.getByRole('row')).not.toHaveClass('src-component-layout-InfiniteList_selected')
    })

    it('should call on selected when clicked', () => {
      // given
      const cellRole = 'gridcell'
      const headers = createHeaders()
      const data = createTableData()
      const onSelectedMock = jest.fn()
      const props = {
        headers,
        data,
        onSelected: onSelectedMock,
      }
      createSut(props)

      // when
      fireEvent.click(screen.queryAllByRole(cellRole)[0].firstChild.querySelector('input[type="checkbox"]'))

      // then
      expect(onSelectedMock).toHaveBeenCalledWith('0', data[0], { total: 100 })
    })

    it('should call isSelected while rendering', () => {
      // given
      const headers = createHeaders()
      const data = createTableData()
      const isSelected = jest.fn()
      const props = { headers, data, isSelected }

      // when
      createSut(props)

      // then
      expect(isSelected).toHaveBeenCalledWith('ID_1')
    })
  })

  it('render headers', () => {
    // given
    const props = {
      headers: {
        big: {
          dataKey: 'big',
          disabled: false,
          visible: true,
          defaultVisible: true,
          width: 250,
          dataFormatter: x => x,
          columnClassName: 'big',
          columnName: 'COLUMN_NAME_1',
        },
        hidden: {
          dataKey: 'hidden',
          disabled: false,
          visible: false,
          defaultVisible: true,
          width: 150,
          dataFormatter: x => x,
          columnName: 'COLUMN_NAME_2',
        },
        medium: {
          dataKey: 'medium',
          disabled: true,
          visible: true,
          defaultVisible: true,
          dataFormatter: x => `${x.toFixed(0)}`,
          cellRenderer: ({ data }) => <span>{data}</span>,
          columnName: 'COLUMN_NAME_3',
        },
        small: {
          dataKey: 'small',
          disabled: true,
          visible: true,
          defaultVisible: true,
          width: 50,
          cellDataGetter: row => row.nested.into.here,
          columnName: 'COLUMN_NAME_4',
        },
      },
    }

    // when
    createSut(props)

    // then
    expect(screen.queryAllByRole('columnheader')).toHaveLength(4)
    expect(screen.getByText('COLUMN_NAME_1')).toBeTruthy()
    expect(screen.queryByText('COLUMN_NAME_2')).toBeFalsy()
    expect(screen.getByText('COLUMN_NAME_3')).toBeTruthy()
    expect(screen.getByText('COLUMN_NAME_4')).toBeTruthy()
  })

  test('row styles', () => {
    // given
    const listProps = {
      ...DEFAULT_PROPS,
      highlightId: 'highlighted',
      singleSelectId: 'singleSelect',
      data: [
        { id: 'not' },
        { id: 'selected' },
        { id: 'selected' },
        { id: 'highlighted' },
        { id: 'not' },
        { id: 'singleSelect' },
        { id: 'not' },
        { id: 'not' },
      ],
      selectionState: {
        selected: { selected: {} },
      },
    }

    // when
    const wrapper = new InfiniteList(listProps)

    // then
    expect(wrapper.rowClassName({ index: -1 })).toBe('row headerRow')
    expect(wrapper.rowClassName({ index: 0 })).toBe('row evenRow')
    expect(wrapper.rowClassName({ index: 1 })).toBe('row selected')
    expect(wrapper.rowClassName({ index: 2 })).toBe('row selected')
    expect(wrapper.rowClassName({ index: 3 })).toBe('row hover')
    expect(wrapper.rowClassName({ index: 4 })).toBe('row evenRow')
    expect(wrapper.rowClassName({ index: 5 })).toBe('row selected')
    expect(wrapper.rowClassName({ index: 6 })).toBe('row evenRow')
    expect(wrapper.rowClassName({ index: 7 })).toBe('row oddRow')
  })

  test('sort causes reset', () => {
    // given
    const tableProps = {
      ...DEFAULT_PROPS,
      onSort: jest.fn(),
    }
    const wrapper = new InfiniteList(tableProps)

    // when
    wrapper.sort({ sortBy: 'a', sortDirection: 'b' })

    // then
    expect(wrapper.resetForNextRender).toBe(true)
    expect(tableProps.onSort).toBeCalledWith(expect.objectContaining({ sortBy: 'a', sortDirection: 'b' }))
  })

  test('more columns menu handlers', () => {
    const tableProps = {
      ...DEFAULT_PROPS,
      onMenuAllSelection: jest.fn(),
      onMenuReset: jest.fn(),
      onMenuCheckbox: jest.fn(),
    }
    const wrapper = new InfiniteList(tableProps)
    wrapper.setState = jest.fn()

    wrapper.props.headers = { h: {} }
    wrapper.onMenuAllSelection()
    expect(tableProps.onMenuAllSelection).toBeCalledWith(true)
    expect(wrapper.setState).toBeCalledWith(expect.objectContaining({ resetEnabled: true }))

    wrapper.props.headers = {}
    wrapper.onMenuAllSelection()
    expect(tableProps.onMenuAllSelection).toBeCalledWith(false)
    expect(wrapper.setState).toBeCalledWith(expect.objectContaining({ resetEnabled: true }))

    wrapper.setState.mockClear()
    wrapper.state.resetEnabled = false
    wrapper.onMenuReset()
    expect(tableProps.onMenuReset).not.toBeCalled()
    expect(wrapper.setState).not.toBeCalled()
    wrapper.state.resetEnabled = true
    wrapper.onMenuReset()
    expect(tableProps.onMenuReset).toBeCalled()
    expect(wrapper.setState).toBeCalledWith(expect.objectContaining({ resetEnabled: false }))

    wrapper.setState.mockClear()
    const e = { stopPropagation: jest.fn() }
    wrapper.onMenuCheckbox(e, { dataKey: 'key' })
    expect(e.stopPropagation).toBeCalled()
    expect(tableProps.onMenuCheckbox).toBeCalledWith('key')
    expect(wrapper.setState).toBeCalledWith(expect.objectContaining({ resetEnabled: true }))
  })

  describe('more columns button', () => {
    const tooltipRole = /tooltip/i
    const customizeColumnsRole = 'Customize columns'

    it('render more columns', () => {
      // when
      createSut()

      // then
      expect(screen.getByRole('button', { name: customizeColumnsRole })).toBeTruthy()
    })

    it('should render tooltip', async () => {
      // given
      createSut()

      // when
      fireEvent.click(screen.getByRole('button', { name: customizeColumnsRole }))

      // then
      expect(await screen.findByRole(tooltipRole)).toBeTruthy()
    })

    it('should render tooltip sections', async () => {
      // given
      const props = {
        headers: {
          big: {
            dataKey: 'big',
            disabled: false,
            visible: true,
            defaultVisible: true,
            width: 250,
            section: 'Special',
          },
          hidden: {
            dataKey: 'hidden',
            disabled: false,
            visible: false,
            defaultVisible: true,
            width: 150,
            section: 'Special',
          },
          small: {
            dataKey: 'small',
            disabled: true,
            visible: true,
            defaultVisible: true,
            width: 50,
          },
        },
      }
      createSut(props)

      // when
      fireEvent.click(screen.getByRole('button', { name: customizeColumnsRole }))
      await screen.findByRole(tooltipRole)

      // then
      expect(screen.getByLabelText('All')).toBeTruthy()
      expect(screen.getByLabelText('Special')).toBeTruthy()
    })
  })
})
