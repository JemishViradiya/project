import type { ReactNode } from 'react'
import React from 'react'

import TooltipComponent from '@material-ui/core/Tooltip'

/**
 * Default tooltip used internally across all Map components
 */
export const Tooltip: React.FC<{ title: ReactNode }> = ({ title, children }) => (
  <TooltipComponent title={title} placement="top" enterDelay={600}>
    {children as React.ReactElement}
  </TooltipComponent>
)
