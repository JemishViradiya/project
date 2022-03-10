import React, { memo } from 'react'

const initialTenant = () => {
  if (window && window.location) {
    return {
      tenant: window.location.pathname.split('/')[1],
    }
  }
}

// comparator is called by the hot reloader when refreshing the app
export const Context = React.createContext(initialTenant(), (a, b) =>
  a.history === b.history && a.tenant === b.tenant ? 0 : 1073741823,
)

export const selectTenant = ({
  match: {
    params: { tenant },
  },
}) => tenant

export default memo(({ value, children }) => <Context.Provider value={value}>{children}</Context.Provider>)
