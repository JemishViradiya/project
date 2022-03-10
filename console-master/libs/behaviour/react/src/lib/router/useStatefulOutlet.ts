import type React from 'react'
import { useCallback } from 'react'
import type { Params, RouteObject } from 'react-router'
import { useNavigate, useOutlet } from 'react-router'

export type NavigateProps = {
  replace?: boolean
  state?: any
}

type RouteProvderType = {
  params: Readonly<Params>
  pathname: string
  route: RouteObject
  outlet: RouteProviderElement
}
type RouteProviderElement = React.ReactElement<React.ProviderProps<RouteProvderType>, React.Provider<RouteProvderType>>

const emptyOutlet = { props: { value: { route: {} } } } as { props: React.ProviderProps<RouteProvderType> }
export const useStatefulOutlet = (navigateProps?: NavigateProps): [string, React.Dispatch<string>, React.ReactElement] => {
  const outlet = useOutlet() as RouteProviderElement
  const {
    props: {
      value: { route },
    },
  } = outlet || emptyOutlet

  const navigate = useNavigate()
  const setRoute = useCallback(
    (path: string) => {
      navigate(`.${path.replace(/[*]$/, '')}`, navigateProps)
    },
    [navigate, navigateProps],
  )

  return [route?.path, setRoute, outlet]
}
