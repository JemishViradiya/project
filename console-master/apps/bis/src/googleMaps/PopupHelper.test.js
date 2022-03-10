// can't import Popup from PopupHelper here (because we need to mock the google api's first
// and they're in the global window.google)

describe('Popup class based on OverlayView from Google Maps API', () => {
  let mockGoogleMaps
  let mockMap
  let Popup
  let activePopup

  beforeAll(() => {
    const mockMapApi = jest.fn(() => ({
      // for testing convenience, we return the function parameter as the id
      addListener: jest.fn((_, f) => f).mockName('addListener (mock)'),
      setCenter: jest.fn().mockName('setCenter (mock)'),
      getCenter: jest.fn().mockName('setCenter (mock)'),
      setZoom: jest.fn().mockName('setZoom (mock)'),
      fitBounds: jest.fn().mockName('fitBounds (mock)'),
    }))

    mockGoogleMaps = {
      OverlayView: {
        preventMapHitsAndGesturesFrom: jest.fn().mockName('preventMapHitsAndGesturesFrom'),
        prototype: {
          getMap: jest.fn().mockName('getMap (mock OverlayView)'),
          setMap: jest.fn().mockName('setMap (mock OverlayView)'),
          getPanes: jest.fn().mockName('getPanes (mock OverlayView)'),
          getProjection: jest.fn().mockName('getProjection (mock OverlayView)'),
        },
      },
      Map: mockMapApi,
      event: {
        removeListener: jest.fn(),
        trigger: jest.fn(),
      },
    }
    mockMap = new mockGoogleMaps.Map()

    window.google.maps = mockGoogleMaps

    // *NOW* we can init "PopupHelper" and load its exports with google apis mocked out
    Popup = require('./PopupHelper').Popup
    activePopup = require('./PopupHelper').activePopup
  })

  it('can create new', () => {
    const popup = new Popup()
    // should hand us the container when asked
    expect(popup.getContainer()).toBeDefined()
  })

  it('reports its position appropriately', () => {
    const popup = new Popup()

    // no defined anything...
    expect(popup.getPosition()).toBeUndefined()

    // if map is set, use it's center
    mockMap.getCenter.mockReturnValue({ lat: 5, lng: 10 })
    popup.setMap(mockMap)
    expect(popup.getPosition()).toEqual(mockMap.getCenter())

    // ... unless we've set the position explicitly
    const popupPosition = { lat: 17, lng: 23 }
    popup.setPosition(popupPosition)
    expect(popup.getPosition()).toEqual(popupPosition)

    // ... unless we've set an associated marker
    const mockMarker = {
      getPosition: jest.fn(() => ({ lat: -75, lng: 18 })),
    }
    popup.setMarker(mockMarker)
    expect(popup.getPosition()).toEqual(mockMarker.getPosition())
  })

  it('responds to google onAdd/onRemove appropriately', () => {
    const popup = new Popup()

    const mockGetPanes = mockGoogleMaps.OverlayView.prototype.getPanes
    const floatPane = document.createElement('div')

    mockGetPanes.mockReturnValueOnce({ floatPane })

    // before adding, no children
    expect(floatPane.children).toHaveLength(0)

    // adding/removing is ok
    popup.onAdd()
    expect(floatPane.children).toHaveLength(1)
    popup.onRemove()
    expect(floatPane.children).toHaveLength(0)

    // removing when not added?  that's okay!
    expect(() => {
      popup.onRemove()
    }).not.toThrow()
  })

  it('can open()/close()', () => {
    const popup = new Popup()

    // no active popups in any active maps yet
    expect(activePopup.size).toEqual(0)

    // popup not associated with a map, so won't change active popups map
    popup.open()
    expect(activePopup.size).toEqual(0)

    // okay, put a fake one as the active one
    const fakePopup = { close: jest.fn() }
    activePopup.set(mockMap, fakePopup)

    // associate with a map, now open, should be the active one for that map
    popup.setMap(mockMap)
    popup.open()
    expect(activePopup.size).toEqual(1)
    expect(activePopup.get(mockMap)).toBe(popup)

    // and it tried to close the "fake" popup that was listed as active for the map
    expect(fakePopup.close).toHaveBeenCalled()

    // and we should have set up a listener on the map
    const mapClickListener = popup.mapClickListenerId // our mock for addListener did this trick
    expect(mapClickListener).toBeDefined()

    // and the OverlayView map should have been set to the map we specified
    expect(mockGoogleMaps.OverlayView.prototype.setMap).toHaveBeenLastCalledWith(mockMap)
    mockGoogleMaps.OverlayView.prototype.getMap.mockReturnValueOnce(mockMap) // simulate

    // calling the click listener should close the map and remove the clickListener
    mapClickListener()
    expect(activePopup.size).toEqual(0) // not active
    expect(mockGoogleMaps.event.removeListener).toHaveBeenLastCalledWith(mapClickListener) // listener removed
    // and stop drawing it
    expect(mockGoogleMaps.OverlayView.prototype.setMap).toHaveBeenLastCalledWith(null)
  })

  it('can draw()', () => {
    const popup = new Popup()

    // set some stuff
    const divPixel = { x: 3, y: 7 }
    const offset = { x: 6, y: 8 }
    const coords = { x: divPixel.x + offset.x, y: divPixel.y + offset.y }
    mockGoogleMaps.OverlayView.prototype.getProjection.mockReturnValue({
      fromLatLngToDivPixel: jest.fn(() => divPixel),
      fromLatLngToContainerPixel: jest.fn(() => 300),
      fromDivPixelToLatLng: jest.fn(x => x),
    })
    popup.setOffset(offset)
    popup.setPosition({ lat: 80, lng: 80 })
    popup.setMap(mockMap)

    popup.open() // make sure it thinks it's the first draw after an open
    popup.draw()
    expect(popup.containerDiv.style.left).toEqual(`${coords.x}px`)
    expect(popup.containerDiv.style.top).toEqual(`${coords.y}px`)
    expect(popup.containerDiv.style.display).toEqual('block')

    // since it's a first draw after open, it should have tiggered an event
    // to tell a listener what the world coordinates are for the center of the popup.
    // the popup is basically empty, so, we should have the sae stuff
    expect(mockGoogleMaps.event.trigger).toHaveBeenLastCalledWith(popup, popup.FIRST_DRAW_AFTER_OPEN_EVENT, coords)

    mockGoogleMaps.OverlayView.prototype.getProjection.mockClear()
  })

  it('can draw() inverted', () => {
    const popup = new Popup()
    popup.popupHeight = 300

    // set some stuff
    const divPixel = { x: 3, y: 7 }
    const offset = { x: 6, y: 8 }
    const coords = { x: divPixel.x + offset.x, y: divPixel.y + offset.y }
    mockGoogleMaps.OverlayView.prototype.getProjection.mockReturnValue({
      fromLatLngToDivPixel: jest.fn(() => divPixel),
      fromLatLngToContainerPixel: jest.fn(() => ({
        y: 10,
      })),
      fromDivPixelToLatLng: jest.fn(x => x),
    })
    popup.setOffset(offset)
    popup.setPosition([
      { lat: 80, lng: 80 },
      { lat: 50, lng: 80 },
    ])
    popup.setMap(mockMap)

    popup.open() // make sure it thinks it's the first draw after an open
    popup.draw()
    expect(popup.inverted).toEqual(true)
    expect(popup.containerDiv.style.left).toEqual(`${coords.x}px`)
    expect(popup.containerDiv.style.top).toEqual(`${coords.y}px`)
    expect(popup.containerDiv.style.display).toEqual('block')

    // since it's a first draw after open, it should have tiggered an event
    // to tell a listener what the world coordinates are for the center of the popup.
    // the popup is basically empty, so, we should have the sae stuff
    expect(mockGoogleMaps.event.trigger).toHaveBeenLastCalledWith(popup, popup.FIRST_DRAW_AFTER_OPEN_EVENT, coords)

    mockGoogleMaps.OverlayView.prototype.getProjection.mockClear()
  })
})
