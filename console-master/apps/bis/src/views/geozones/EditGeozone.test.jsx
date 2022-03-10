import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { ApolloProvider } from '@apollo/client'
import { act, cleanup, fireEvent, render } from '@testing-library/react'

import { mockComponent } from '../../../tests/utils'
import Map from '../../googleMaps/Map' // for the Provider

const defaultProps = {
  id: 'abc',
  setPosition: jest.fn(),
  position: {
    lat: () => 45,
    lng: () => -45,
  },
  invertedPosition: {
    lat: () => 45,
    lng: () => -45,
  },
  onDone: jest.fn(),
  shape: {
    setEditable: jest.fn(),
    setDraggable: jest.fn(),
    addListener: jest.fn(),
  },
}

const INPUTS_IDS = {
  NAME: 'geozone-mutator-popup-geozone-name-input',
  RISK_LEVEL: 'geozone-mutator-popup-risk-level-input',
  RADIUS: 'geozone-mutator-popup-radius-input',
  RADIUS_UNIT: 'geozone-mutator-popup-radius-unit-input',
}

const requireEditGeozone = () => {
  return require('./EditGeozone').default
}

const mockPopup = options => {
  jest.doMock('../../googleMaps/Popup', () => mockComponent('popup', options))
}

const apolloClient = {}
const google = {}
const map = {}

const wrapper = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <Map.Provider value={{ google, map }}>{children}</Map.Provider>
    </ApolloProvider>
  )
}

describe('EditGeozone', () => {
  afterEach(() => {
    cleanup()
  })

  test('renders basic structure', () => {
    expect.assertions(4)
    mockPopup({
      fields: [
        {
          name: 'stayOpen',
          verifier: stayOpen => expect(stayOpen).toEqual(true),
        },
      ],
    })
    const EditGeozone = requireEditGeozone()
    const props = defaultProps
    const { getByTitle, getByTestId, queryByTestId, queryAllByRole } = render(<EditGeozone {...props} />, { wrapper })

    expect(getByTitle('Close')).not.toBeNull()
    expect(getByTestId(INPUTS_IDS.NAME)).not.toBeNull()
    expect(getByTestId(INPUTS_IDS.RISK_LEVEL)).not.toBeNull()
    expect(queryByTestId(INPUTS_IDS.RADIUS)).toBeNull()
  })

  test('renders radius input', () => {
    expect.assertions(4)
    mockPopup({
      fields: [
        {
          name: 'stayOpen',
          verifier: stayOpen => expect(stayOpen).toEqual(true),
        },
      ],
    })
    const EditGeozone = requireEditGeozone()
    const props = {
      ...defaultProps,
      showRadius: true,
      shape: {
        ...defaultProps.shape,
        getRadius: () => 100,
      },
    }
    const { getByTitle, getByTestId, queryAllByRole } = render(<EditGeozone {...props} />, { wrapper })

    expect(getByTitle('Close')).not.toBeNull()
    expect(getByTestId(INPUTS_IDS.NAME)).not.toBeNull()
    expect(getByTestId(INPUTS_IDS.RISK_LEVEL)).not.toBeNull()
    expect(getByTestId(INPUTS_IDS.RADIUS)).not.toBeNull()
  })

  test('cleans up on close', () => {
    mockPopup({
      fields: [
        {
          name: 'stayOpen',
          verifier: stayOpen => expect(stayOpen).toEqual(true),
        },
      ],
    })
    const EditGeozone = requireEditGeozone()
    const props = {
      ...defaultProps,
      showRadius: true,
      shape: {
        ...defaultProps.shape,
        getRadius: () => 100,
        setMap: jest.fn(),
      },
    }
    const { getByTitle } = render(<EditGeozone {...props} />, { wrapper })

    act(() => {
      fireEvent.click(getByTitle('Close'))
    })

    expect(props.shape.setMap).toBeCalledWith(null)
    expect(props.onDone).toBeCalled()
  })
})
