import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { render } from '@testing-library/react'

import Markers from './Markers'

jest.mock('./Marker', () => ({ position, title }) => (
  <div>
    <div data-testid="position">{JSON.stringify(position)}</div>
    <div data-testid="title">{title}</div>
  </div>
))

describe('Markers', () => {
  it('no clusters, no nothing', () => {
    const markers = render(<Markers clusters={[]} />)
    expect(markers.queryAllByTestId('title')).toHaveLength(0)
    expect(markers.queryAllByTestId('position')).toHaveLength(0)
  })

  it('2 clusters, 2 markers', () => {
    const clusters = [
      { count: 1, lat: 2, lon: 3, geohash: 'Toronto' },
      { count: 1000, lat: 4, lon: 5, geohash: 'Ottawa' },
    ]
    const markers = render(<Markers clusters={clusters} />)
    expect(markers.getAllByTestId('title')).toHaveLength(2)
    expect(markers.getAllByTestId('position')).toHaveLength(2)

    const single = markers.getAllByTestId('position')[0]
    expect(single).toHaveTextContent('{"lat":2,"lng":3}')
    const singleTitle = markers.getAllByTestId('title')[0]
    expect(singleTitle.textContent.startsWith('Toronto')).toBe(true)
    expect(singleTitle.textContent.endsWith('Single')).toBe(true)

    const cluster = markers.getAllByTestId('position')[1]
    expect(cluster).toHaveTextContent('{"lat":4,"lng":5}')
    const clusterTitle = markers.getAllByTestId('title')[1]
    expect(clusterTitle.textContent.startsWith('Ottawa')).toBe(true)
    expect(clusterTitle.textContent.endsWith('Cluster of 1000')).toBe(true)
  })
})
