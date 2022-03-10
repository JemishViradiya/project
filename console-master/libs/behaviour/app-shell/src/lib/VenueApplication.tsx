import React, { StrictMode } from 'react'

// TODO: remove mock provider when we have console-ui session support
import { MockProvider } from '@ues-data/shared'

import { VenuePartialShell } from './components/VenuePartialShell'
import { VenueCoreProviders } from './components/VenueProviders'

const UesApplication: React.FC = ({ children }) => {
  return (
    <StrictMode>
      <MockProvider value={true}>
        <VenueCoreProviders>
          <VenuePartialShell>{children}</VenuePartialShell>
        </VenueCoreProviders>
      </MockProvider>
    </StrictMode>
  )
}

UesApplication.displayName = 'UesApplication'

export default UesApplication
