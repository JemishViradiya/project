import React from 'react'

import { render, screen } from '@testing-library/react'

import { useTheme } from '@material-ui/core/styles'

import Colors from './Colors'
import PolygonZone from './PolygonZone'

jest.mock('../../../googleMaps/Polygon', () => ({ options }) => (
  <div data-testid="Polygon">
    <span data-testid="polygon.options.paths">{JSON.stringify(options.paths)}</span>
    <span data-testid="polygon.options.colors">
      {JSON.stringify({
        fillColor: options.fillColor,
        fillOpacity: options.fillOpacity,
        strokeColor: options.strokeColor,
        strokeWeight: options.strokeWeight,
        strokePosition: options.strokePosition,
      })}
    </span>
  </div>
))

const zoneDefaults = {
  risk: 'HIGH',
  geometry: {
    coordinates: [
      [45, 45],
      [50, 45],
      [50, 50],
      [45, 50],
    ],
  },
}

const defaultProps = {
  zoom: 10,
}

const createSut = props => render(<PolygonZone {...defaultProps} {...props} />)

describe('PolygonZone', () => {
  const theme = useTheme()
  it('should be rendered', () => {
    // given
    const props = {
      ...defaultProps,
      zone: zoneDefaults,
    }

    // when
    createSut(props)

    // then
    expect(screen.getByTestId('Polygon')).toBeTruthy()
  })

  it('should has passed path', () => {
    // given
    const props = {
      ...defaultProps,
      zone: zoneDefaults,
    }

    // when
    createSut(props)

    // then
    expect(screen.getByTestId('polygon.options.paths').textContent).toBe(
      JSON.stringify([
        { lat: 45, lng: 45 },
        { lat: 50, lng: 45 },
        { lat: 50, lng: 50 },
        { lat: 45, lng: 50 },
      ]),
    )
  })

  it.each(['HIGH', 'MEDIUM', 'LOW'])('should be rendered for %s risk zone', risk => {
    // given
    const props = {
      ...defaultProps,
      zone: {
        ...zoneDefaults,
        risk,
      },
    }

    // when
    createSut(props)

    // then
    expect(screen.getByTestId('polygon.options.colors').textContent).toBe(JSON.stringify(Colors.style(risk, theme)))
  })
})
