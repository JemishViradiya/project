/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'

import { SecuredContentBoundary, ViewWrapper } from '@ues/behaviours'

import { DirectoryConnectionsTabs } from '.'

const Settings = () => {
  return (
    <ViewWrapper
      basename="/settings/directory-connections"
      titleKey="console:directoryConnections.title"
      tabs={DirectoryConnectionsTabs}
      tKeys={['console']}
      PanelProps={{ ContentWrapper: SecuredContentBoundary }}
      tabWrapper
    />
  )
}
export default Settings
