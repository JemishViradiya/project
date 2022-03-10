import React from 'react'

import { Box } from '@material-ui/core'

import useStyles from './styles'

interface RiskSliderWrapperProps {
  wrapperClass?: string
}

export const RiskSliderWrapper: React.FC<RiskSliderWrapperProps> = ({ children, wrapperClass }) => {
  const classes = useStyles()

  return <Box className={`${classes.boxContainer} ${wrapperClass}`}>{children}</Box>
}
