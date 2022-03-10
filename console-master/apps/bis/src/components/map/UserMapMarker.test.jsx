import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { cleanup, render } from '@testing-library/react'

import MarkerMock from '../../googleMaps/Marker'
import PopupMock from '../../googleMaps/Popup'
import UserMapMarker from './UserMapMarker'
import UserMapPopupMock from './UserMapPopup'

jest.mock('../../googleMaps/Marker', () => jest.fn())
jest.mock('../../googleMaps/Popup', () => jest.fn())
jest.mock('./UserMapPopup', () => jest.fn())

const TestUserInfo = {
  avatar: 'https://local.cc.altus.bblabs:5001/avatar/uifaces/faces/twitter/jodytaggart/128.jpg',
  displayName: 'Sanford Stroman',
  department: 'Software',
  givenName: 'Sanford',
  familyName: 'Stroman',
  primaryEmail: 'sanford.stroman@hotmail.com',
  title: 'Human Communications Specialist',
}

const TestUser = {
  info: TestUserInfo,
  assessment: {
    eEcoId: 'u51',
    riskLevel: 'HIGH',
    locationRiskLevel: 'MEDIUM',
    datetime: 1542744900000,
    ipAddress: '33.40.172.20',
    location: {
      geohash: 'r3gx2f4cg0pg',
      lat: -33.87054868784895,
      lon: 151.20875000307086,
    },
  },
}

const createSut = props => {
  return render(<UserMapMarker {...props} />)
}

describe('UserMapMarker', () => {
  beforeAll(() => {
    jest.doMock('../hooks/useClientParams', () => () => ({
      privacyMode: { mode: true },
    }))
  })

  afterEach(() => {
    cleanup()
  })

  it('check full DOM rendering', () => {
    // given
    UserMapPopupMock.mockImplementation(() => <div>USER_MAP_POPUP</div>)
    PopupMock.mockImplementation(({ offset, risk, children }) => <div data-testid="popup">{children}</div>)
    MarkerMock.mockImplementation(({ zIndexOffset, icon, position, riseOnHover, children }) => (
      <>
        <div data-testid="position">{JSON.stringify(position)}</div>
        <div data-testid="zIndexOffset">{zIndexOffset}</div>
        <div data-testid="riseOnHover">{JSON.stringify(riseOnHover)}</div>
        {children}
      </>
    ))
    const props = {
      user: TestUser,
      size: 'large',
    }

    // when
    const sut = createSut(props)

    // then
    expect(sut.getByTestId('position')).toHaveTextContent('{"lat":-33.87054868784895,"lng":151.20875000307086}')
    expect(sut.getByTestId('riseOnHover')).toHaveTextContent('true')
    expect(sut.getByTestId('popup')).toBeTruthy()
    expect(sut.getAllByTestId('popup')).toBeTruthy()
  })

  it('test special size and selected properties', () => {
    // given
    UserMapPopupMock.mockImplementation(() => <div data-testid="userMapPopup" />)
    PopupMock.mockImplementation(({ children }) => <div>{children}</div>)
    MarkerMock.mockImplementation(({ zIndexOffset, children }) => (
      <>
        <div data-testid="zIndexOffset">{zIndexOffset}</div>
        {children}
      </>
    ))
    const props = {
      user: TestUser,
      size: 'large',
      selected: true,
    }

    // when
    const sut = createSut(props)

    // then
    expect(parseInt(sut.getByTestId('zIndexOffset').textContent, 10)).toBeGreaterThan(0)
    expect(sut.getByTestId('userMapPopup')).toBeTruthy()
  })
})
