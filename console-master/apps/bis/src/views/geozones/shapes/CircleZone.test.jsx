import React from 'react'

import { render, screen } from '@testing-library/react'

import { useTheme } from '@material-ui/core/styles'

import CircleZone from './CircleZone'
import Colors from './Colors'

jest.mock('../../../googleMaps/Circle', () => ({ options, strokeOutside }) => (
  <div data-testid="Circle">
    <span data-testid="circle.options.center">{JSON.stringify(options.center)}</span>
    <span data-testid="circle.options.radius">{options.radius}</span>
    <span data-testid="circle.options.colors">
      {JSON.stringify({
        fillColor: options.fillColor,
        fillOpacity: options.fillOpacity,
        strokeColor: options.strokeColor,
        strokeWeight: options.strokeWeight,
        strokePosition: options.strokePosition,
      })}
    </span>
    <span data-testid="strokeOutside">{strokeOutside}</span>
  </div>
))

jest.mock('../GeozonePopup', () => ({ zone }) => <div data-testid="GeozonePopup">{JSON.stringify(zone)}</div>)

jest.mock('../../../googleMaps/Marker', () => ({ position, zIndexOffset }) => (
  <div data-testid="Marker">
    <span data-testid="marker.zIndexOffset">{JSON.stringify(zIndexOffset)}</span>
    <span data-testid="marker.position">{JSON.stringify(position)}</span>
  </div>
))

const defaultProps = {
  zoom: 543245676543,
  zone: {
    id: 'ID',
    name: 'NAME',
    location: 'LOCATION',
    risk: 'HIGH',
    geometry: {
      radius: 623417238716,
      center: {
        lat: 654358762365,
        lon: -7641325414236,
      },
    },
  },
}

const createSut = props => render(<CircleZone {...defaultProps} {...props} />)

describe('CircleZone', () => {
  const theme = useTheme()
  it('should be rendered', () => {
    // when
    createSut()

    // then
    expect(screen.getByTestId('Circle')).toBeTruthy()
  })

  it('should has passed props', () => {
    // when
    createSut()

    // then
    expect(screen.getByTestId('circle.options.center').textContent).toBe(
      JSON.stringify({
        lat: 654358762365,
        lng: -7641325414236,
      }),
    )
    expect(screen.getByTestId('circle.options.radius').textContent).toBe('623417238716')
    expect(screen.getByTestId('circle.options.colors').textContent).toBe(JSON.stringify(Colors.style('HIGH', theme)))
  })

  it('should be rendered highlighted', () => {
    // given
    const props = {
      ...defaultProps,
      highlighted: true,
    }

    // when
    createSut(props)

    // then
    const circlesColor = screen.getAllByTestId('circle.options.colors')
    expect(circlesColor[0].textContent).toBe(JSON.stringify(Colors.hoverStyle(theme)))
    expect(circlesColor[1].textContent).toBe(JSON.stringify(Colors.style('HIGH', theme)))
  })

  it('should be rendered with popup', () => {
    // given
    const props = {
      ...defaultProps,
      showPopup: true,
    }

    // when
    createSut(props)

    // then
    expect(screen.getByTestId('Circle')).toBeTruthy()
    expect(screen.getByTestId('GeozonePopup').textContent).toBe(JSON.stringify(props.zone))
  })

  describe('Marker', () => {
    const zoomedOutPropsConfig = {
      zone: {
        ...defaultProps.zone,
        geometry: {
          radius: 1,
          center: {
            lat: 1,
            lon: -1,
          },
        },
      },
      zoom: 1,
    }

    it('should be rendered when zoomed out', () => {
      // given
      const props = {
        ...defaultProps,
        ...zoomedOutPropsConfig,
      }

      // when
      createSut(props)

      // then
      expect(screen.getByTestId('Marker')).toBeTruthy()
    })

    it('should has passed required props', () => {
      // given
      const props = {
        ...defaultProps,
        ...zoomedOutPropsConfig,
      }

      // when
      createSut(props)

      // then
      expect(screen.getByTestId('marker.zIndexOffset').textContent).toBe('10')
      expect(screen.getByTestId('marker.position').textContent).toBe(JSON.stringify({ lat: 1, lng: -1 }))
    })

    it('should be rendered when highlighted', () => {
      // given
      const props = {
        ...defaultProps,
        ...zoomedOutPropsConfig,
        highlighted: true,
      }

      // when
      createSut(props)

      // then
      expect(screen.getByTestId('Marker')).toBeTruthy()
    })

    it('should has bigger z-index when highlighted', () => {
      // given
      const props = {
        ...defaultProps,
        ...zoomedOutPropsConfig,
        highlighted: true,
      }

      // when
      createSut(props)

      // then
      expect(screen.getByTestId('marker.zIndexOffset').textContent).toBe('30')
    })

    it('should be rendered with popup', () => {
      // given
      const props = {
        ...defaultProps,
        ...zoomedOutPropsConfig,
        showPopup: true,
      }

      // when
      createSut(props)

      // then
      expect(screen.getByTestId('Marker')).toBeTruthy()
      expect(screen.getByTestId('GeozonePopup')).toBeTruthy()
    })
  })
})
