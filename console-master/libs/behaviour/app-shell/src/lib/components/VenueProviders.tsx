import React, { memo } from 'react'
import { Provider as Redux } from 'react-redux'

// import { ApolloProvider } from '@apollo/client'
import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/core/styles'

import {
  FeaturizationProvider,
  MockProvider,
  PermissionsProvider,
  // UesApolloClient,
  UesReduxStore,
  UesSessionProvider,
} from '@ues-data/shared'
import { useResponsiveMuiTheme } from '@ues/assets'
import { ConfirmationProvider, GenericErrorBoundary, Loading, RootErrorHandler, SnackbarProvider } from '@ues/behaviours'

export const VenueCoreProviders: React.FC<{ mock?: true }> = memo(({ mock, children }) => {
  const theme = useResponsiveMuiTheme()
  return (
    <MockProvider value={mock}>
      <GenericErrorBoundary key={window.location.href} fallback={<RootErrorHandler />}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <UesSessionProvider loading={<Loading />} mock={true}>
            <FeaturizationProvider loadingElement={<Loading />} mock={true}>
              <PermissionsProvider>
                <Redux store={UesReduxStore}>
                  {/* <ApolloProvider client={UesApolloClient}> */}
                  <SnackbarProvider>
                    <ConfirmationProvider>{children}</ConfirmationProvider>
                  </SnackbarProvider>
                  {/* </ApolloProvider> */}
                </Redux>
              </PermissionsProvider>
            </FeaturizationProvider>
          </UesSessionProvider>
        </ThemeProvider>
      </GenericErrorBoundary>
    </MockProvider>
  )
})

VenueCoreProviders.displayName = 'UesCoreProviders'
