import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { render } from '@testing-library/react'

import Map from './Map'
import PopupWithConsumer, { Popup } from './Popup' // for the consumer...
import { Popup as UtilPopup } from './PopupHelper'

// this get's hoisted by babel
jest.mock('./PopupHelper', () => ({ Popup: jest.fn() }))

const mockEventName = 'bing bing bing'
const mockRemoveEvent = 'bonk bonk bonk'

const getAddListenerMock = eventEmitter =>
  jest.fn((event, callback) => {
    eventEmitter[event] = callback
  })

describe('Popup, using mocked google api', () => {
  const position = { lat: () => 5, lng: () => -9 }
  let mockGoogle = {}
  let mockMap = {}
  const popupEventEmitter = {}
  const markerEventEmitter = {}

  const popupAddListenerMock = getAddListenerMock(popupEventEmitter)
  const markerAddListenerMock = getAddListenerMock(markerEventEmitter)

  const onOpenMock = jest.fn().mockName('onOpen (mock)')
  const onCloseMock = jest.fn().mockName('onClose (mock)')
  const setPositionMock = jest.fn().mockName('setPosition (mock)')
  const setAutoCloseMock = jest.fn().mockName('setAutoClose (mock)')
  const setOffsetMock = jest.fn().mockName('setOffset (mock)')
  const setMarkerMock = jest.fn().mockName('setMarker (mock)')
  const setMapMock = jest.fn().mockName('setMap (mock)')
  const panToMock = jest.fn().mockName('panTo (mock)')
  const setPrivateMock = jest.fn().mockName('setPrivate (mock')

  UtilPopup.mockImplementation(() => {
    const container = document.body
    return {
      getPosition: jest.fn().mockName('getPosition (mock)'),
      setPosition: setPositionMock,
      setMarker: setMarkerMock,
      setRisk: jest.fn().mockName('setRisk (mock)'),
      setMap: setMapMock,
      setOffset: setOffsetMock,
      setAutoClose: setAutoCloseMock,
      setPrivate: setPrivateMock,
      open: jest.fn().mockName('open (mock)'),
      close: jest.fn().mockName('close (mock)'),
      addListener: popupAddListenerMock.mockName('popupListener'),
      getContainer: jest.fn(() => container).mockName('getContainer (mock)'),
      FIRST_DRAW_AFTER_OPEN_EVENT: mockEventName,
      REMOVE_EVENT: mockRemoveEvent,
    }
  })

  beforeEach(() => {
    const mockMarkerApi = jest.fn(() => ({
      addListener: markerAddListenerMock.mockName('markerListener'),
      setMap: jest.fn().mockName('setMap (mock)'),
      setOptions: jest.fn().mockName('setOptions (mock)'),
    }))

    const mockMapApi = jest.fn(() => ({
      addListener: jest.fn((_, f) => f).mockName('addListener (mock)'), // for convenience, we just return the function we got
      panTo: panToMock,
    }))

    mockGoogle.maps = {
      Map: mockMapApi,
      Marker: mockMarkerApi,
      event: {
        addListener: jest.fn((_, f) => f).mockName('addListener (mock)'), // for convenience, we just return the function we got
        removeListener: jest.fn().mockName('removeListener (mock)'),
      },
    }

    mockMap = new mockGoogle.maps.Map()
  })

  afterEach(() => {
    mockGoogle = {}
    mockMap = {}
    jest.clearAllMocks()
  })

  it('can create a normal popup', () => {
    const wrapper = render(
      <Popup google={mockGoogle} map={mockMap} position={position} autopan={false}>
        <div data-testid="popupChild">Popup</div>
      </Popup>,
    )
    expect(wrapper.getByText('Popup')).toBeTruthy()
  })
  it('PopupWithConsumer passes google and maps and marker to its Popup child', () => {
    const mockOptions = { googleP: true }
    const mockMarker = new mockGoogle.maps.Marker()
    const wrapper = render(
      <Map.Provider value={{ google: mockGoogle, map: mockMap, marker: mockMarker }}>
        <PopupWithConsumer options={mockOptions} position={position} onOpen={onOpenMock}>
          <Map.Consumer>
            {({ google, map, marker }) => (
              <div data-testid="popupChild">
                <span data-testid="map">{JSON.stringify(map)}</span>
                <span data-testid="position">{JSON.stringify(marker)} </span>
                <span data-testid="google">{JSON.stringify(google)}</span>
              </div>
            )}
          </Map.Consumer>
        </PopupWithConsumer>
      </Map.Provider>,
    )
    markerEventEmitter.click()

    expect(wrapper.getByTestId('map').textContent).toBe(JSON.stringify(mockMap))
    expect(wrapper.getByTestId('position').textContent).toBeDefined()
    expect(wrapper.getByTestId('google').textContent).toBe(JSON.stringify(mockGoogle))

    expect(popupAddListenerMock).toHaveBeenNthCalledWith(1, mockEventName, expect.any(Function))
    expect(popupAddListenerMock).toHaveBeenNthCalledWith(2, mockEventName, expect.any(Function))
    expect(markerAddListenerMock).toHaveBeenNthCalledWith(1, 'click', expect.any(Function))
  })

  it('normal popup with a position prop should start opened', async () => {
    const position = { lat: () => 5, lng: () => -9 }
    render(
      <Popup google={mockGoogle} map={mockMap} autopan={false} position={position}>
        <div data-testid="popupChild">Popup</div>
      </Popup>,
    )
    expect(setPositionMock).toHaveBeenCalledWith(position, undefined)
  })

  it('normal popup with position and invertedPosition props should start opened', async () => {
    const position = { lat: () => 5, lng: () => -9 }
    const invertedPosition = { lat: () => 8, lng: () => -18 }
    render(
      <Popup google={mockGoogle} map={mockMap} autopan={false} position={position} invertedPosition={invertedPosition}>
        <div id="child" />
      </Popup>,
    )

    expect(setPositionMock).toHaveBeenCalledWith(position, invertedPosition)
  })

  it('can update props and map (mostly a code coverage exercise)', async () => {
    const mockMarker1 = new mockGoogle.maps.Marker()
    const oldProps = {
      google: mockGoogle,
      map: mockMap,
      marker: mockMarker1,
      offset: { x: 1, y: 1 },
    }
    const popup = render(
      <Popup {...oldProps}>
        <div data-testid="popupChild">Popup</div>
      </Popup>,
    )

    expect(setAutoCloseMock).toHaveBeenCalledWith(true)
    expect(setOffsetMock).toHaveBeenCalledWith(oldProps.offset)
    expect(setMarkerMock).toHaveBeenCalledWith(oldProps.marker)
    expect(setMapMock).toHaveBeenCalledWith(oldProps.map)

    const mockMarker2 = new mockGoogle.maps.Marker()
    const newProps = {
      google: mockGoogle,
      map: { hey: 'not a real map' },
      marker: mockMarker2,
      offset: { x: 2, y: 2 },
    }
    popup.rerender(
      <Popup {...newProps}>
        <div data-testid="popupChild">Popup</div>
      </Popup>,
    )

    expect(setAutoCloseMock).toHaveBeenCalledWith(true)
    expect(setOffsetMock).toHaveBeenCalledWith(newProps.offset)
    expect(setMarkerMock).toHaveBeenCalledWith(newProps.marker)
    expect(setMapMock).toHaveBeenCalledWith(newProps.map)
  })

  it('marker click triggers open', async () => {
    const mockMarker = new mockGoogle.maps.Marker()
    const props = {
      google: mockGoogle,
      map: mockMap,
      marker: mockMarker,
    }
    const popup = render(
      <Popup {...props}>
        <div data-testid="popupChild">Popup</div>
      </Popup>,
    )

    expect(popup.queryByText('Popup')).toBeFalsy()
    markerEventEmitter.click()
    expect(popup.getByText('Popup')).toBeTruthy()
  })

  it('autopan trigger pan', async () => {
    const mockMarker = new mockGoogle.maps.Marker()
    const props = {
      google: mockGoogle,
      map: mockMap,
      marker: mockMarker,
    }
    render(
      <Popup {...props}>
        <div data-testid="popupChild">Popup</div>
      </Popup>,
    )

    const newLatlng = { lat: 8, lng: 8 }
    popupEventEmitter[mockEventName](newLatlng)

    expect(panToMock).toHaveBeenCalledWith(newLatlng)
  })

  it('tirgers onClose fn after removeEvent is triggered', async () => {
    const mockMarker = new mockGoogle.maps.Marker()
    const props = {
      google: mockGoogle,
      map: mockMap,
      marker: mockMarker,
      onClose: onCloseMock,
    }
    render(
      <Popup {...props}>
        <div data-testid="popupChild">Popup</div>
      </Popup>,
    )

    popupEventEmitter[mockRemoveEvent]()

    expect(popupAddListenerMock).toHaveBeenNthCalledWith(1, mockEventName, expect.any(Function))
    expect(popupAddListenerMock).toHaveBeenNthCalledWith(2, mockRemoveEvent, expect.any(Function))
    expect(onCloseMock).toHaveBeenCalled()
  })
})
