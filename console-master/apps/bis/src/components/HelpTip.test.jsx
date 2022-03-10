import React from 'react'

import { cleanup, render } from '@testing-library/react'

import HelpTip from './HelpTip'

describe('HelpTip tests', () => {
  beforeAll(() => {
    jest.doMock('react-i18next', () => ({ useTranslation: () => ({ t: x => x }) }))
  })

  afterEach(() => cleanup())

  const testData = {
    wrappedText: 'wrappedText',
    helpText: 'helpText',
  }

  it('renders correctly', () => {
    const { queryByText } = render(<HelpTip {...testData} />)
    expect(queryByText(testData.wrappedText)).not.toBeNull()
  })
})
