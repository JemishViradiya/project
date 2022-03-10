import React from 'react'

import { cleanup, render } from '@testing-library/react'

import Loading from './Loading'

describe('Loading', () => {
  afterEach(cleanup)

  it('should render okay', () => {
    // it's a div containing an svg that draws something
    const { getByLabelText, container } = render(<Loading />)
    expect(getByLabelText('Loading').nodeName.toLowerCase()).toBe('div')

    const svg = container.querySelector('svg')
    expect(svg.nodeName).toBe('svg')
  })
})
