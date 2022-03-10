import React from 'react'

import { HelpLinks } from '@ues/assets'
import { ViewWrapper } from '@ues/behaviours'

export const Authentication = React.lazy(() => import('./settings/authentication'))
export const Authenticator = React.lazy(() => import('./settings/authenticators/authenticator'))

export const AuthenticationRoutes = [
  { path: '/authentication/authenticators/add', element: <Authenticator /> },
  { path: '/authentication/authenticators/:id', element: <Authenticator /> },
]

export const AuthenticatorRoute = {
  path: '/authentication/authenticators',
  element: <Authentication />,
}

export const AuthenticationChildRoutes = {
  path: '/authentication',
  children: [
    { path: '/authenticators/add', element: <Authenticator /> },
    { path: '/authenticators/:id', element: <Authenticator /> },
  ],
}

export const AuthenticationSettingsRoutes = [
  { path: '/settings/authentication/authenticators/add', element: <Authenticator /> },
  { path: '/settings/authentication/authenticators/:id', element: <Authenticator /> },
]

export const AuthenticatorsRoutes = [
  {
    path: '/settings/authentication/authenticators',
    element: (
      <ViewWrapper
        basename="/settings/authentication/authenticators"
        titleKey="console:authentication.title"
        tKeys={['console']}
        helpId={HelpLinks.AuthenticationSettings}
      >
        <Authentication />
      </ViewWrapper>
    ),
  },
  { path: '/settings/authentication/authenticators/add', element: <Authenticator /> },
  { path: '/settings/authentication/authenticators/:id', element: <Authenticator /> },
]

export const _defaultRoute = './authentication/authenticators'
