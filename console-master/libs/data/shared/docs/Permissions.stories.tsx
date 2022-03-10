import React from 'react'

import { FeaturizationProvider, Permission, PermissionsProvider, ServiceEnabledProvider, usePermissions } from '@ues-data/shared'

import { UesSessionProvider, useUesSessionState } from '../src/console'
import { MockProvider } from '../src/lib/mockContext'

const decorator = Story => (
  <MockProvider value={true}>
    <Story />
  </MockProvider>
)

export const PermissionsStory = storyBookArgs => {
  // needed for storybook only
  useUesSessionState()

  const PermissionsApi = () => {
    const { hasPermission, hasAnyPermission } = usePermissions()
    return (
      <section>
        <h3>Permissions API</h3>
        <p>
          Use the <b>usePermissions()</b> hook to get access to <b>hasPermission</b>, and <b>hasAnyPermission</b> methods.
        </p>
        <p>
          <b>hasPermission</b> accepts one or more <code>Permission</code> from the @ues-data/shared and returns true if all
          permission specified are true.
        </p>
        <p>Example - Single Permission - hasPermission(Permission.MTD_POLICY_READ):</p>

        <pre>{JSON.stringify(hasPermission(Permission.MTD_POLICY_READ), null, 2)}</pre>

        <p>Example - Multiple Permission - hasPermission(Permission.MTD_POLICY_READ, Permission.MTD_EVENTS_UPDATE):</p>
        <pre>{JSON.stringify(hasPermission(Permission.MTD_POLICY_READ, Permission.MTD_EVENTS_UPDATE), null, 2)}</pre>

        <p>
          <b>hasAnyPermission</b> accepts one or more <code>Permission</code> from the @ues-data/shared and returns true if any of
          the permission specified are true.
        </p>
        <p>Example - hasAnyPermission(Permission.MTD_POLICY_CREATE, Permission.MTD_POLICY_UPDATE):</p>
        <pre>{JSON.stringify(hasAnyPermission(Permission.MTD_POLICY_CREATE, Permission.MTD_POLICY_UPDATE), null, 2)}</pre>
      </section>
    )
  }

  return (
    <UesSessionProvider>
      <FeaturizationProvider>
        <ServiceEnabledProvider>
          <PermissionsProvider>
            <PermissionsApi />
          </PermissionsProvider>
        </ServiceEnabledProvider>
      </FeaturizationProvider>
    </UesSessionProvider>
  )
}

export default {
  title: 'Permissions',
  decorators: [decorator],
}
