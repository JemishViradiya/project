import React, { memo } from 'react'

import { ApolloProvider } from '@apollo/client'

import client from '../../ApolloSetup'
import AppShell from '../../app-shell/AppShell'
import { GoogleApiPreload } from '../../googleMaps/loadGoogleApi'
import ClientParamsProvider from '../../providers/ClientParamsProvider'
import MapOptionsProvider from '../../providers/MapOptionsProvider'
import TenantProvider from '../../providers/TenantProvider'
import TenantAppRoutes from './TenantAppRoutes'

const StandaloneTenantApp = memo(props => (
  <ApolloProvider client={client}>
    <TenantProvider value={props}>
      <ClientParamsProvider>
        <GoogleApiPreload />
        <AppShell>
          <MapOptionsProvider>
            <TenantAppRoutes />
          </MapOptionsProvider>
        </AppShell>
      </ClientParamsProvider>
    </TenantProvider>
  </ApolloProvider>
))

export default StandaloneTenantApp
