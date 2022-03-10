/* eslint-disable react/jsx-filename-extension */
/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { Suspense } from 'react'
import { HashRouter, MemoryRouter } from 'react-router-dom'

import { addDecorator } from '@storybook/react'

import addBaseDecorators from '../../../../.storybook/preview.base'
import { ErrorBoundary } from '../docs/ErrorBoundary'
import { ErrorFallback, Fallback } from '../docs/util'

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
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Suspense fallback={<Fallback />}>
          <Story {...ctx} />
        </Suspense>
      </ErrorBoundary>
    </Router>
  )
}

addDecorator(storyRouterDecorator)
addBaseDecorators({ i18n: false, muiTheme: false, router: false })
