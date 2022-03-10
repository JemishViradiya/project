import React, { memo } from 'react'
import { Provider as Redux } from 'react-redux'

import { ApolloProvider } from '@apollo/client'

import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/core/styles'

import { ResponsiveDrawerProvider } from '@ues-behaviour/nav-drawer'
import {
  FeaturizationProvider,
  MockProvider,
  PermissionsProvider,
  ServiceEnabledProvider,
  UesApolloClient,
  UesReduxStore,
  UesSessionProvider,
} from '@ues-data/shared'
import { useResponsiveMuiTheme } from '@ues/assets'
import { ConfirmationProvider, GenericErrorBoundary, Loading, RootErrorHandler, SnackbarProvider } from '@ues/behaviours'

export const UesCoreProviders: React.FC<{ mock?: true }> = memo(({ mock, children }) => {
  const theme = useResponsiveMuiTheme()
  return (
    <MockProvider value={mock}>
      <GenericErrorBoundary key={window.location.href} fallback={<RootErrorHandler />}>
        <UesSessionProvider loading={<Loading />}>
          <FeaturizationProvider loadingElement={<Loading />}>
            <Redux store={UesReduxStore}>
              <ApolloProvider client={UesApolloClient}>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <ServiceEnabledProvider loadingElement={<Loading />}>
                    <PermissionsProvider>
                      <ResponsiveDrawerProvider>
                        <SnackbarProvider>
                          <ConfirmationProvider>{children}</ConfirmationProvider>
                        </SnackbarProvider>
                      </ResponsiveDrawerProvider>
                    </PermissionsProvider>
                  </ServiceEnabledProvider>
                </ThemeProvider>
              </ApolloProvider>
            </Redux>
          </FeaturizationProvider>
        </UesSessionProvider>
      </GenericErrorBoundary>
    </MockProvider>
  )
})

UesCoreProviders.displayName = 'UesCoreProviders'
