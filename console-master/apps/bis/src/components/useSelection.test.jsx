import '@testing-library/jest-dom/extend-expect'

import hoistNonReactStatic from 'hoist-non-react-statics'
import React from 'react'
import { MemoryRouter } from 'react-router'

import { act, cleanup, fireEvent, render } from '@testing-library/react'

import { mockComponent } from '../../tests/utils'
import { isSelected, useSelection } from './useSelection'

const TestComponent = callbacks =>
  mockComponent('TestComponent', {
    fields: ['selectedAll', 'selectedCount', 'deselectedCount', 'name', 'size'],
    objects: ['selectionState', 'selectionVariables'],
    callbacks: callbacks || [
      { name: 'onSelected', args: [] },
      { name: 'onSelectAll', args: [] },
      { name: 'clearSelection', args: [] },
    ],
  })

function withSelection({ idParam, pluralParam, key } = {}) {
  return function (WrappedComponent) {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'
    const Helper = props => <WrappedComponent {...props} {...useSelection({ idParam, pluralParam, key })} />
    Helper.displayName = `withSelection(${displayName})`
    Helper.WrappedComponent = WrappedComponent
    return hoistNonReactStatic(Helper, WrappedComponent)
  }
}

const getTestedComponent = (TC, props) => (
  <MemoryRouter>
    <TC {...props} />
  </MemoryRouter>
)

describe('useSelection', () => {
  afterEach(() => {
    cleanup()
  })

  test('renders a helper', () => {
    const props = {
      name: 'Waterloo Zone',
      size: 'normal',
    }
    const TC = withSelection({ idParam: 'testId', pluralParam: 'testIds' })(TestComponent())
    const { getByTestId } = render(getTestedComponent(TC, props))
    expect(getByTestId('TestComponent')).not.toBeNull()
    expect(getByTestId('name').textContent).toEqual(props.name)
    expect(getByTestId('size').textContent).toEqual(props.size)
    expect(getByTestId('selectedAll').textContent).toEqual('false')
    expect(getByTestId('selectedCount').textContent).toEqual('0')
    expect(getByTestId('deselectedCount').textContent).toEqual('0')
  })

  test('select and deselect all', async () => {
    const props = {
      name: 'Waterloo Zone',
      size: 'normal',
    }

    const TC = withSelection({ idParam: 'testId', pluralParam: 'testIds' })(TestComponent())
    const { getByTestId, rerender } = render(getTestedComponent(TC, props))

    expect(getByTestId('TestComponent')).not.toBeNull()
    const selectedAll = getByTestId('selectedAll')
    const selectionVariables = getByTestId('selectionVariables')
    expect(selectedAll.textContent).toEqual('false')
    expect(JSON.parse(selectionVariables.textContent)).toEqual({
      selectMode: true,
      testIds: [],
    })

    // Select all
    act(() => {
      fireEvent.click(getByTestId('onSelectAll'))
    })
    rerender(getTestedComponent(TC, props))
    const selection = getByTestId('selectionState')
    expect(selectedAll.textContent).toEqual('true')
    expect(JSON.parse(selectionVariables.textContent)).toEqual({
      selectMode: false,
      testIds: [],
    })
    // Any id should be selected
    const id = 'test id'
    expect(isSelected(JSON.parse(selection.textContent), id)).toEqual(true)

    // Deselect all
    act(() => {
      fireEvent.click(getByTestId('onSelectAll'))
    })
    rerender(getTestedComponent(TC, props))
    expect(selectedAll.textContent).toEqual('false')
    expect(JSON.parse(selectionVariables.textContent)).toEqual({
      selectMode: true,
      testIds: [],
    })
    // No id should be selected
    expect(isSelected(JSON.parse(selection.textContent), id)).toEqual(false)
  })

  test('select ids in selection-mode', async () => {
    const props = {
      name: 'Waterloo Zone',
      size: 'normal',
    }
    const selectArgs = ['']
    const callbacks = [
      { name: 'onSelected', args: selectArgs },
      { name: 'clearSelection', args: [] },
    ]
    const TC = withSelection({ idParam: 'testId', pluralParam: 'testIds' })(TestComponent(callbacks))
    const { getByTestId, rerender } = render(getTestedComponent(TC, props))

    const id1 = 'abc'
    const id2 = 'def'
    expect(getByTestId('TestComponent')).not.toBeNull()
    const selection = getByTestId('selectionState')
    const selectedCount = getByTestId('selectedCount')
    const selectionVariables = getByTestId('selectionVariables')
    expect(selectedCount.textContent).toEqual('0')
    expect(JSON.parse(selectionVariables.textContent)).toEqual({
      selectMode: true,
      testIds: [],
    })
    expect(isSelected(JSON.parse(selection.textContent), id1)).toEqual(false)
    expect(isSelected(JSON.parse(selection.textContent), id2)).toEqual(false)

    // Select one id
    selectArgs[1] = {
      testId: id1,
    }
    act(() => {
      fireEvent.click(getByTestId('onSelected'))
    })
    rerender(getTestedComponent(TC, props))
    expect(selectedCount.textContent).toEqual('1')
    expect(JSON.parse(selectionVariables.textContent)).toEqual({
      selectMode: true,
      testIds: [id1],
    })
    expect(isSelected(JSON.parse(selection.textContent), id1)).toEqual(true)
    expect(isSelected(JSON.parse(selection.textContent), id2)).toEqual(false)

    // Select another id
    selectArgs[1] = {
      testId: id2,
    }
    act(() => {
      fireEvent.click(getByTestId('onSelected'))
    })
    rerender(getTestedComponent(TC, props))
    expect(selectedCount.textContent).toEqual('2')
    expect(JSON.parse(selectionVariables.textContent)).toEqual({
      selectMode: true,
      testIds: [id1, id2],
    })
    expect(isSelected(JSON.parse(selection.textContent), id1)).toEqual(true)
    expect(isSelected(JSON.parse(selection.textContent), id2)).toEqual(true)

    // Deselection id1
    selectArgs[1] = {
      testId: id1,
    }
    act(() => {
      fireEvent.click(getByTestId('onSelected'))
    })
    rerender(getTestedComponent(TC, props))
    expect(selectedCount.textContent).toEqual('1')
    expect(JSON.parse(selectionVariables.textContent)).toEqual({
      selectMode: true,
      testIds: [id2],
    })
    expect(isSelected(JSON.parse(selection.textContent), id1)).toEqual(false)
    expect(isSelected(JSON.parse(selection.textContent), id2)).toEqual(true)
  })

  test('select ids in deselection-mode', async () => {
    const props = {
      name: 'Waterloo Zone',
      size: 'normal',
    }
    const selectArgs = ['']
    const callbacks = [
      { name: 'onSelected', args: selectArgs },
      { name: 'onSelectAll', args: [] },
      { name: 'clearSelection', args: [] },
    ]
    const TC = withSelection({ idParam: 'testId', pluralParam: 'testIds' })(TestComponent(callbacks))
    const { getByTestId, rerender } = render(getTestedComponent(TC, props))

    const id1 = 'abc'
    const id2 = 'def'
    expect(getByTestId('TestComponent')).not.toBeNull()
    const selection = getByTestId('selectionState')
    const selectedAll = getByTestId('selectedAll')
    const selectedCount = getByTestId('selectedCount')
    const deselectedCount = getByTestId('deselectedCount')
    const selectionVariables = getByTestId('selectionVariables')
    expect(selectedCount.textContent).toEqual('0')
    expect(deselectedCount.textContent).toEqual('0')
    expect(JSON.parse(selectionVariables.textContent)).toEqual({
      selectMode: true,
      testIds: [],
    })
    expect(isSelected(JSON.parse(selection.textContent), id1)).toEqual(false)
    expect(isSelected(JSON.parse(selection.textContent), id2)).toEqual(false)
    expect(selectedAll.textContent).toEqual('false')

    // Select all
    act(() => {
      fireEvent.click(getByTestId('onSelectAll'))
    })
    rerender(getTestedComponent(TC, props))
    expect(isSelected(JSON.parse(selection.textContent), id1)).toEqual(true)
    expect(isSelected(JSON.parse(selection.textContent), id2)).toEqual(true)
    expect(selectedAll.textContent).toEqual('true')

    // Deselect id1 and cancel selectedAll
    selectArgs[1] = {
      testId: id1,
    }
    act(() => {
      fireEvent.click(getByTestId('onSelected'))
    })
    rerender(getTestedComponent(TC, props))
    expect(selectedCount.textContent).toEqual('0')
    expect(deselectedCount.textContent).toEqual('1')
    expect(JSON.parse(selectionVariables.textContent)).toEqual({
      selectMode: false,
      testIds: [id1],
    })
    expect(isSelected(JSON.parse(selection.textContent), id1)).toEqual(false)
    expect(isSelected(JSON.parse(selection.textContent), id2)).toEqual(true)
    expect(selectedAll.textContent).toEqual('false')

    // Deselect id2
    selectArgs[1] = {
      testId: id2,
    }
    act(() => {
      fireEvent.click(getByTestId('onSelected'))
    })
    rerender(getTestedComponent(TC, props))
    expect(selectedCount.textContent).toEqual('0')
    expect(deselectedCount.textContent).toEqual('2')
    expect(JSON.parse(selectionVariables.textContent)).toEqual({
      selectMode: false,
      testIds: [id1, id2],
    })
    expect(isSelected(JSON.parse(selection.textContent), id1)).toEqual(false)
    expect(isSelected(JSON.parse(selection.textContent), id2)).toEqual(false)
    expect(selectedAll.textContent).toEqual('false')

    // Reselect id1
    selectArgs[1] = {
      testId: id1,
    }
    act(() => {
      fireEvent.click(getByTestId('onSelected'))
    })
    rerender(getTestedComponent(TC, props))
    expect(selectedCount.textContent).toEqual('0')
    expect(deselectedCount.textContent).toEqual('1')
    expect(JSON.parse(selectionVariables.textContent)).toEqual({
      selectMode: false,
      testIds: [id2],
    })
    expect(isSelected(JSON.parse(selection.textContent), id1)).toEqual(true)
    expect(isSelected(JSON.parse(selection.textContent), id2)).toEqual(false)
    expect(selectedAll.textContent).toEqual('false')

    // Reselect id2 and enable selectedAll
    selectArgs[1] = {
      testId: id2,
    }
    act(() => {
      fireEvent.click(getByTestId('onSelected'))
    })
    rerender(getTestedComponent(TC, props))
    expect(selectedCount.textContent).toEqual('0')
    expect(deselectedCount.textContent).toEqual('0')
    expect(JSON.parse(selectionVariables.textContent)).toEqual({
      selectMode: false,
      testIds: [],
    })
    expect(isSelected(JSON.parse(selection.textContent), id1)).toEqual(true)
    expect(isSelected(JSON.parse(selection.textContent), id2)).toEqual(true)
    expect(selectedAll.textContent).toEqual('true')
  })

  test('select multiple at once', async () => {
    const props = {
      name: 'Waterloo Zone',
      size: 'normal',
    }
    const selectedIds = ['abc', 'def']
    const callbacks = [{ name: 'onSelectMultiple', args: [selectedIds.map(id => ({ testId: id }))] }]
    const TC = withSelection({ idParam: 'testId', pluralParam: 'testIds' })(TestComponent(callbacks))
    const { getByTestId } = render(getTestedComponent(TC, props))
    expect(getByTestId('TestComponent')).not.toBeNull()
    act(() => {
      fireEvent.click(getByTestId('onSelectMultiple'))
    })
    const selection = getByTestId('selectionState')
    selectedIds.forEach(selectedId => {
      expect(isSelected(JSON.parse(selection.textContent), selectedId)).toEqual(true)
    })
  })

  test('clear selections', async () => {
    const props = {
      name: 'Waterloo Zone',
      size: 'normal',
    }
    const selectArgs = ['']
    const callbacks = [
      { name: 'onSelected', args: selectArgs },
      { name: 'clearSelection', args: [] },
    ]
    const TC = withSelection({ idParam: 'testId', pluralParam: 'testIds' })(TestComponent(callbacks))
    const { getByTestId, rerender } = render(getTestedComponent(TC, props))

    // Select ids
    const id1 = 'abc'
    const id2 = 'def'

    selectArgs[1] = {
      testId: id1,
    }
    act(() => {
      fireEvent.click(getByTestId('onSelected'))
    })
    rerender(getTestedComponent(TC, props))
    selectArgs[1] = {
      testId: id2,
    }
    act(() => {
      fireEvent.click(getByTestId('onSelected'))
    })
    rerender(getTestedComponent(TC, props))
    const selectedCount = getByTestId('selectedCount')
    const selectionVariables = getByTestId('selectionVariables')
    expect(selectedCount.textContent).toEqual('2')
    expect(JSON.parse(selectionVariables.textContent)).toEqual({
      selectMode: true,
      testIds: [id1, id2],
    })

    // Clear selections
    act(() => {
      fireEvent.click(getByTestId('clearSelection'))
    })
    rerender(getTestedComponent(TC, props))
    expect(selectedCount.textContent).toEqual('0')
    expect(JSON.parse(selectionVariables.textContent)).toEqual({
      selectMode: true,
      testIds: [],
    })
  })
})
