import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { cleanup, render } from '@testing-library/react'

import Header from './Header'

describe('Header', () => {
  afterEach(cleanup)

  it('render with only title', () => {
    const { getByTestId } = render(<Header title="Title" />)
    expect(getByTestId('title')).toHaveTextContent('Title')
  })

  it('render with title and children', () => {
    const { container, getByTestId } = render(
      <Header title="Title">
        <div className="child">Contents</div>
      </Header>,
    )
    expect(getByTestId('title')).toHaveTextContent('Title')
    expect(container.querySelector('.child')).toHaveTextContent('Contents')
  })

  it('render with title, children and actions', () => {
    const actions = [
      <button key="btn1" className="btn1">
        Button 1
      </button>,
      <button key="btn2" className="btn2">
        Button 2
      </button>,
    ]
    const { container, getByTestId } = render(
      <Header title="Title" actions={actions}>
        <div className="child">Contents</div>
      </Header>,
    )
    expect(getByTestId('title')).toHaveTextContent('Title')
    expect(container.querySelector('.child')).toHaveTextContent('Contents')
    expect(container.querySelector('.btn1')).toHaveTextContent('Button 1')
    expect(container.querySelector('.btn2')).toHaveTextContent('Button 2')
  })
})
