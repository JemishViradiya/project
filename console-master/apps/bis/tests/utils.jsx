import PropTypes from 'prop-types'
import React, { PureComponent, useEffect, useRef } from 'react'
import { act } from 'react-dom/test-utils'

import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, within } from '@testing-library/react'

import { createCache } from '../src/common/apollo'

// create a renderData function that calls the onLoading, onError and onData functions
// as appropriate.  Doesn't bother really creating any React component.
export const renderDataHelper = (onLoading, onError, onData) => ({ loading, error, data }) => {
  if (loading) {
    onLoading && onLoading()
  } else if (error) {
    onError && onError(error)
  } else {
    onData && onData(data)
  }
  return null
}

// create a simple mock react component, which only renders its child components.
export const createMockComponent = name => {
  class MockComponent extends PureComponent {
    render() {
      return <div>{this.props.children}</div>
    }
  }
  MockComponent.propTypes = {
    children: PropTypes.node,
  }
  MockComponent.displayName = name
  return MockComponent
}

// create a customized mock component for testing with @testing-library/react.
export const mockComponent = (name, { fields = [], objects = [], callbacks = [], render = x => x, refetch } = {}) => {
  return class extends PureComponent {
    render() {
      const { children, ...others } = this.props

      // To avoid warnings for attributes that are not lowercase,
      // just remove all boolean or non-lowercase attributes.
      // We can check fields with the field map.
      const safeOthers = {}
      Object.keys(others).forEach(key => {
        if (key === key.toLowerCase() && typeof others[key] !== 'boolean') {
          safeOthers[key] = others[key]
        }
      })
      others.refetch = props => refetch(props, cb => this.forceUpdate(cb))

      return (
        <div data-testid={name} {...safeOthers}>
          {fields.map(field => {
            if (field.verifier) {
              field.verifier(this.props[field.name])
              return null
            } else {
              return (
                <div key={`field-${field}`} data-testid={field}>
                  {`${this.props[field]}`}
                </div>
              )
            }
          })}
          {objects.map(obj => (
            <div key={`object-${obj}`} data-testid={obj}>
              {JSON.stringify(this.props[obj])}
            </div>
          ))}
          {callbacks.map(callback => (
            <button
              key={`callback-${callback.name}`}
              data-testid={callback.name}
              onClick={() => this.props[callback.name].apply(null, callback.args)}
            />
          ))}
          {render(children, others)}
        </div>
      )
    }
  }
}

export const mockHookComponent = testid => props => {
  const ref = useRef()
  useEffect(() => {
    ref.current.props = props
    ref.current.prop = prop => props[prop]
  }, [props])
  return (
    <div ref={ref} data-testid={testid}>
      {props.children}
    </div>
  )
}

export const mockGoogleApi = () => {
  const mockGoogle = {}

  const mockMarkerApi = jest.fn(() => ({
    addListener: jest.fn((_, f) => f), // for convenience, we just return the function we got
    setMap: jest.fn().mockName('setMap (mock)'),
    setIcon: jest.fn().mockName('setIcon (mock)'),
    setTitle: jest.fn().mockName('setTitle (mock)'),
    setPosition: jest.fn().mockName('setPosition (mock)'),
    setZIndex: jest.fn().mockName('setZIndex (mock)'),
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
  return mockGoogle
}

// ideally should have the same settings as the non-mocked cache
export const mockCache = () => createCache()

export const MockedApolloProvider = ({ children, cache = mockCache(), mocks, resolvers }) => (
  <MockedProvider cache={cache} mocks={mocks} resolvers={resolvers} addTypename={false}>
    {children}
  </MockedProvider>
)

export const getSelectOptions = async element => {
  const selectButton = element.parentNode.querySelector('[role=button]')
  act(() => {
    fireEvent.mouseDown(selectButton)
  })
  return within(document.body).findByRole('listbox')
}
