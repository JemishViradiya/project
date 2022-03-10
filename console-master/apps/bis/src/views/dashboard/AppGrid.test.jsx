import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, cleanup, render, waitFor } from '@testing-library/react'

import AppGrid, { LayoutsKey } from './AppGrid'

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

let onLayoutChange
jest.mock('../../components/layout/TileLayout', () => ({
  // just need something that can say what the props were...
  Responsive: ({ children, onLayoutChange: cb, ...props }) => {
    onLayoutChange = cb
    return <span data-testid="Responsive"> {JSON.stringify(props, null, 2)} </span>
  },
}))

const RenderAppGrid = props => {
  return (
    <div style={{ width: 500, height: 500 }}>
      <AppGrid width={500} height={500} {...props} />
    </div>
  )
}

describe('AppGrid', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  test('it renders', async () => {
    const { container } = render(<RenderAppGrid />)
    expect(container).not.toBeEmptyDOMElement()
  })

  test('uses localStorage if it exists', () => {
    const fakeLayout = { lg: [{ i: 'FakeLayout', x: 0, y: 0, w: 0, h: 0 }] }
    window.localStorage.setItem(LayoutsKey, JSON.stringify(fakeLayout))

    const { container, getByTestId } = render(<RenderAppGrid />)
    expect(container).not.toBeEmptyDOMElement()

    // see if it got picked up...
    const responsiveLayouts = JSON.parse(getByTestId('Responsive').textContent).layouts
    expect(responsiveLayouts).not.toBeNull()
    expect(responsiveLayouts).toEqual(fakeLayout)
  })

  test('if no preexisting layouts (in localStorage) exists, uses default layout', () => {
    const { container, getByTestId } = render(<RenderAppGrid />)
    expect(container).not.toBeEmptyDOMElement()

    // verify that default is used.
    const responsiveLayouts = JSON.parse(getByTestId('Responsive').textContent).layouts
    expect(responsiveLayouts).not.toBeNull()
    expect(responsiveLayouts).toHaveProperty('lg')
    expect(responsiveLayouts.lg).toHaveLength(8) // there are 8 tiles
    responsiveLayouts.lg.forEach(l => {
      expect(l).toMatchObject({
        i: expect.any(String),
        x: expect.any(Number),
        y: expect.any(Number),
        w: expect.any(Number),
        h: expect.any(Number),
        minW: expect.any(Number),
        minH: expect.any(Number),
      })
    })
  })

  test('responds to onLayoutChange', async () => {
    const fakeLayout = { lg: [{ i: 'FakeLayout', x: 5, y: 5, w: 8, h: 9 }] }

    const { container, getByTestId, rerender } = render(<RenderAppGrid />)
    expect(container).not.toBeEmptyDOMElement()

    const responsiveLayouts = getByTestId('Responsive')
    expect(responsiveLayouts).not.toBeNull()

    act(() => {
      onLayoutChange(null, fakeLayout)
    })
    rerender(<RenderAppGrid />)
    await waitFor(() => getByTestId('Responsive'), { timeout: 750 })

    const storedLayouts = window.localStorage.getItem(LayoutsKey)
    expect(storedLayouts).not.toBe(null)
    expect(fakeLayout).toMatchObject(JSON.parse(storedLayouts))
  })
})
