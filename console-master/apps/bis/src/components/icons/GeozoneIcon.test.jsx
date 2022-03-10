import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { cleanup, render } from '@testing-library/react'

import GeozoneIcon from './GeozoneIcon'

// TODO: unskip this once topic/bisportal-persona-theme is merged
describe.skip('Geozone icon', () => {
  afterEach(cleanup)

  test('renders circles', () => {
    const props = {
      zone: {
        geometry: {
          type: 'Circle',
        },
        risk: 'LOW',
      },
      size: 'normal',
    }

    const { container } = render(<GeozoneIcon {...props} />)
    expect(container.querySelector('svg')).toHaveTextContent('basic-geozoneRadius.svg')
    expect(container.querySelector('svg')).toHaveStyle('font-size: 0.875rem; color: #75a808;')
  })

  test('renders polygons', () => {
    const props = {
      zone: {
        geometry: {
          type: 'Polygon',
        },
        risk: 'MEDIUM',
      },
    }

    const { container } = render(<GeozoneIcon {...props} />)
    expect(container.querySelector('svg')).toHaveTextContent('basic-geozoneShape.svg')
    expect(container.querySelector('svg')).toHaveStyle('font-size: 1.125rem; color: #fdc841;')
  })

  test('renders circles with high risk', () => {
    const props = {
      zone: {
        geometry: {
          type: 'Circle',
        },
        risk: 'HIGH',
      },
    }

    const { container } = render(<GeozoneIcon {...props} />)
    expect(container.querySelector('svg')).toHaveTextContent('basic-geozoneRadius.svg')
    expect(container.querySelector('svg')).toHaveStyle('font-size: 1.125rem; color: #d52c16;')
  })
})
