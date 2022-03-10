import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react'

import AppGrid, { LayoutsKey, resetToDefaultLayout } from './AppGrid'

//
// for these tests, we just need to see if a click causes a response or not
// we don't really need to see rerendering of the grid.
//
// so mock, mock, mock, mock, mock....
//
jest.mock('../../components/hooks/useComponentSize', () => () => 500)
jest.mock('../../components/layout/Tile')
jest.mock('../../charts/RiskSummary')
jest.mock('../../charts/BehaviorRiskLine')
jest.mock('../../charts/LatestEvents')
jest.mock('../../charts/GeozoneRiskLine')
jest.mock('../../charts/MapChart')
jest.mock('../../charts/EventCounter')
jest.mock('../../charts/UserCounter')
jest.mock('../../charts/TopActions')

// remember this during tests
let onLayoutChange
jest.mock('../../components/layout/TileLayout', () => ({
  // just need something that can say what the props were...
  Responsive: ({ children, onLayoutChange: cb, ...props }) => {
    onLayoutChange = cb // remember it so that we can call it...
    return <span data-testid="Responsive"> {JSON.stringify(props, null, 2)} </span>
  },
}))

const WithTestButton = props => {
  return (
    <div style={{ width: 500, height: 500 }}>
      <AppGrid width={500} height={500} {...props} />
      <button data-testid="resetButton" onClick={resetToDefaultLayout} />
    </div>
  )
}

const timeout = { timeout: 750 } // don't bother waiting too long

describe('AppGrid ResetToDefault', () => {
  beforeEach(() => {
    // prep localStorage
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  test('clicking resetToDefault does nothing when there has been no change', async () => {
    const { getByTestId } = render(<WithTestButton editMode={false} />)
    const button = getByTestId('resetButton')
    const preClickLayouts = JSON.parse(getByTestId('Responsive').textContent).layouts
    expect(localStorage.getItem(LayoutsKey)).toBeNull()

    act(() => {
      fireEvent.click(button)
    })
    let responsive
    await waitFor(() => (responsive = getByTestId('Responsive')), timeout)
    const postClickLayouts = JSON.parse(responsive.textContent).layouts
    expect(preClickLayouts).toMatchObject(postClickLayouts)
    expect(localStorage.getItem(LayoutsKey)).toBeNull()
  })

  test('dispatching a ResetAppGridLayout event on the DOM restores the default layout', async () => {
    const fakeLayout = { lg: [{ i: 'FakeLayout', x: 5, y: 5, w: 8, h: 9 }] }

    const { rerender, getByTestId } = render(<WithTestButton editMode />)
    const button = getByTestId('resetButton')
    const originalLayouts = JSON.parse(getByTestId('Responsive').textContent).layouts
    expect(localStorage.getItem(LayoutsKey)).toBeNull()

    let responsive

    // change the layout
    act(() => {
      // onLayoutChange() is only triggered by <Responsive> on a layout change, so <AppGrid>
      // doesn't need to be update <Responsive> with new properties after a call.
      // BUT, we're checking the new value of the "layouts" below using the property provided to
      // <Responsive>, so we have to force a rerender to make sure we can find it
      onLayoutChange(null, fakeLayout)
    })
    rerender(<WithTestButton editMode={false} />)
    await waitFor(() => (responsive = getByTestId('Responsive')), timeout)
    const rearrangedLayouts = JSON.parse(responsive.textContent).layouts
    const rearrangedLocalStorage = JSON.parse(localStorage.getItem(LayoutsKey))
    // new layout should be different, and local storage should reflect that
    expect(originalLayouts).not.toMatchObject(rearrangedLayouts)
    expect(rearrangedLocalStorage).toMatchObject(rearrangedLayouts)

    // reset the layout
    act(() => {
      fireEvent.click(button)
      // this one *must* trigger a rerender internally...
    })
    await waitFor(() => (responsive = getByTestId('Responsive')), timeout)
    const restoredLayouts = JSON.parse(responsive.textContent).layouts
    const restoredLocalStorage = JSON.parse(localStorage.getItem(LayoutsKey))
    // new layout should be the same as at the start, and local storage should reflect that, too
    expect(originalLayouts).toMatchObject(restoredLayouts)
    expect(restoredLocalStorage).toBeNull()
  })

  test('window storage events not meant for AppGrid do nothing', async () => {
    const fakeLayout = { lg: [{ i: 'FakeLayout', x: 5, y: 5, w: 8, h: 9 }] }

    const { rerender, getByTestId } = render(<WithTestButton editMode />)
    const originalLayouts = JSON.parse(getByTestId('Responsive').textContent).layouts
    expect(localStorage.getItem(LayoutsKey)).toBeNull()

    let responsive

    // change the layout to something else
    act(() => {
      // onLayoutChange() is only triggered by <Responsive> on a layout change, so <AppGrid>
      // doesn't need to be update <Responsive> with new properties after a call.
      // BUT, we're checking the new value of the "layouts" below using the property provided to
      // <Responsive>, so we have to force a rerender to make sure we can find it
      onLayoutChange(null, fakeLayout)
    })
    rerender(<WithTestButton editMode={false} />)
    await waitFor(() => (responsive = getByTestId('Responsive')), timeout)
    const rearrangedLayouts = JSON.parse(responsive.textContent).layouts
    const rearrangedLocalStorage = JSON.parse(localStorage.getItem(LayoutsKey))
    // new layout should be different, and local storage should reflect that
    expect(originalLayouts).not.toMatchObject(rearrangedLayouts)
    expect(rearrangedLocalStorage).toMatchObject(rearrangedLayouts)

    let currentLocalStorage
    let currentLayouts
    act(() => {
      // not a key we care about
      window.dispatchEvent(new StorageEvent('storage', { key: 'bob' }))
    })
    rerender(<WithTestButton editMode />) // force it...
    await waitFor(() => (responsive = getByTestId('Responsive')), timeout)
    currentLayouts = JSON.parse(responsive.textContent).layouts
    currentLocalStorage = JSON.parse(localStorage.getItem(LayoutsKey))

    // layout in ref and in localStorage should be untouched
    expect(rearrangedLayouts).toMatchObject(currentLayouts)
    expect(rearrangedLocalStorage).toMatchObject(currentLocalStorage)

    act(() => {
      // not a storage area we care about
      window.dispatchEvent(new StorageEvent('storage', { key: LayoutsKey, storageArea: sessionStorage }))
    })
    rerender(<WithTestButton editMode={false} />) // force it...
    await waitFor(() => (responsive = getByTestId('Responsive')), timeout)
    currentLayouts = JSON.parse(responsive.textContent).layouts
    currentLocalStorage = JSON.parse(localStorage.getItem(LayoutsKey))

    // layout in ref and in localStorage should be untouched
    expect(rearrangedLayouts).toMatchObject(currentLayouts)
    expect(rearrangedLocalStorage).toMatchObject(currentLocalStorage)

    act(() => {
      // no change in the value
      window.dispatchEvent(new StorageEvent('storage', { key: LayoutsKey, storageArea: localStorage, oldValue: 1, newValue: 1 }))
    })
    rerender(<WithTestButton editMode />) // force it...
    await waitFor(() => (responsive = getByTestId('Responsive')), timeout)
    currentLayouts = JSON.parse(responsive.textContent).layouts
    currentLocalStorage = JSON.parse(localStorage.getItem(LayoutsKey))

    // layout in ref and in localStorage should be untouched
    expect(rearrangedLayouts).toMatchObject(currentLayouts)
    expect(rearrangedLocalStorage).toMatchObject(currentLocalStorage)
  })

  test('remote changes to localStorage are taken into account', async () => {
    const fakeLayout = { lg: [{ i: 'FakeLayout', x: 5, y: 5, w: 8, h: 9 }] }
    const bogusLayout = { lg: [{ i: 'DifferentFakeLayout', x: 15, y: 15, w: 18, h: 19 }] }

    const { getByTestId } = render(<WithTestButton editMode />)
    const originalLayouts = JSON.parse(getByTestId('Responsive').textContent).layouts
    const originalLocalStorage = JSON.parse(localStorage.getItem(LayoutsKey))
    expect(originalLocalStorage).toBeNull()

    let responsive
    let currentLocalStorage
    let currentLayouts

    //
    // change from default (null) to something new
    //
    let oldValue = null
    let newValue = JSON.stringify(fakeLayout)
    act(() => {
      localStorage.setItem(LayoutsKey, newValue)

      // and notify (this isn't supposed to happen automatically)
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: LayoutsKey,
          storageArea: localStorage,
          oldValue,
          newValue,
        }),
      )
    })
    await waitFor(() => (responsive = getByTestId('Responsive')), timeout)
    currentLayouts = JSON.parse(responsive.textContent).layouts
    currentLocalStorage = JSON.parse(localStorage.getItem(LayoutsKey))

    // new layout should be in local storage and in the component
    expect(originalLayouts).not.toMatchObject(currentLayouts)
    expect(currentLocalStorage).toMatchObject(currentLayouts)
    expect(currentLocalStorage).toMatchObject(fakeLayout)

    //
    // change from one new setting to another
    //
    oldValue = JSON.stringify(fakeLayout)
    newValue = JSON.stringify(bogusLayout)
    act(() => {
      localStorage.setItem(LayoutsKey, newValue)

      // and notify (this isn't supposed to happen automatically)
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: LayoutsKey,
          storageArea: localStorage,
          oldValue,
          newValue,
        }),
      )
    })
    await waitFor(() => (responsive = getByTestId('Responsive')), timeout)
    currentLayouts = JSON.parse(responsive.textContent).layouts
    currentLocalStorage = JSON.parse(localStorage.getItem(LayoutsKey))

    // new layout should be in local storage and in the component
    expect(currentLocalStorage).toMatchObject(currentLayouts)
    expect(currentLocalStorage).toMatchObject(bogusLayout)

    //
    // change from new setting back to default
    //
    oldValue = JSON.stringify(fakeLayout)
    newValue = null
    act(() => {
      localStorage.removeItem(LayoutsKey)

      // and notify (this isn't supposed to happen automatically)
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: LayoutsKey,
          storageArea: localStorage,
          oldValue,
          newValue,
        }),
      )
    })
    await waitFor(() => (responsive = getByTestId('Responsive')), timeout)
    currentLayouts = JSON.parse(responsive.textContent).layouts
    currentLocalStorage = localStorage.getItem(LayoutsKey)

    // default layout should be in local storage and in the component
    expect(currentLayouts).toMatchObject(originalLayouts)
    expect(currentLocalStorage).toBeNull()
  })
})
