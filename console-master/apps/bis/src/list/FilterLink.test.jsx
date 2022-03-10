import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, cleanup, findAllBy, fireEvent, render, screen } from '@testing-library/react'

import { Expander, FilterLink } from './FilterLink'

const { findAllByRole } = screen

jest.mock('@ues-data/shared', () => ({
  ...jest.requireActual('@ues-data/shared'),
  useStatefulApolloQuery: () => ({
    data: {},
  }),
}))

describe('FilterLink classes', () => {
  afterEach(cleanup)

  describe('Expander', () => {
    test('can open/close expander', async () => {
      const { queryByRole, queryAllByTestId, queryByLabelText } = render(
        <Expander label="LABEL">
          <span data-testid="mockChildren" />
        </Expander>,
      )

      const expanderButton = queryByRole('button')
      // start closed
      expect(expanderButton).toHaveAttribute('aria-expanded', 'false')
      expect(queryAllByTestId('mockChildren')).toHaveLength(0)

      // opens with a click
      fireEvent.click(expanderButton)

      // it's open
      expect(expanderButton).toHaveAttribute('aria-expanded', 'true')
      expect(queryAllByTestId('mockChildren')).toHaveLength(1)

      // closes again with a click
      fireEvent.click(expanderButton)

      // it's closed
      expect(expanderButton).toHaveAttribute('aria-expanded', 'false')
      expect(queryAllByTestId('mockChildren')).toHaveLength(0)

      // and the label appeared
      expect(queryByLabelText('LABEL')).toBeVisible()
    })
  })

  describe('FilterLink', () => {
    let props

    const resetProps = () => {
      props = {
        label: 'LABEL',
        t: jest.fn(),
        query: {},
        dataAccessor: jest.fn().mockImplementation(() => [
          { key: '0', count: 15 },
          { key: '1', count: 10 },
          { key: '2', count: 5 },
        ]),
        options: [
          {
            key: 0,
            field: 'FIELD_0',
            label: 'OPTION_0',
            levels: [
              { key: '0', checked: false, label: 'LABEL1', onToggle: jest.fn() },
              { key: '1', checked: false, label: 'LABEL2', onToggle: jest.fn() },
              { key: '2', checked: false, label: 'LABEL3', onToggle: jest.fn() },
            ],
          },
        ],
      }
    }

    beforeEach(() => resetProps())

    test('it renders in a basic way', async () => {
      const { container, queryAllByRole, queryByText } = render(<FilterLink {...props} />)
      expect(container).not.toBeEmptyDOMElement()
      expect(queryAllByRole('button')).toHaveLength(0)

      // just for the sake of code coverage, invoke this method,
      // and see that it works
      let buttons
      await act(async () => {
        fireEvent.click(queryByText('LABEL'))
        buttons = await findAllByRole('button')
      })

      expect(buttons.length).toBeGreaterThan(0)
    })

    test('tooltip opens, expander opens', async () => {
      const { container, queryAllByRole, queryByText } = render(<FilterLink {...props} />)
      expect(container).not.toBeEmptyDOMElement()
      expect(queryAllByRole('button')).toHaveLength(0)

      // click to open popup, then click on the expander
      let expander, checkboxes
      await act(async () => {
        fireEvent.click(queryByText('LABEL'))
        expander = (await findAllByRole('button'))[0]
      })
      await act(async () => {
        fireEvent.click(expander)
        checkboxes = await findAllByRole('checkbox')
      })
      expect(checkboxes).toHaveLength(3)
    })

    test('exercise options handling, clearAll', async () => {
      // give clearAll() something to do
      props.options[0].levels[2].checked = true

      const { container, queryAllByRole, queryByText, queryByLabelText } = render(<FilterLink {...props} />)
      expect(container).not.toBeEmptyDOMElement()
      expect(queryAllByRole('button')).toHaveLength(0)

      // click to open popup, then click on the expander
      let expander, checkboxes
      await act(async () => {
        fireEvent.click(queryByText('LABEL'))
        expander = (await findAllByRole('button'))[0]
      })
      await act(async () => {
        fireEvent.click(expander)
        checkboxes = await findAllByRole('checkbox')
      })

      expect(checkboxes).toHaveLength(3)
      for (const item of checkboxes) {
        fireEvent.click(item)
      }
      // set the options
      const clearAllButton = queryByLabelText('clear button')
      expect(clearAllButton).toBeVisible()

      // no toggle should have been called yet
      props.options[0].levels.forEach(l => expect(l.onToggle).not.toHaveBeenCalled())

      // after a click, only the set checkboxes should generated triggers
      await act(async () => {
        fireEvent.click(clearAllButton)
      })
      expect(props.options[0].levels[0].onToggle).not.toHaveBeenCalled()
      expect(props.options[0].levels[1].onToggle).not.toHaveBeenCalled()
      expect(props.options[0].levels[2].onToggle).toHaveBeenCalled()

      // and the the popup disappear
      expect(queryAllByRole('button')).toHaveLength(0)
    })

    test('exercise options handling, apply', async () => {
      // give apply() something to do
      props.options[0].levels[2].checked = true

      const { container, queryAllByRole, queryByText, queryByLabelText } = render(<FilterLink {...props} />)
      expect(container).not.toBeEmptyDOMElement()
      expect(queryAllByRole('button')).toHaveLength(0)

      // click to open popup, then click on the expander
      let expander, checkboxes
      await act(async () => {
        fireEvent.click(queryByText('LABEL'))
        expander = (await findAllByRole('button'))[0]
      })
      await act(async () => {
        fireEvent.click(expander)
        checkboxes = await findAllByRole('checkbox')
      })
      expect(checkboxes).toHaveLength(3)
      for (const item of checkboxes) {
        fireEvent.click(item)
      }

      // set the options
      const applyAllButton = queryByLabelText('apply button')
      expect(applyAllButton).toBeVisible()

      // no toggle should have been called yet
      props.options[0].levels.forEach(l => expect(l.onToggle).not.toHaveBeenCalled())

      // after a click, only the set checkboxes should generated triggers
      await act(async () => {
        fireEvent.click(applyAllButton)
      })
      props.options[0].levels.forEach(l => expect(l.onToggle).toHaveBeenCalled())

      // and the the popup disappear
      expect(queryAllByRole('button')).toHaveLength(0)
    })
  })
})
