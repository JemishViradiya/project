import React, { memo } from 'react'

const initialTenant = () => {
  if (window && window.location) {
    return {
      tenant: window.location.pathname.split('/')[1],
    }
  }
}

// comparator is called by the hot reloader when refreshing the app
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const Context = React.createContext(initialTenant(), (a: any, b: any) =>
  a.history === b.history && a.tenant === b.tenant ? 0 : 1073741823,
)

const TenantProvider: React.FC<{ value: any }> = memo(({ value, children }) => (
  <Context.Provider value={value}>{children}</Context.Provider>
))

export default TenantProvider
