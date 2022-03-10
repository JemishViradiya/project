import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { cleanup, render } from '@testing-library/react'

import Avatar from './Avatar'

describe('Avatar', () => {
  afterEach(cleanup)

  it('should render image', () => {
    const userInfo = { avatar: '/path/to/image.jpg' }
    const { getByAltText, debug } = render(<Avatar userInfo={userInfo} />)
    debug()
    const img = getByAltText('avatar')
    expect(img).toHaveClass('avatar')
    expect(img).toHaveAttribute('src', userInfo.avatar)
  })

  it('should render letters', () => {
    const userInfo = { givenName: 'Given', familyName: 'Family' }
    const { getByText } = render(<Avatar userInfo={userInfo} />)
    expect(getByText('GF')).toBeTruthy()
  })
})
