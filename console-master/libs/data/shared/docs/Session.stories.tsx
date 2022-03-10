import React from 'react'

import { UesSessionApi, UesSessionProvider, useUesSessionState } from '../src/console'
import { MockProvider } from '../src/lib/mockContext'

const decorator = Story => (
  <MockProvider value={true}>
    <Story />
  </MockProvider>
)

export default {
  title: 'Session',
  decorators: [decorator],
}

export const SessionApi = () => {
  const SessionInContext = () => {
    const sessionState = useUesSessionState()
    return (
      <section>
        <h3>SessionInContext</h3>
        <p>
          Use the useUesSessionState() hook to retrieve the session state <i>inside</i> React
        </p>
        <pre>{JSON.stringify(sessionState, null, 2)}</pre>
      </section>
    )
  }

  const SessionOutsideContext = () => {
    const { future, ...session } = UesSessionApi.getSession()
    return (
      <section>
        <h3>SessionOutsideContext</h3>
        <p>
          Use the UesSessionApi.getSession apis to retrieve the session state <i>outside</i> React. This must be called every time
          you wish to use the state.
        </p>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </section>
    )
  }

  const SessionPiecesOutsideContext = () => {
    return (
      <section>
        <h3>SessionPiecesOutsideContext</h3>
        <p>
          Use the UesSessionApi.get* apis to retrieve pieces of the session state <i>outside</i> React. This must be called every
          time you wish to use the state piece.
        </p>
        <pre>
          {JSON.stringify(
            {
              tenant: UesSessionApi.getTenantId(),
              region: UesSessionApi.getRegion(),
              token: UesSessionApi.getToken(),
              permissions: UesSessionApi.getPermissions(),
            },
            null,
            2,
          )}
        </pre>
      </section>
    )
  }

  const SessionApis = () => {
    // needed for storybook only
    useUesSessionState()
    return (
      <>
        {SessionInContext()}
        {SessionOutsideContext()}
        {SessionPiecesOutsideContext()}
      </>
    )
  }

  return (
    <UesSessionProvider>
      <SessionApis />
    </UesSessionProvider>
  )
}
