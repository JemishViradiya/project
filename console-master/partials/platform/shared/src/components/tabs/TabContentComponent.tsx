import React from 'react'
import { Outlet } from 'react-router'

import { ContentArea, ContentAreaPanel } from '@ues/behaviours'

/**
 * Helper element for wrapping partial content otherwise wrapped by an app component
 */
export const TabContentComponent = () => (
  <ContentArea>
    <ContentAreaPanel fullWidth={true}>
      <Outlet />
    </ContentAreaPanel>
  </ContentArea>
)
