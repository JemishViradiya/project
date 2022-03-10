import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, fireEvent, render } from '@testing-library/react'

import { useMapContext } from './Map' // for the Provider
import { default as SearchInput } from './SearchInput'

jest.mock('./Map', () => ({
  useMapContext: jest.fn().mockReturnValue({}),
}))

describe('SearchInput, using mocked google api', () => {
  let mockGoogle = {}
  let mockMap = {}
  const autoCompleteEventEmitterMock = {}

  let getPlaceMock = jest
    .fn(() => ({
      geometry: {},
    }))
    .mockName('getPlace (mock)')
  const setCenterMock = jest.fn().mockName('setCenter (mock)')
  const setZoomMock = jest.fn().mockName('setZoom (mock)')
  const fitBoundsMock = jest.fn().mockName('fitBounds (mock)')
  const bindToMock = jest.fn().mockName('bindTo (mock)')
  const setFieldsMock = jest.fn().mockName('setFields (mock)')

  const addEventListenerMock = (event, callback) => {
    autoCompleteEventEmitterMock[event] = callback
  }

  beforeEach(() => {
    const mockAutocompleteApi = jest.fn(() => ({
      addListener: addEventListenerMock,
      setMap: jest.fn().mockName('setMap (mock)'),
      setOptions: jest.fn().mockName('setOptions (mock)'),
      bindTo: bindToMock,
      setFields: setFieldsMock,
      getPlace: getPlaceMock,
    }))

    const mockMapApi = jest.fn(() => ({
      addListener: jest.fn((_, f) => f).mockName('addListener (mock)'),
      setCenter: setCenterMock,
      setZoom: setZoomMock,
      fitBounds: fitBoundsMock,
    }))

    mockGoogle.maps = {
      Map: mockMapApi,
      places: {
        Autocomplete: mockAutocompleteApi,
      },
      event: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
    }

    mockMap = new mockGoogle.maps.Map()
    useMapContext.mockReturnValue({ map: mockMap, google: mockGoogle })
  })

  afterEach(() => {
    mockGoogle = {}
    mockMap = {}
  })

  it('can create normal one', () => {
    const searchInput = render(<SearchInput google={mockGoogle} map={mockMap} />)
    expect(searchInput.getByPlaceholderText('Add a geozone')).toBeTruthy()
    expect(searchInput.getByRole('img')).toBeTruthy()
  })

  const googleSearchInputHasLoaded = wrapper =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 100)
    })

  it('clicking Icon triggers selectInput (mostly for code coverage)', async () => {
    const searchInput = render(<SearchInput />)
    await googleSearchInputHasLoaded(searchInput)

    await act(async () => {
      fireEvent.click(searchInput.getByRole('img'))
    })
    // at this point the element should be selected and have focus
    expect(document.hasFocus()).toBe(true)
  })

  it('does not changing map viewpoint if place_changed is not tirggered', async () => {
    const searchInput = render(<SearchInput google={mockGoogle} map={mockMap} />)
    await googleSearchInputHasLoaded(searchInput)

    expect(fitBoundsMock).not.toHaveBeenCalled()
    expect(setCenterMock).not.toHaveBeenCalled()
    expect(setZoomMock).not.toHaveBeenCalled()
  })

  it('place_changed event does not trigger changing map viewpoint if geometry not exist', async () => {
    getPlaceMock = jest.fn(() => ({
      geometry: undefined,
    }))
    mockGoogle = new mockGoogle.maps.Map()

    const searchInput = render(<SearchInput google={mockGoogle} map={mockMap} />)
    await googleSearchInputHasLoaded(searchInput)

    autoCompleteEventEmitterMock.place_changed()

    expect(bindToMock).toHaveBeenCalledWith('bounds', mockMap)
    expect(setFieldsMock).toHaveBeenCalledWith(['geometry', 'name'])
    expect(fitBoundsMock).not.toHaveBeenCalled()
    expect(setCenterMock).not.toHaveBeenCalled()
    expect(setZoomMock).not.toHaveBeenCalled()
  })

  it('place_changed event trigger fitBounds fn if viewport of gemoetry exists', async () => {
    const onSelectMock = jest.fn()
    getPlaceMock = jest.fn(() => ({
      geometry: {
        viewport: 'viewport',
        location: 'location',
      },
    }))
    mockGoogle = new mockGoogle.maps.Map()

    const searchInput = render(<SearchInput google={mockGoogle} map={mockMap} onSelect={onSelectMock} />)
    await googleSearchInputHasLoaded(searchInput)

    autoCompleteEventEmitterMock.place_changed()

    expect(bindToMock).toHaveBeenCalledWith('bounds', mockMap)
    expect(setFieldsMock).toHaveBeenCalledWith(['geometry', 'name'])
    expect(fitBoundsMock).toHaveBeenCalledWith('viewport')
    expect(setCenterMock).not.toHaveBeenCalled()
    expect(setZoomMock).toHaveBeenCalledWith(17)
    expect(onSelectMock).toHaveBeenCalledWith({ location: 'location', name: undefined })
  })

  it('place_changed event trigger setCenter fn if viewport of gemoetry does not exist', async () => {
    const onSelectMock = jest.fn()
    getPlaceMock = jest.fn(() => ({
      geometry: {
        viewport: undefined,
        location: 'location',
      },
    }))
    mockGoogle = new mockGoogle.maps.Map()

    const searchInput = render(<SearchInput google={mockGoogle} map={mockMap} onSelect={onSelectMock} />)
    await googleSearchInputHasLoaded(searchInput)

    autoCompleteEventEmitterMock.place_changed()

    expect(bindToMock).toHaveBeenCalledWith('bounds', mockMap)
    expect(setFieldsMock).toHaveBeenCalledWith(['geometry', 'name'])
    expect(fitBoundsMock).not.toHaveBeenCalled()
    expect(setCenterMock).toHaveBeenCalledWith('location')
    expect(setZoomMock).toHaveBeenCalledWith(17)
    expect(onSelectMock).toHaveBeenCalledWith({ location: 'location', name: undefined })
  })
})
