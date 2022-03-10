import React from 'react'

import { fireEvent, render } from '@testing-library/react'

import { NestedMenu, Option } from './NestedMenu'

const t = global.T()

describe('NestedMenu component', () => {
  it('renders correctly', () => {
    const Trigger = () => 'trigger'

    const { getByText } = render(<NestedMenu trigger={<Trigger />} />)

    expect(getByText('trigger')).not.toBeNull()
  })
})

describe('SubMenu component', () => {
  let SubMenu

  beforeAll(() => {
    jest.doMock('../../../../../components/icons/Icon', () => ({
      Icon: ({ icon }) => icon,
    }))

    SubMenu = require('./NestedMenu').SubMenu
  })

  it('renders correctly', () => {
    const iconId = 'iconId'
    const mockIcon = <span data-testid={iconId} />
    const mockTitle = 'mockTitle'

    const { getByTestId, getByText } = render(<SubMenu icon={mockIcon} title={mockTitle} />)

    expect(getByTestId(iconId)).not.toBeNull()
    expect(getByText(mockTitle)).not.toBeNull()
  })
})

describe('Option component', () => {
  it('renders correctly', () => {
    const mockOnClick = jest.fn()
    const mockTitle = 'mockTitle'

    const { getByText } = render(<Option title={mockTitle} onClick={mockOnClick} t={t} />)

    expect(getByText(mockTitle)).not.toBeNull()
  })

  it('triggers click function on click', () => {
    const mockOnClick = jest.fn()

    const { getByRole } = render(<Option title="" onClick={mockOnClick} t={t} />)
    const option = getByRole('button')

    fireEvent.click(option)

    expect(mockOnClick).toHaveBeenCalled()
  })
})
