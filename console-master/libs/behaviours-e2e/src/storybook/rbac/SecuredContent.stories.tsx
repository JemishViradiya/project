import React from 'react'

import { Card, CardContent, CardHeader, Typography } from '@material-ui/core'

import { MockProvider, PermissionsApi, PermissionsContext } from '@ues-data/shared'
import { Permission } from '@ues-data/shared-types'
import { GenericErrorBoundary, RootErrorHandler, SecuredContent, SecuredContentBoundary } from '@ues/behaviours'

import markdown from './SecuredContent.md'

const requiredPermissions = new Set([Permission.BIG_ACL_READ])

export const SecuredContentCard: React.FC = () => {
  return (
    <Card>
      <SecuredContentBoundary>
        <CardHeader title="Secured Content Card"></CardHeader>
        <CardContent>
          <SecuredContent requiredPermissions={requiredPermissions}>
            <Typography>This is the secured content.</Typography>
          </SecuredContent>
        </CardContent>
      </SecuredContentBoundary>
    </Card>
  )
}

export const SecuredContentArea: React.FC = () => {
  return (
    <SecuredContent requiredPermissions={requiredPermissions}>
      <Typography>This is the secured content.</Typography>
    </SecuredContent>
  )
}

export default {
  title: 'RBAC/SecuredContent',
  parameters: {
    controls: { hideNoControlsWarning: true },
    notes: markdown,
  },
  decorators: [decorator],
  argTypes: {
    canAccess: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Indicates if content can be viewed.',
    },
  },
}

const fullAccess = PermissionsApi(requiredPermissions)
const noPermission = PermissionsApi(new Set<Permission>())

function decorator(Story: React.ElementType, { args }) {
  const value = args.canAccess ? fullAccess : noPermission
  return (
    <MockProvider value={true}>
      <GenericErrorBoundary fallback={<RootErrorHandler />}>
        <PermissionsContext.Provider value={value}>
          <Story />
        </PermissionsContext.Provider>
      </GenericErrorBoundary>
    </MockProvider>
  )
}
