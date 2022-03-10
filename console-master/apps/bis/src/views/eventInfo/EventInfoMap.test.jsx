import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, cleanup, render } from '@testing-library/react'

import { mockHookComponent } from '../../../tests/utils'

jest.doMock('@ues-bis/standalone-shared', () => ({
  usePowerUp: () => false,
  f11n: {
    Context: React.createContext({
      privacyMode: { mode: true, maxZoom: 10 },
    }),
  },
}))

jest.mock('../../list/Geozones', () => props => <div data-testid="Geozones" {...props} />)
jest.mock('../../providers/GeozoneListProvider', () => ({ children }) => children)
jest.doMock('../../components/map/UserMapMarker', () => mockHookComponent('UserMapMarker'))

const data = {
  assessment: {
    behavioralRiskLevel: 'CRITICAL',
    datetime: 1552931718069,
    eEcoId: 'u26',
    geozoneRiskLevel: 'LOW',
    ipAddress: '141.131.189.178',
    location: { lat: 32.11726700136763, lon: 20.087804418106693, geohash: 'smwq9ng2xu88' },
    userInfo: {
      avatar: 'https://local.cc.altus.bblabs:5001/avatar/uifaces/faces/twitter/catarino/128.jpg',
      displayName: 'Alejandrin Balistreri',
      department: 'Device',
      givenName: 'Alejandrin',
      familyName: 'Balistreri',
      primaryEmail: 'alejandrin47@gmail.com',
      title: 'Lead Paradigm Architect',
    },
    mappings: {
      behavioral: {
        score: 96.45837405510201,
      },
    },
  },
}

const newData = {
  assessment: {
    behavioralRiskLevel: 'LOW',
    datetime: 1552931711490,
    eEcoId: 'u43',
    geozoneRiskLevel: 'MEDIUM',
    ipAddress: '44.239.129.93',
    location: { lat: 32.117836587118276, lon: 20.09148242522625, geohash: 'smwq9ny5vqxj' },
    userInfo: {
      avatar: 'https://local.cc.altus.bblabs:5001/avatar/uifaces/faces/twitter/maiklam/128.jpg',
      displayName: 'Karelle Littel',
      department: 'Hardware',
      givenName: 'Karelle',
      familyName: 'Littel',
      primaryEmail: 'karelle_littel@yahoo.com',
      title: 'Global Division Strategist',
    },
    mappings: {
      behavioral: {
        riskScore: 72,
      },
    },
  },
}

describe('EventInfoMap', () => {
  let EventInfoMap
  beforeAll(() => {
    jest.doMock('../../googleMaps/Map', () =>
      Object.assign(mockHookComponent('Map'), {
        f11n: {
          Context: React.createContext({
            map: {},
          }),
        },
      }),
    )
    EventInfoMap = require('./EventInfoMap').default
  })
  afterEach(cleanup)

  const props = {
    riskEvent: data,
    eventId: 'data',
  }
  test('it renders', async () => {
    const { getAllByTestId } = render(<EventInfoMap {...props} />)
    expect(getAllByTestId('Map').length).toBe(1)
    expect(getAllByTestId('Geozones').length).toBe(1)
    expect(getAllByTestId('UserMapMarker').length).toBe(1)
  })

  test('check map marker data', async () => {
    const wrapper = render(<EventInfoMap {...props} />)
    let userData = wrapper.getByTestId('UserMapMarker').prop('user')
    expect(userData.userId).toEqual(data.assessment.eEcoId)
    expect(userData.info).toEqual(data.assessment.userInfo)
    expect(userData.assessment).toEqual(data.assessment)

    // Render new event
    const nextProps = { ...props, riskEvent: newData, eventId: 'newData' }
    wrapper.rerender(<EventInfoMap {...nextProps} />)
    userData = wrapper.getByTestId('UserMapMarker').prop('user')
    expect(userData.userId).toEqual(newData.assessment.eEcoId)
    expect(userData.info).toEqual(newData.assessment.userInfo)
    expect(userData.assessment).toEqual(newData.assessment)
  })

  test('viewport changes', async () => {
    const wrapper = render(<EventInfoMap {...props} />)

    // Check initial viewport.
    const viewport = {
      center: { lat: data.assessment.location.lat, lng: data.assessment.location.lon },
      zoom: 18,
    }
    let mapWrapper = wrapper.getByTestId('Map')
    expect(mapWrapper).not.toBeNull()
    expect(mapWrapper.prop('viewport')).toEqual(viewport)

    // User changed viewport.
    viewport.zoom = 8
    act(() => {
      mapWrapper.prop('onViewportChanged')(viewport)
    })
    mapWrapper = wrapper.getByTestId('Map')
    expect(mapWrapper).not.toBeNull()
    expect(mapWrapper.prop('viewport')).not.toEqual(viewport)

    // Render new event.
    viewport.center = { lat: newData.assessment.location.lat, lng: newData.assessment.location.lon }
    const nextProps = { riskEvent: newData, eventId: 'newData' }
    wrapper.rerender(<EventInfoMap {...nextProps} />)
    mapWrapper = wrapper.getByTestId('Map')
    expect(mapWrapper).not.toBeNull()
    expect(mapWrapper.prop('viewport')).toEqual(viewport)
  })
})
