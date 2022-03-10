import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { cleanup, render } from '@testing-library/react'

import Circle from './Circle'
import Map from './Map' // for the Provider

const defaultProps = {
  options: {
    radius: 10,
    center: { lat: 15, lng: 15 },
  },
}

const circleApi = {
  setOptions: jest.fn(),
  setMap: jest.fn(),
  addListener: jest.fn().mockImplementation(() => circleApi.addListener.mock.calls.length.toString()),
}

const google = {
  maps: {
    StrokePosition: {
      OUTSIDE: 'outside',
      CENTER: 'center',
    },
    Circle: jest.fn().mockImplementation(() => circleApi),
    event: {
      removeListener: jest.fn(),
    },
  },
}
const map = {}

const wrapper = ({ children }) => {
  return <Map.Provider value={{ google, map }}>{children}</Map.Provider>
}

describe('Circle', () => {
  afterEach(() => {
    cleanup()
  })

  test('normal circle with hover', () => {
    const props = {
      ...defaultProps,
      onHoverStart: jest.fn(),
      onHoverEnd: jest.fn(),
    }
    const { unmount } = render(<Circle {...props} />, { wrapper })
    expect(google.maps.Circle).toBeCalledWith(
      expect.objectContaining({
        ...defaultProps.options,
        strokePosition: google.maps.StrokePosition.CENTER,
        map,
      }),
    )
    expect(circleApi.setMap).not.toBeCalled()
    expect(circleApi.addListener).toBeCalledWith('mouseover', props.onHoverStart)
    expect(circleApi.addListener).toBeCalledWith('mouseout', props.onHoverEnd)
    unmount()
    expect(google.maps.event.removeListener).toBeCalledTimes(2)
  })

  test('normal circle with only hover start', () => {
    const props = {
      ...defaultProps,
      onHoverStart: jest.fn(),
    }
    const { unmount } = render(<Circle {...props} />, { wrapper })
    expect(google.maps.Circle).toBeCalledWith(
      expect.objectContaining({
        ...defaultProps.options,
        strokePosition: google.maps.StrokePosition.CENTER,
        map,
      }),
    )
    expect(circleApi.setMap).not.toBeCalled()
    expect(circleApi.addListener).toBeCalledWith('mouseover', props.onHoverStart)
    unmount()
    expect(google.maps.event.removeListener).toBeCalledTimes(1)
  })

  test('normal circle with only hover end', () => {
    const props = {
      ...defaultProps,
      onHoverEnd: jest.fn(),
    }
    const { unmount } = render(<Circle {...props} />, { wrapper })
    expect(google.maps.Circle).toBeCalledWith(
      expect.objectContaining({
        ...defaultProps.options,
        strokePosition: google.maps.StrokePosition.CENTER,
        map,
      }),
    )
    expect(circleApi.setMap).not.toBeCalled()
    expect(circleApi.addListener).toBeCalledWith('mouseout', props.onHoverEnd)
    unmount()
    expect(google.maps.event.removeListener).toBeCalledTimes(1)
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
    const { unmount } = render(<Circle {...props} />, { wrapper })

    expect(google.maps.Circle).toBeCalledWith(
      expect.objectContaining({
        ...props.options,
        strokePosition: google.maps.StrokePosition.OUTSIDE,
        map,
      }),
    )
    expect(circleApi.setMap).not.toBeCalled()
    unmount()
  })

  test('no crash if map not ready yet', () => {
    const { unmount } = render(
      <Map.Provider value={{ google: undefined, map: undefined }}>
        <Circle {...defaultProps} />
      </Map.Provider>,
    )
    unmount()
  })

  test('rerender', () => {
    const { rerender, unmount } = render(
      <Map.Provider value={{ google, map }}>
        <Circle {...defaultProps} />
      </Map.Provider>,
    )

    expect(google.maps.Circle).toBeCalledWith(
      expect.objectContaining({
        ...defaultProps.options,
        map,
      }),
    )
    expect(circleApi.setMap).not.toBeCalled()

    google.maps.Circle.mockClear()

    rerender(
      <Map.Provider value={{ google, map: 'another map' }}>
        <Circle {...defaultProps} />
      </Map.Provider>,
    )

    expect(google.maps.Circle).not.toBeCalled()
    expect(circleApi.setOptions).toBeCalledWith(expect.objectContaining(defaultProps.options))
    expect(circleApi.setMap).toBeCalledWith('another map')

    unmount()
  })
})
