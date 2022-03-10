import React from 'react'

import { MockProvider } from '@ues-data/shared'
import { GenericErrorBoundary, RootErrorHandler } from '@ues/behaviours'

import markdown from './Errors.md'

export const DefaultFallback: React.FC = () => {
  throw new Error()
}

export default {
  title: 'Errors/Default Fallback',
  decorators: [decorator],
  parameters: {
    controls: { hideNoControlsWarning: true },
    notes: markdown,
  },
}

function decorator(Story: React.ElementType, { args }) {
  return (
    <MockProvider value={true}>
      <GenericErrorBoundary fallback={<RootErrorHandler />}>
        <Story />
      </GenericErrorBoundary>
    </MockProvider>
  )
}
