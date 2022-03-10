import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import { MemoryRouter } from 'react-router'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { create } from 'react-test-renderer'

import { cleanup, render } from '@testing-library/react'

import { TenantLink } from './TenantLink'

jest.mock('react-router-dom', () => {
  const React = jest.requireActual('react')
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn().mockReturnValue(() => undefined),
    useLocation: jest.fn().mockReturnValue({ state: { goBack: true } }),
    Link: jest.fn().mockReturnValue(React.createElement('div', { children: 'LinkMock' })),
  }
})

const LinkMock = onClickTriggered => props => {
  if (onClickTriggered) {
    props.onClick(document.createEvent('Event'))
  }
  return <div {...props}>Link Mock</div>
}

describe('TenantLink', () => {
  beforeEach(cleanup)

  test('has no link children when given the "dead" prop', () => {
    const { getByRole } = render(
      <MemoryRouter initialEntries={['/t1/']}>
        <TenantLink to="/overthere" nav dead />
      </MemoryRouter>,
    )
    expect(getByRole('link')).toBeEmptyDOMElement()
  })

  test('nav prop beggets NavLink', () => {
    const { getByRole } = render(
      <MemoryRouter initialEntries={['/t1/']}>
        <TenantLink tenant="t1" to="/overthere" nav />
      </MemoryRouter>,
    )
    expect(getByRole('link')).toBeTruthy()
    expect(getByRole('link')).toHaveAttribute('href', '/overthere')
  })

  test('no nav prop beggets Link', () => {
    Link.mockImplementation(LinkMock())
    const container = create(
      <MemoryRouter initialEntries={['/t1/']}>
        <TenantLink tenant="t1" to="/overthere" />
      </MemoryRouter>,
    )
    const { to } = container.root.children[0].children[0].props

    expect(to).toBe('/overthere')
  })

  test('"to" props without leading slashes aren\'t prefixed with tenant', () => {
    Link.mockImplementation(LinkMock())
    const container = create(
      <MemoryRouter initialEntries={['/t1/']}>
        <TenantLink tenant="t1" to="somewhere else" />
      </MemoryRouter>,
    )
    const { to } = container.root.children[0].children[0].props

    expect(to).toBe('somewhere else')
  })

  test('navigate is called when goBack is true', () => {
    const navigateMock = jest.fn()
    useNavigate.mockReturnValue(navigateMock)
    useLocation.mockReturnValue({ state: { goBack: true } })
    Link.mockImplementation(LinkMock(true))

    const { getByRole } = render(
      <MemoryRouter initialEntries={['/t1/']}>
        <TenantLink goBack tenant="t1" to="somewhere else" />
      </MemoryRouter>,
    )
    expect(navigateMock).toHaveBeenCalledWith(-1)
  })

  test('navigate is not called when goBack is false', () => {
    const navigateMock = jest.fn()
    useNavigate.mockReturnValue(navigateMock)
    useLocation.mockReturnValue({ state: { goBack: false } })
    Link.mockImplementation(LinkMock(true))

    const { getByRole } = render(
      <MemoryRouter initialEntries={['/t1/']}>
        <TenantLink goBack tenant="t1" to="somewhere else" />
      </MemoryRouter>,
    )
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
