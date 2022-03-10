import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { render } from '@testing-library/react'

import { useTheme } from '@material-ui/core/styles'

import Map from './Map' // for the Provider and Consumer
import MarkerWithConsumer, { googlify, Marker, pointify, sizeify, toGooglePoint, toGoogleSize } from './Marker'

describe('Marker, using mocked google api', () => {
  let mockGoogle = {}
  const mockMap = {}

  const googleMapEventEmitter = {}
  const setMapMock = jest.fn().mockName('setMap (mock)')
  const setIconMock = jest.fn().mockName('setIcon (mock)')
  const setTitleMock = jest.fn().mockName('setTitle (mock)')
  const setPositionMock = jest.fn().mockName('setPosition (mock)')
  const setZIndexMock = jest.fn().mockName('setZindex (mock)')

  const onHoverMock = jest.fn().mockName('onHover (mock)')

  const addListenerMock = jest.fn((event, callback) => {
    googleMapEventEmitter[event] = callback
  })

  beforeEach(() => {
    const mockMarkerApi = jest.fn(() => ({
      addListener: addListenerMock,
      setMap: setMapMock,
      setIcon: setIconMock,
      setTitle: setTitleMock,
      setPosition: setPositionMock,
      setZIndex: setZIndexMock,
    }))

    const mockMapApi = jest.fn(() => ({
      addListener: jest.fn((_, f) => f), // for convenience, we just return the function we got
    }))

    const mockPointApi = jest.fn((x, y) => ({
      x: jest.fn().mockReturnValue(x),
      y: jest.fn().mockReturnValue(y),
    }))

    const mockSizeApi = jest.fn((w, h) => ({
      w: jest.fn().mockReturnValue(w),
      h: jest.fn().mockReturnValue(h),
    }))

    mockGoogle.maps = {
      Map: mockMapApi,
      Marker: mockMarkerApi,
      Point: mockPointApi,
      Size: mockSizeApi,
      event: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
    }
  })

  afterEach(() => {
    mockGoogle = {}
    jest.clearAllMocks()
  })

  it('can create normal one', () => {
    const marker = render(
      <Marker google={mockGoogle} map={mockMap} position={{ lat: 0, lng: -1 }}>
        <div data-testid="consumer">Consumer</div>
      </Marker>,
    )
    expect(marker.getByText('Consumer')).toBeTruthy()
  })

  it('passes google, map and marker to children', () => {
    const marker = render(
      <Marker google={mockGoogle} map={mockMap} position={{ lat: 0, lng: -1 }}>
        <Map.Consumer>
          {({ google, map, marker }) => (
            <div data-testid="consumer">
              <span data-testid="map">{JSON.stringify(map)}</span>
              <span data-testid="position">{JSON.stringify(marker)} </span>
              <span data-testid="google">{JSON.stringify(google)}</span>
            </div>
          )}
        </Map.Consumer>
      </Marker>,
    )
    expect(marker.getByTestId('map').textContent).toBe(JSON.stringify(mockMap))
    expect(marker.getByTestId('position').textContent).toBeDefined()
    expect(marker.getByTestId('google').textContent).toBe(JSON.stringify(mockGoogle))
  })

  it('no riseOnHover property, no addListener calls ', async () => {
    render(<Marker google={mockGoogle} onHover={onHoverMock} map={mockMap} position={{ lat: 0, lng: -1 }} />)

    expect(onHoverMock).not.toHaveBeenCalled()
  })

  it('riseOnHover callbacks work with zIndexOffset', async () => {
    const theme = useTheme()
    render(
      <Marker
        google={mockGoogle}
        map={mockMap}
        position={{ lat: 0, lng: -1 }}
        onHover={onHoverMock}
        riseOnHover
        zIndexOffset={2}
        zIndexMapMarkerHovered={theme.zIndex.bis.mapMarker.hovered}
      />,
    )

    googleMapEventEmitter.mouseover()
    expect(addListenerMock).toHaveBeenNthCalledWith(1, 'mouseover', expect.any(Function))
    expect(setZIndexMock).toHaveBeenNthCalledWith(1, theme.zIndex.bis.mapMarker.hovered)
    expect(onHoverMock).toHaveBeenCalledWith(true)

    googleMapEventEmitter.mouseout()
    expect(addListenerMock).toHaveBeenNthCalledWith(2, 'mouseout', expect.any(Function))
    expect(setZIndexMock).toHaveBeenNthCalledWith(2, 2)
    expect(onHoverMock).toHaveBeenCalledWith(false)
  })

  it('can update title, position, icon and map (mostly a code coverage exercise)', async () => {
    const updateProps = (props, component) => component.rerender(<Marker {...props} />)
    const oldIcon = { bob: 'booo!', url: 'Howdy, Earl', key: 'bob' }
    const newIcon = { fred: 'whoot', url: 'Howday, Earl', key: 'fred' }
    const marker = render(
      <Marker google={mockGoogle} map={mockMap} position={{ lat: 0, lng: -1 }} title="old title" icon={oldIcon} />,
    )

    const newProps = {
      title: 'newTitle',
      icon: newIcon,
      position: { lat: 100, lng: 99 },
      map: null,
    }

    expect(setIconMock).toHaveBeenCalledWith(oldIcon)

    updateProps(newProps, marker)

    expect(setTitleMock).toHaveBeenCalledWith(newProps.title)
    expect(setIconMock).toHaveBeenCalledWith(newProps.icon)
    expect(setPositionMock).toHaveBeenCalledWith(newProps.position)
    expect(setMapMock).toHaveBeenCalledWith(null)
  })

  it('default export Marker passes google and maps to its Marker child', () => {
    const wrapper = render(
      <Map.Provider value={{ google: mockGoogle, map: mockMap }}>
        <MarkerWithConsumer position={{ lat: 0, lng: 0 }}>
          <Map.Consumer>
            {({ google, map, marker }) => (
              <div data-testid="consumer">
                <span data-testid="map">{JSON.stringify(map)}</span>
                <span data-testid="position">{JSON.stringify(marker)} </span>
                <span data-testid="google">{JSON.stringify(google)}</span>
              </div>
            )}
          </Map.Consumer>
        </MarkerWithConsumer>
      </Map.Provider>,
    )

    expect(wrapper.getByTestId('map').textContent).toBe(JSON.stringify(mockMap))
    expect(wrapper.getByTestId('position').textContent).toBeDefined()
    expect(wrapper.getByTestId('google').textContent).toBe(JSON.stringify(mockGoogle))
  })

  describe('ancilliary functions', () => {
    it('pointify and sizeify call Point and Size constructors', () => {
      sizeify(mockGoogle, [3, 4])
      expect(mockGoogle.maps.Size).toHaveBeenCalledWith(3, 4)
      pointify(mockGoogle, [1, 2])
      expect(mockGoogle.maps.Point).toHaveBeenCalledWith(1, 2)
    })

    const originalIcon = { Size: [1, 2], Point: [3, 4], Fred: 'soup' }
    let icon
    beforeEach(() => {
      icon = { ...originalIcon }
    })

    it('toGoogleSize no target', () => {
      toGoogleSize(mockGoogle, icon, 'bob')
      expect(icon).toMatchObject(originalIcon)
    })

    it('toGoogleSize target not an array', () => {
      toGoogleSize(mockGoogle, icon, 'Fred')
      expect(icon).toMatchObject(originalIcon)
    })

    it('toGoogleSize normal behaviour', () => {
      toGoogleSize(mockGoogle, icon, 'Size')
      const { Size: originalSize, ...originalNotSize } = originalIcon
      const { Size, ...newNotSize } = icon

      // all the *other* entries are unchanged
      expect({ ...newNotSize }).toMatchObject({ ...originalNotSize })

      // Size is now the google type
      expect([Size.w(), Size.h()]).toEqual(originalIcon.Size)
    })

    it('toGooglePoint no target', () => {
      toGooglePoint(mockGoogle, icon, 'bob')
      expect(icon).toMatchObject(originalIcon)
    })

    it('toGooglePoint target not an array', () => {
      toGooglePoint(mockGoogle, icon, 'Fred')
      expect(icon).toMatchObject(originalIcon)
    })

    it('toGooglePoint normal behaviour', () => {
      toGooglePoint(mockGoogle, icon, 'Point')
      const { Point: originalPoint, ...originalNotPoint } = originalIcon
      const { Point, ...newNotPoint } = icon

      // all the *other* entries are unchanged
      expect({ ...newNotPoint }).toMatchObject({ ...originalNotPoint })

      // Point is now the google type
      expect([Point.x(), Point.y()]).toEqual(originalIcon.Point)
    })

    it('googlify returns undefined for no icon', () => {
      expect(googlify(mockGoogle, undefined)).not.toBeDefined()
    })

    it('googlify works normally', () => {
      const normalIcon = {
        anchor: [0, 1],
        labelOrigin: [2, 3],
        origin: [4, 5],
        scaledSize: [6, 7],
        size: [8, 9],
      }
      const res = googlify(mockGoogle, normalIcon)
      const { anchor, labelOrigin, origin, scaledSize, size } = res

      // points match original points
      expect([anchor.x(), anchor.y()]).toEqual(normalIcon.anchor)
      expect([labelOrigin.x(), labelOrigin.y()]).toEqual(normalIcon.labelOrigin)
      expect([origin.x(), origin.y()]).toEqual(normalIcon.origin)

      // sizes match original sizes
      expect([scaledSize.w(), scaledSize.h()]).toEqual(normalIcon.scaledSize)
      expect([size.w(), size.h()]).toEqual(normalIcon.size)
    })
  })
})
