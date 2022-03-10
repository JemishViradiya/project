/* eslint-disable react/jsx-filename-extension */
/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { addDecorator } from '@storybook/react'

import addBaseDecorators from '../../../../.storybook/preview.base'
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import I18NWrapper from '../../../assets-e2e/.storybook/decorators/I18NWrapper'

const storyRouterDecorator = (routerProps = {}) => {
  const s = story => <MemoryRouter {...routerProps}>{story()}</MemoryRouter>
  s.displayName = 'StoryRouter'
  return s
}

const storyI18NDecorator = () => {
  const s = story => <I18NWrapper>{story()}</I18NWrapper>
  s.displayName = 'StoryI18N'
  return s
}

addDecorator(storyRouterDecorator())
addDecorator(storyI18NDecorator())

addBaseDecorators()
