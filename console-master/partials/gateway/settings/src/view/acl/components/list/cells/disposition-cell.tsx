//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Typography } from '@material-ui/core'

import { Config } from '@ues-gateway/shared'

import { DISPOSITION_LOCALIZATION_KEYS } from '../../../constants'
import type { CommonCellProps } from '../../../types'

const { GATEWAY_TRANSLATIONS_KEY } = Config

export const DispositionActionCell: React.FC<CommonCellProps> = ({ item }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  return (
    <Box display="flex" alignItems="center">
      <Typography>{t(DISPOSITION_LOCALIZATION_KEYS[item.disposition?.action])}</Typography>
    </Box>
  )
}
