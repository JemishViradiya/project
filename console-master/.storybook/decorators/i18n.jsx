/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import './i18n/i18n'

import React, { Suspense } from 'react'

function I18NextWrapper({ children }) {
  return <Suspense fallback="">{children}</Suspense>
}

function i18NextDecorator(Story, ctx) {
  return (
    <I18NextWrapper>
      <Story {...ctx} />
    </I18NextWrapper>
  )
}

export default () => i18NextDecorator
