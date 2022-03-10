/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import 'cypress-storybook/react'

import { addDecorator, addParameters } from '@storybook/react'

import { i18NextDecorator, muiDecorator, routerDecorator } from './decorators'
import storybookTheme from './theme'

export default ({ muiTheme = true, i18n = true, router = true } = {}) => {
  addParameters({
    docs: {
      theme: storybookTheme,
    },
    controls: { expanded: true },
  })

  if (muiTheme) addDecorator(muiDecorator())
  if (i18n) addDecorator(i18NextDecorator())
  if (router) addDecorator(routerDecorator())
}
