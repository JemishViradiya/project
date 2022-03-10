import React, { StrictMode } from 'react'

import { UesAppShell } from './components/AppShell'
import { UesCoreProviders } from './components/Providers'

const UesApplication: React.FC = ({ children }) => {
  return (
    <StrictMode>
      <UesCoreProviders>
        <UesAppShell>{children}</UesAppShell>
      </UesCoreProviders>
    </StrictMode>
  )
}

UesApplication.displayName = 'UesApplication'

export default UesApplication
