import React, { memo, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { HashRouter } from 'react-router-dom'

import { Loading } from '@ues/behaviours'

const DefaultTranslationsLoader: React.FC = memo(() => {
  const { t } = useTranslation(['navigation', 'formats', 'general/form'])
  return null
})

export const VenuePartialShell: React.FC = memo(({ children }) => {
  const loading = (
    <main>
      <Loading />
    </main>
  )

  return (
    <HashRouter>
      <>
        <Suspense fallback={null}>
          <DefaultTranslationsLoader />
        </Suspense>
        <Suspense fallback={loading}>{children}</Suspense>
      </>
    </HashRouter>
  )
})

VenuePartialShell.displayName = 'VenuePartialShell'
