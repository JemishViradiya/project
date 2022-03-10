import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, fireEvent, render } from '@testing-library/react'

import DrawingControlsWithConsumer, { DrawingControls } from './DrawingControls'
import Map from './Map'

expect.extend({
  toMatchLatLng(received, lat, lng) {
    const pass = received.lat() === lat && received.lng() === lng
    if (pass) {
      return {
        message: () => `expected (${received.lng()}, ${received.lat()}) not to be (${lng}, ${lat})`,
        pass: true,
      }
    }
    return {
      message: () => `expected (${received.lng()}, ${received.lat()}) to be (${lng}, ${lat})`,
      pass: false,
    }
  },
})

const t = global.T()

const toggleCircle = component =>
  act(() => {
    fireEvent.click(component.getAllByRole('button')[0])
  })

const togglePolygon = component =>
  act(() => {
    fireEvent.click(component.getAllByRole('button')[1])
  })

describe('DrawingControls, using mocked google api', () => {
  let mockGoogle = {}
  let mockMap = {}

  const drawingManagerEventEmitter = {}

  beforeEach(() => {
    const mockDrawingManagerApi = jest.fn(() => ({
      addListener: jest.fn((event, callback) => {
        drawingManagerEventEmitter[event] = callback
      }),
      setMap: jest.fn().mockName('setMap (mock)'),
      getMap: jest.fn().mockName('getMap (mock)'),
      setOptions: jest.fn().mockName('setOptions (mock)'),
    }))

    const mockMapApi = jest.fn(() => ({
      addListener: jest.fn((_, f) => f),
    }))

    mockGoogle.maps = {
      Map: mockMapApi,
      //      DrawingControls: mockPolygonApi,
      drawing: {
        OverlayType: {
          CIRCLE: 'circle',
          POLYGON: 'polygon',
        },
        DrawingManager: mockDrawingManagerApi,
      },
      LatLngBounds: jest.fn(),
      event: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
    }

    mockMap = new mockGoogle.maps.Map()
  })

  afterEach(() => {
    mockGoogle = {}
  })

  it('can create normal one', () => {
    const props = {
      t: x => t(x),
      google: mockGoogle,
      map: mockMap,
      circlePopup: jest.fn(),
      polygonPopup: jest.fn(),
      fillColor: 'fill',
      strokeColor: 'stroke',
    }
    const drawingControls = render(<DrawingControls {...props} />)

    expect(drawingControls).toBeTruthy()
    expect(drawingControls.getByTitle('Add circular geozone')).toBeTruthy()
    expect(drawingControls.getByTitle('Add custom geozone')).toBeTruthy()
  })

  describe('default export DrawingControls passes google and maps to its Polygon child', () => {
    const props = {
      t: x => t(x),
      circlePopup: jest.fn(),
      polygonPopup: jest.fn(),
      fillColor: 'fill',
      strokeColor: 'stroke',
    }
    it('renders valid classes if proper types has been passed', async () => {
      const wrapper = render(
        <Map.Provider value={{ google: mockGoogle, map: mockMap }}>
          <DrawingControlsWithConsumer {...props} />
        </Map.Provider>,
      )
      const icons = wrapper.getAllByRole('img')

      expect(icons[0]).not.toHaveClass('selected')
      toggleCircle(wrapper)
      expect(icons[0]).toHaveClass('selected')
      expect(icons[1]).not.toHaveClass('selected')
      togglePolygon(wrapper)
      expect(icons[1]).toHaveClass('selected')
    })

    it('does not render valid class if empty types has been passed', async () => {
      mockGoogle.maps.drawing.OverlayType = {}
      const wrapper = render(
        <Map.Provider value={{ google: mockGoogle, map: mockMap }}>
          <DrawingControlsWithConsumer {...props} />
        </Map.Provider>,
      )
      const icons = wrapper.getAllByRole('img')

      expect(icons[0]).not.toHaveClass('selected')
      toggleCircle(wrapper)
      expect(icons[0]).not.toHaveClass('selected')
      expect(icons[1]).not.toHaveClass('selected')
      togglePolygon(wrapper)
      expect(icons[1]).not.toHaveClass('selected')
    })
  })

  it('toggling circle/polygon via click works', async () => {
    const props = {
      t: x => t(x),
      circlePopup: jest.fn(),
      polygonPopup: jest.fn(),
      fillColor: 'fill',
      strokeColor: 'stroke',
      google: mockGoogle,
      map: mockMap,
    }
    const drawingControls = render(<DrawingControls {...props} />)

    const icons = drawingControls.getAllByRole('img')

    // hitting the "toggle circle" button toggles the mode to/from circle mode
    toggleCircle(drawingControls)
    expect(icons[0]).toHaveClass('selected')
    toggleCircle(drawingControls)
    expect(icons[0]).not.toHaveClass('selected')

    // hitting the "toggle polygon" button toggles the mode to/from polygon mode
    togglePolygon(drawingControls)
    expect(icons[1]).toHaveClass('selected')
    togglePolygon(drawingControls)
    expect(icons[1]).not.toHaveClass('selected')

    // change straight from polygon to circle or vice versa
    toggleCircle(drawingControls)
    togglePolygon(drawingControls)
    expect(icons[1]).toHaveClass('selected')
    toggleCircle(drawingControls)
    expect(icons[0]).toHaveClass('selected')
  })

  it('when drawingManager finishes drawing, our parent component is notified via callbacks', async () => {
    const props = {
      t: x => t(x),
      circlePopup: jest.fn(),
      polygonPopup: jest.fn(),
      fillColor: 'fill',
      strokeColor: 'stroke',
      google: mockGoogle,
      map: mockMap,
    }

    render(<DrawingControls {...props} />)

    // simulate the drawingManager completing a circle
    const mockCircle = { setMap: jest.fn() }
    drawingManagerEventEmitter.circlecomplete(mockCircle)

    expect(props.circlePopup).toHaveBeenCalledTimes(1)
    expect(props.circlePopup).toHaveBeenCalledWith(mockCircle)
    // in preparation for the next part, we're just faking up what bounds will do
    const mockBounds = {
      extend: jest.fn(), // yeah, we don't care...
    }
    mockGoogle.maps.LatLngBounds.mockImplementation(() => mockBounds)

    // simulate the drawingManager completing a polygon
    const mockPolygon = {
      setMap: jest.fn(),
      getPath: jest.fn(() => [
        { lat: () => 10, lng: () => 20 },
        { lat: () => 15, lng: () => -15 },
        { lat: () => 12, lng: () => 0 },
      ]),
    }

    drawingManagerEventEmitter.polygoncomplete(mockPolygon)

    expect(props.circlePopup).toHaveBeenCalledTimes(1)
    expect(props.polygonPopup).toHaveBeenCalledWith(mockPolygon)

    // also, the previous circle should have been kicked out...
    expect(mockCircle.setMap).toHaveBeenCalledWith(null)

    // for the sake of code coverage only, do the circle again...
    drawingManagerEventEmitter.circlecomplete(mockCircle)
    expect(props.circlePopup).toHaveBeenCalledTimes(2)
    expect(props.circlePopup).toHaveBeenCalledWith(mockCircle)
  })
})
