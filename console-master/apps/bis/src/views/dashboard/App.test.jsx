import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { act, cleanup, fireEvent, render } from '@testing-library/react'

import { MockedApolloProvider } from '../../../tests/utils'
import App from './App'

jest.mock('../../components/hooks/useComponentSize', () => () => ({
  // width: 1280,
  // height: 1024,
}))
jest.mock('@ues-data/shared', () => ({
  ...jest.requireActual('@ues-data/shared'),
  useStatefulApolloQuery: jest.fn(() => ({
    data: {},
  })),
  useStatefulApolloSubscription: jest.fn(() => ({ data: {} })),
  useStatefulApolloMutation: jest.fn(() => [jest.fn()]),
}))

describe('App', () => {
  afterEach(cleanup)

  const renderApp = async app => {
    return render(
      <MockedApolloProvider>
        <MemoryRouter>{app}</MemoryRouter>
      </MockedApolloProvider>,
    )
  }

  test('it renders', async () => {
    const { container } = await renderApp(<App t={x => x} />)
    expect(container).not.toBeEmptyDOMElement()
  })

  // TODO fix this as part of SIS-9108 because
  test.skip('calls to onEditModeChange modifies state', async () => {
    const { container, queryByTitle, getByRole } = await renderApp(<App t={x => x} />)
    expect(container).not.toBeEmptyDOMElement()

    const editIcon = queryByTitle('Edit dashboard')
    expect(editIcon).toBeVisible()

    const getEditMode = () => getByRole('grid').getAttribute('aria-readonly') !== 'true'
    const toggleEditMode = () =>
      act(async () => {
        fireEvent.click(editIcon)
      })

    // starts false
    expect(getEditMode()).toBe(false)

    // toggle, turns true
    await toggleEditMode()
    expect(getEditMode()).toBe(true)

    // toggle, turns false again
    toggleEditMode()
    expect(getEditMode()).toBe(false)
  })
})
