//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import cn from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Typography } from '@material-ui/core'

import { Config } from '@ues-gateway/shared'

import useStyles from './styles'

const { GATEWAY_TRANSLATIONS_KEY } = Config

interface ConjunctionLabelProps {
  showText: boolean
  autoHeight?: boolean
}

export const ConjunctionLabel: React.FC<ConjunctionLabelProps> = ({ showText, autoHeight }) => {
  const classes = useStyles()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  return (
    <Box className={cn({ [classes.conjunctionLabel]: true, [classes.autoHeight]: autoHeight })}>
      {showText && <Typography variant="subtitle2">{t('common.or')}</Typography>}
    </Box>
  )
}
