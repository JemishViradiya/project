import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { cleanup, render } from '@testing-library/react'

import Modal from './Modal'

describe('Modal', () => {
  afterEach(cleanup)

  it('render with default properties', () => {
    const showModal = true
    const { baseElement: container } = render(
      <Modal size="lg" t={t => t} open={showModal} context={() => <div>test</div>} onClose={showModal => !showModal} />,
    )
    expect(container.querySelectorAll('.MuiBackdrop-root')).toHaveLength(1)
    expect(container.querySelectorAll('[role="dialog"]')).toHaveLength(1)
  })

  it('do not render modal', () => {
    const showModal = false
    const { baseElement: container } = render(
      <Modal size="md" t={t => t} open={showModal} context={() => <div>test</div>} onClose={showModal => !showModal} />,
    )
    expect(container.querySelectorAll('.MuiBackdrop-root')).toHaveLength(0)
    expect(container.querySelectorAll('[role="dialog"]')).toHaveLength(0)
  })
})
