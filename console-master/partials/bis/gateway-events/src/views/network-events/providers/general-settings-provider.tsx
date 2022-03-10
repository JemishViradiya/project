import React, { createContext } from 'react'

import type { GeneralSettingsOptions } from '@ues-data/bis'
import { UESGeneralSettingsQuery } from '@ues-data/bis'
import type { ApolloQueryState } from '@ues-data/shared'
import { Permission, useStatefulApolloQuery } from '@ues-data/shared'
import { useSecuredContent } from '@ues/behaviours'

export const GeneralSettingsContext = createContext({} as ApolloQueryState<GeneralSettingsOptions, void>)

export const GeneralSettingsProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  useSecuredContent(Permission.BIS_SETTINGS_READ)

  const value = useStatefulApolloQuery(UESGeneralSettingsQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  })
  return <GeneralSettingsContext.Provider value={value}>{children}</GeneralSettingsContext.Provider>
}
