import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import { MemoryRouter, Route } from 'react-router'

import { act, cleanup, createEvent, fireEvent, render } from '@testing-library/react'

import ContextProviderFactory from '../../../tests/ContextProviderFactory'

const MockComponent = props => {
  return <div data-testid="mock">{JSON.stringify(props)}</div>
}

describe('Tile', () => {
  afterEach(cleanup)

  it('check full DOM rendering', () => {
    // Prepare mocks and properties.
    const context = { currentTimePeriod: { date: 'LAST_WEEK' } }
    const mockProvider = ContextProviderFactory(context)
    jest.doMock('../../providers/StateProvider', () => mockProvider)
    const title = 'My Test Title'
    const link = '/testLink'
    const layout = { i: 'mockComponent', x: 0, y: 0, w: 30, h: 6, minW: 20, minH: 6 }
    const style = { width: '1900px', height: '0px' }
    const childProps = { testCount: 300 }

    // Rendering
    const Tile = require('./Tile').Tile
    const { getByText, getByTestId } = render(
      <MemoryRouter initialEntries={['/t1']}>
        <Route
          path="/:tenant"
          element={
            <Tile titleText={title} link={link} layout={layout} child={MockComponent} childProps={childProps} style={style} />
          }
        />
      </MemoryRouter>,
    )

    // Check components and properties
    expect(getByText(title)).toBeTruthy()
    expect(JSON.parse(getByTestId('mock').textContent)).toMatchObject({
      testCount: 300,
    })
  })

  it('test case that child component should get size 0', () => {
    const layout = { i: 'mockComponent', x: 0, y: 0, w: 30, h: 6, minW: 20, minH: 6 }
    const style = { height: '0px', width: '0px' }
    const childProps = { testCount: 300 }

    const Tile = require('./Tile').Tile
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/t1']}>
        <Tile
          titleText="Test Title"
          link="/specialCase"
          layout={layout}
          child={MockComponent}
          childProps={childProps}
          style={style}
        />
      </MemoryRouter>,
    )

    expect(JSON.parse(getByTestId('mock').textContent)).toMatchObject({
      testCount: 300,
      width: 0,
      height: 0,
    })
  })

  it('renders with click-to-link behavior deadened when editMode on', () => {
    const layout = { i: 'mockComponent', x: 0, y: 0, w: 30, h: 6, minW: 20, minH: 6 }
    const style = { height: '0px', width: '0px' }
    const childProps = { testCount: 300 }

    const Tile = require('./Tile').Tile
    const { getByLabelText } = render(
      <MemoryRouter initialEntries={['/t1']}>
        <Tile
          titleText="Test Title"
          link="/specialCase"
          layout={layout}
          child={MockComponent}
          childProps={childProps}
          style={style}
          editMode
        />
      </MemoryRouter>,
    )

    act(() => {
      const node = getByLabelText('Test Title')
      const ev = createEvent.click(node)
      fireEvent(node, ev)
      expect(ev.defaultPrevented).toBe(true)
    })
  })

  it('renders the HelpTip when given helpText', () => {
    const layout = { i: 'mockComponent', x: 0, y: 0, w: 30, h: 6, minW: 20, minH: 6 }
    const style = { height: '0px', width: '0px' }
    const childProps = { testCount: 300 }

    const Tile = require('./Tile').Tile
    const { container } = render(
      <MemoryRouter initialEntries={['/t1']}>
        <Tile
          titleText="Test Title"
          link="/specialCase"
          layout={layout}
          child={MockComponent}
          childProps={childProps}
          style={style}
          helpText="test"
        />
      </MemoryRouter>,
    )

    expect(container.querySelector('.helpTip')).toBeTruthy()
  })
})
