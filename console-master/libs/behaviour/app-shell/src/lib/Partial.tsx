import React, { useMemo } from 'react'
import type { PartialRouteObject } from 'react-router'
import { Navigate, useRoutes } from 'react-router'

const isPartialRouteObject = obj => {
  return !!(obj.path && (obj.children || obj.element))
}

const aggregateConcreteRoutes = (agg, item, scope = '') => {
  const itemPath = scope + (item.path || '').replace(/[*]$/, '')
  if (item.element) {
    agg.add(itemPath)
  }
  if (item.children) {
    for (const child of item.children) {
      aggregateConcreteRoutes(agg, child, itemPath)
    }
  }
}

const extractRoutes = (routeSpec): PartialRouteObject[] => {
  const routes: PartialRouteObject[] = []
  const concreteRoutes = new Set<string>()
  const defaultRouteOverride = routeSpec._defaultRoute
  if (routeSpec._routes) {
    routeSpec = routeSpec._routes.reduce((agg, r, idx) => {
      agg[idx] = r
      return agg
    }, {})
  }
  for (const name of Object.keys(routeSpec)) {
    if (name[0] === '_') continue

    const item = routeSpec[name]
    if (!Array.isArray(item)) {
      if (!isPartialRouteObject(item)) continue
      routes.push(item)

      aggregateConcreteRoutes(concreteRoutes, item)
      continue
    }

    if (!isPartialRouteObject(item[0])) continue
    for (const i of item) {
      aggregateConcreteRoutes(concreteRoutes, i)
    }
    routes.push({
      path: `/${name}`,
      children: item,
    })
  }

  console.log(`Partial Routes:\n  ${Array.from(concreteRoutes.values()).join('\n  ')}`)

  const defaultRoute = defaultRouteOverride || concreteRoutes.values().next().value
  routes.push({
    path: '*',
    element: <Navigate to={defaultRoute} />,
  })

  return routes
}

const Partial: React.FC<{ routes: Record<string, PartialRouteObject> }> = ({ routes: routeSpec }) => {
  const routes = useMemo(() => extractRoutes(routeSpec), [routeSpec])
  return useRoutes(routes)
}

Partial.displayName = 'Partial'

export default Partial
