import React, { memo } from 'react'

import { useStyles } from './styles'

export interface DetectionCellContentProps {
  text: string
}

const Component: React.FC<DetectionCellContentProps> = ({ text }) => {
  const classNames = useStyles()

  return (
    <div className={classNames.container} title={text}>
      {text}
    </div>
  )
}

export const DetectionCellContent = memo(Component)
