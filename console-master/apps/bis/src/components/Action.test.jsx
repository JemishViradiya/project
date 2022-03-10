import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { cleanup, render } from '@testing-library/react'

import { OperatingModeQuery } from '@ues-data/bis'

import { MockedApolloProvider } from '../../tests/utils'
import Action from './Action'
import ActionType from './ActionType'

const { query, subscription } = OperatingModeQuery

describe('Action', () => {
  const renderAction = action => {
    const mocks = [
      {
        request: { query, variables: {} },
        result: { data: { operatingMode: 'PASSIVE' } },
      },
      {
        delay: 10000,
        request: { query: subscription, variables: {} },
        result: { data: { operatingModeChanged: 'ACTIVE' } },
      },
    ]
    return render(<MockedApolloProvider mocks={mocks}>{action}</MockedApolloProvider>)
  }

  afterEach(() => {
    cleanup()
  })

  test('render with no sisActions', () => {
    const { queryByText } = renderAction(<Action />)
    expect(queryByText(/./)).toBe(null)
  })

  test('render passive with no actions', () => {
    const sisActions = {
      actions: [],
    }
    const { queryAllByText } = renderAction(<Action sisActions={sisActions} />)
    expect(queryAllByText(/./)).toHaveLength(0)
  })

  test('render active with no actions', () => {
    const sisActions = {
      actions: [],
    }
    const { queryAllByText, container } = renderAction(<Action operatingMode="ACTIVE" sisActions={sisActions} />)
    expect(queryAllByText(/./)).toHaveLength(0)
    expect(container.querySelectorAll('.passive')).toHaveLength(0)
  })

  test('render active with actions', () => {
    const sisActions = {
      actions: [
        {
          type: ActionType.SendAlert.actionType,
          alertMessage: 'ice cream',
        },
        {
          type: ActionType.AssignProfile.actionType,
          profileId: 'prof814',
        },
      ],
    }
    const { queryAllByTitle, container } = renderAction(<Action operatingMode="ACTIVE" sisActions={sisActions} />)
    expect(container.querySelectorAll('.actionItem')).toHaveLength(2)
    expect(queryAllByTitle(/Send alert/)).toHaveLength(1)
    expect(queryAllByTitle(/Assign profile/)).toHaveLength(1)
    expect(container.querySelectorAll('.passive')).toHaveLength(0)
  })

  test('render passive with actions', () => {
    const sisActions = {
      actions: [
        {
          type: ActionType.AssignGroup.actionType,
          groupId: 'abc123',
          groupName: 'name abc123',
        },
      ],
    }
    const { queryAllByTitle, container } = renderAction(<Action operatingMode="PASSIVE" sisActions={sisActions} />)
    expect(container.querySelectorAll('.actionItem')).toHaveLength(1)
    expect(queryAllByTitle(/Actions are disabled in passive mode/)).toHaveLength(1)
    expect(container.querySelectorAll('.passive')).toHaveLength(1)
  })
})
