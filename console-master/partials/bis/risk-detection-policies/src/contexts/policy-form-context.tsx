import noop from 'lodash-es/noop'
import React, { createContext, useCallback, useState } from 'react'

import type { PolicyFormValues } from '../model'

type ValuesGetter = () => PolicyFormValues | undefined

export interface PolicyFormContextValue {
  hasChanges: boolean
  setHasChanges: (hasChanges: boolean) => void
  getValues: ValuesGetter
  setValuesGetter: (getValues: ValuesGetter) => void
}

export const PolicyFormContext = createContext<PolicyFormContextValue>({
  hasChanges: false,
  setHasChanges: noop,
  getValues: () => undefined,
  setValuesGetter: noop,
})

export const PolicyFormContextProvider: React.FC = ({ children }) => {
  const [hasChanges, setHasChanges] = useState(false)
  const [getValues, setValuesGetterState] = useState<ValuesGetter>(() => undefined)

  const setValuesGetter = useCallback((valuesGetter: ValuesGetter) => setValuesGetterState(() => valuesGetter), [
    setValuesGetterState,
  ])

  return (
    <PolicyFormContext.Provider value={{ hasChanges, setHasChanges, getValues, setValuesGetter }}>
      {children}
    </PolicyFormContext.Provider>
  )
}
