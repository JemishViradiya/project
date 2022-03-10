import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { cleanup, render } from '@testing-library/react'

import Map from './Map' // for the Provider
import Polygon from './Polygon'

const defaultProps = {
  options: {
    paths: [
      { lat: 15, lng: 15 },
      { lat: 10, lng: 15 },
      { lat: 10, lng: 10 },
    ],
  },
}

const polygonApi = {
  setOptions: jest.fn(),
  setMap: jest.fn(),
  addListener: jest.fn().mockImplementation(() => polygonApi.addListener.mock.calls.length.toString()),
}

const google = {
  maps: {
    StrokePosition: {
      OUTSIDE: 'outside',
      CENTER: 'center',
    },
    Polygon: jest.fn().mockImplementation(() => polygonApi),
    event: {
      removeListener: jest.fn(),
    },
  },
}
const map = {}

const wrapper = ({ children }) => {
  return <Map.Provider value={{ google, map }}>{children}</Map.Provider>
}

describe('Polygon', () => {
  afterEach(() => {
    cleanup()
  })

  test('normal circle with hover', () => {
    const props = {
      ...defaultProps,
      onHoverStart: jest.fn(),
      onHoverEnd: jest.fn(),
    }
    const { unmount } = render(<Polygon {...props} />, { wrapper })
    expect(google.maps.Polygon).toBeCalledWith(
      expect.objectContaining({
        ...defaultProps.options,
        strokePosition: google.maps.StrokePosition.CENTER,
        map,
      }),
    )
    expect(polygonApi.setMap).not.toBeCalled()
    expect(polygonApi.addListener).toBeCalledTimes(2)
    unmount()
    expect(google.maps.event.removeListener).toBeCalledTimes(2)
  })

  test('with stroke outside', () => {
    const props = {
      ...defaultProps,
      options: {
        ...defaultProps.options,
        radius: 12,
      },
      strokeOutside: true,
    }
    const { unmount } = render(<Polygon {...props} />, { wrapper })

    expect(google.maps.Polygon).toBeCalledWith(
      expect.objectContaining({
        ...props.options,
        strokePosition: google.maps.StrokePosition.OUTSIDE,
        map,
      }),
    )
    expect(polygonApi.setMap).not.toBeCalled()
    unmount()
  })

  test('no crash if map not ready yet', () => {
    const { unmount } = render(
      <Map.Provider value={{ google: undefined, map: undefined }}>
        <Polygon {...defaultProps} />
      </Map.Provider>,
    )
    unmount()
  })

  test('rerender', () => {
    const { rerender, unmount } = render(
      <Map.Provider value={{ google, map }}>
        <Polygon {...defaultProps} />
      </Map.Provider>,
    )

    expect(google.maps.Polygon).toBeCalledWith(
      expect.objectContaining({
        ...defaultProps.options,
        map,
      }),
    )
    expect(polygonApi.setMap).not.toBeCalled()

    google.maps.Polygon.mockClear()

    rerender(
      <Map.Provider value={{ google, map: 'another map' }}>
        <Polygon {...defaultProps} />
      </Map.Provider>,
    )

    expect(google.maps.Polygon).not.toBeCalled()
    expect(polygonApi.setOptions).toBeCalledWith(expect.objectContaining(defaultProps.options))
    expect(polygonApi.setMap).toBeCalledWith('another map')

    unmount()
  })
})
