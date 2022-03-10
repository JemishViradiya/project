import React, { memo, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { HashRouter } from 'react-router-dom'

import { ResponsiveDrawer } from '@ues-behaviour/nav-drawer'
import { Loading } from '@ues/behaviours'

import { Apps } from './Apps'

const DefaultTranslationsLoader: React.FC = memo(() => {
  const { t } = useTranslation(['navigation', 'formats', 'general/form'])
  return null
})

export const UesAppShell: React.FC = memo(({ children }) => {
  const loading = (
    <main>
      <Loading />
    </main>
  )

  return (
    <HashRouter>
      <ResponsiveDrawer
        nav={
          <Suspense fallback="">
            <Apps />
          </Suspense>
        }
        content={
          <>
            <Suspense fallback={null}>
              <DefaultTranslationsLoader />
            </Suspense>
            <Suspense fallback={loading}>{children}</Suspense>
          </>
        }
      />
    </HashRouter>
  )
})

UesAppShell.displayName = 'UesAppShell'
