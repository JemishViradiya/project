import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import { MemoryRouter } from 'react-router'
import { useNavigate } from 'react-router-dom'

import { cleanup, fireEvent, render } from '@testing-library/react'

import MarkerMock from '../../googleMaps/Marker'
import DefaultEventMapMarker from './EventMapMarker'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn().mockReturnValue(jest.fn()),
}))

jest.mock('../../googleMaps/Marker', () => jest.fn())

const DEFAULT_PROPS = {
  tenant: 'TENANT',
  event: {
    lat: -33.87054868784895,
    lon: 151.20875000307086,
    representative: {
      eEcoId: 'u51',
      riskLevel: 'HIGH',
      id: 'EVENT_ID',
    },
  },
}

const createSut = props => {
  return render(
    <MemoryRouter>
      <DefaultEventMapMarker {...DEFAULT_PROPS} {...props} />
    </MemoryRouter>,
  )
}

describe('EventMapMarker', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render and pass proper parameters', () => {
    // given
    MarkerMock.mockImplementation(({ zIndexOffset, icon, position, riseOnHover, onHover }) => (
      <>
        <div data-testid="position">{JSON.stringify(position)}</div>
        <div data-testid="zIndexOffset">{zIndexOffset}</div>
        <div data-testid="iconKey">{icon.key}</div>
        <div data-testid="riseOnHover">{JSON.stringify(riseOnHover)}</div>
        <div data-testid="onHover">{onHover()}</div>
      </>
    ))
    const props = {
      onHover: () => 'ON_HOVER',
    }

    // when
    const sut = createSut(props)

    // then
    expect(sut.getByTestId('position')).toHaveTextContent('{"lat":-33.87054868784895,"lng":151.20875000307086}')
    expect(sut.getByTestId('zIndexOffset')).toHaveTextContent('10')
    expect(sut.getByTestId('iconKey')).toHaveTextContent('HIGH-default')
    expect(sut.getByTestId('riseOnHover')).toHaveTextContent('true')
    expect(sut.getByTestId('onHover')).toHaveTextContent('ON_HOVER')
  })

  it('should call history when is clicked', () => {
    // given
    MarkerMock.mockImplementation(({ onClick }) => <button onClick={onClick} />)
    const pushMock = jest.fn()
    // const props = { history: { push: pushMock } }
    useNavigate.mockReturnValue(pushMock)
    const sut = createSut()

    // when
    fireEvent.click(sut.container.firstChild)

    // then
    expect(pushMock).toHaveBeenCalledWith('/events/EVENT_ID', { state: { goBack: true } })
  })
})
