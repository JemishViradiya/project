import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, cleanup, render } from '@testing-library/react'

import { mockHookComponent } from '../../tests/utils'
import Map from './Map'

jest.mock('react-portal')
jest.mock('../components/hooks/useRafDebounceCallback', () => fn => fn)

jest.mock('@ues-bis/standalone-shared', () => ({
  usePowerUp: () => false,
  f11n: {
    Context: jest.requireActual('react').createContext({
      privacyMode: { mode: true, maxZoom: 10 },
    }),
  },
}))

describe('Map, using mocked google api', () => {
  beforeEach(() => {
    const getNorthEastMock = jest.fn(() => ({
      lat: jest.fn(() => 1),
      lng: jest.fn(() => 2),
    }))

    const getSouthWestMock = jest.fn(() => ({
      lat: jest.fn(() => 3),
      lng: jest.fn(() => 4),
    }))

    const getCenterMock = jest.fn(() => ({
      lat: jest.fn(() => 48),
      lng: jest.fn(() => 52),
      equals: jest.fn(() => false),
    }))

    const getZoomMock = jest.fn(() => 7)

    const mockMap = jest.fn(() => {
      const map = {
        addListener: jest.fn((_, f) => f), // for convenience, we just return the function we got
        panToBounds: jest.fn(),
        getBounds: jest.fn(() => ({
          getNorthEast: getNorthEastMock,
          getSouthWest: getSouthWestMock,
          equals: jest.fn(() => false),
        })),
        getCenter: getCenterMock,
        getZoom: getZoomMock,
        setCenter: jest.fn(),
        setZoom: jest.fn(),
        setTilt: jest.fn(),
        setOptions: jest.fn(),
        controls: [[]],
        getDiv: jest.fn(() => ({
          getBoundingClientRect: jest.fn(() => ({ width: 100, height: 100 })),
        })),
        getMapTypeId: () => 'roadmap',
      }
      window.google.maps.mapInstance = map
      return map
    })

    window.google.maps = {
      Map: mockMap,
      event: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
      MapTypeControlStyle: {
        DROPDOWN_MENU: 'dropdown_menu', // just needs to be defined
      },
      ControlPosition: {
        TOP_LEFT: 0, // just needs to be defined
        RIGHT_BOTTOM: 0, // it's acutally an index we use
        LEFT_BOTTOM: 0,
      },
    }
  })

  afterEach(async () => {
    await cleanup()
    window.google.maps = {}
  })

  const MockConsumer = mockHookComponent('Consumer')

  it('can create normal one', () => {
    const { container } = render(<Map id="area51" />)
    expect(container).not.toBeEmptyDOMElement()
    const div = container.querySelector('#map')
    expect(div.className).toBe('Normal')
  })

  it('can create fullSize one', () => {
    const { container } = render(<Map id="area51" fullSize />)
    expect(container).not.toBeEmptyDOMElement()
    const div = container.querySelector('#map')
    expect(div.className).toBe('FullSize')
  })

  it('can take a width', () => {
    const { container } = render(<Map id="area51" width={49} />)
    expect(container).not.toBeEmptyDOMElement()
    const div = container.querySelector('#map')
    expect(div.style.width).toBe('49px')
  })

  it('passes google and map to children via Provider', async () => {
    const map = render(
      <Map id="area51" width={49}>
        <Map.Consumer>{({ google, map }) => <MockConsumer google={google} map={map} />}</Map.Consumer>
      </Map>,
    )
    expect(map.container).not.toBeEmptyDOMElement()

    const consumer = map.getByTestId('Consumer')
    expect(consumer.props.google).toBe(window.google)
    expect(consumer.props.map).toMatchObject({
      addListener: expect.any(Function),
      panToBounds: expect.any(Function),
      getBounds: expect.any(Function),
      getCenter: expect.any(Function),
      getZoom: expect.any(Function),
      setCenter: expect.any(Function),
      setZoom: expect.any(Function),
      setOptions: expect.any(Function),
      controls: expect.any(Array),
    })
  })

  it('zoomToBounds works', () => {
    const { getByTestId } = render(
      <Map id="area51" width={49}>
        <Map.Consumer>{({ google, map }) => <MockConsumer google={google} map={map} />}</Map.Consumer>
      </Map>,
    )
    const {
      props: { map },
    } = getByTestId('Consumer')

    map.zoomToClusterBounds(
      [
        {
          bounds: {
            top_left: { lat: 1, lon: 2 },
            bottom_right: { lat: 3, lon: 4 },
          },
        },
      ],
      4,
    )
    expect(map.panToBounds).toHaveBeenCalledWith(
      { north: 3, west: 2, south: 1, east: 4 },
      { bottom: 90, left: 40, right: 40, top: 90 },
    )
  })

  it('callViewportChangedWithBounds works', () => {
    const VPChangedMock = jest.fn()
    render(<Map id="area51" width={49} onViewportChanged={VPChangedMock} />)
    const mapInstance = window.google.maps.mapInstance
    const changeListener = mapInstance.addListener.mock.calls[0][1]
    act(() => {
      expect(() => {
        // without a onViewportChanged property, it shouldn't throw
        changeListener("don't care")
      }).not.toThrow()
    })

    const mockViewport = {
      center: { lat: 48, lng: 52 },
      zoom: 7,
    }
    act(() => changeListener('zoom_changed'))
    expect(VPChangedMock).toHaveBeenCalledWith(mockViewport, {
      top_left: { lat: 1, lon: 4 },
      bottom_right: { lat: 3, lon: 2 },
    })
  })

  const googleMapHasLoaded = wrapper =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const googleMap = window.google.maps.mapInstance
        if (googleMap) {
          resolve(googleMap)
        } else {
          reject(new Error('no map found in the state after 10ms'))
        }
      }, 10)
    })

  it('loads a map, installs listeners on render, and uninstalls listeners on unmount', async () => {
    const map = render(<Map id="area51" width={49} />)
    const googleMap = await googleMapHasLoaded(map)
    expect(googleMap.addListener).toHaveBeenCalledTimes(2)
    await cleanup()
    expect(window.google.maps.event.removeListener).toHaveBeenCalledTimes(2)
  })

  it('changeListener talks to the right people', async () => {
    const vpChangedMock = jest.fn()
    const map = render(<Map id="area51" onViewportChanged={vpChangedMock} width={49} />)
    const googleMap = await googleMapHasLoaded(map)
    const changeListener = googleMap.addListener.mock.calls[0][1] // same as centerListenerId, btw

    // trigger a change
    await act(async () => changeListener())
    expect(googleMap.getZoom).toHaveBeenCalled()
    expect(googleMap.getCenter).toHaveBeenCalled()
    expect(vpChangedMock).toHaveBeenCalledTimes(1)
    const expectedViewport = {
      center: { lat: 48, lng: 52 },
      zoom: 7,
    }
    const expectedBoundingBox = {
      top_left: { lat: 1, lon: 4 },
      bottom_right: { lat: 3, lon: 2 },
    }
    expect(vpChangedMock).toHaveBeenCalledWith(expectedViewport, expectedBoundingBox)
  })

  it('changing the viewport triggers changes to google map', async () => {
    const map = render(<Map id="area51" width={49} />)
    const googleMap = await googleMapHasLoaded(map)

    const newViewport = {
      center: { lat: 70, lng: -71 },
      zoom: 11,
    }
    window.google.maps.mapInstance.zoom = 2
    window.google.maps.mapInstance.center = { toJSON: () => ({ lat: 12, lon: 12 }) }

    act(() => {
      map.rerender(<Map id="area51" width={49} viewport={newViewport} />)
    })

    expect(googleMap.setZoom).toHaveBeenCalledWith(11)
    expect(googleMap.setCenter.mock.calls[0][0]).toMatchObject(newViewport.center)
  })
})
