import React from 'react'
import { HashRouter, MemoryRouter } from 'react-router-dom'

const defaultRouterProps = { initialEntries: ['/'] }

/**
 * @type {import('@storybook/addons').DecoratorFunction<JSX.Element>}
 */
function storyRouterDecorator(Story, ctx) {
  const { backend = 'hash', initialEntries = defaultRouterProps.initialEntries, ...routerProps } = ctx?.parameters?.router || {}
  console.log('storyRouterDecorator backend:', backend)
  const Router = backend === 'hash' ? HashRouter : MemoryRouter
  return (
    <Router initialEntries={initialEntries} {...routerProps}>
      <Story {...ctx} />
    </Router>
  )
}

export default () => storyRouterDecorator
