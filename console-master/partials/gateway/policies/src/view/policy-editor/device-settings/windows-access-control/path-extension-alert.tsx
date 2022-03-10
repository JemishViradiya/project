//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import cn from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Alert from '@material-ui/lab/Alert'

import { Config } from '@ues-gateway/shared'
import { StatusMedium } from '@ues/assets'

import useStyles from './styles'

const { GATEWAY_TRANSLATIONS_KEY } = Config

const PathExtensionAlert: React.FC<{ isFormValid: boolean; paths: string[] }> = ({ isFormValid, paths }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const classes = useStyles()

  const showAlert =
    isFormValid &&
    paths.length > 0 &&
    paths
      .map(path => {
        const splitted = path.split('.')
        return (splitted[splitted.length - 1] ?? '').toLowerCase() !== 'exe'
      })
      .some(Boolean)

  return (
    <Alert
      className={cn({
        [classes.hidden]: !showAlert,
      })}
      variant="outlined"
      severity="warning"
      icon={<StatusMedium />}
    >
      {t('policies.windowsPathExeWarningMessage')}
    </Alert>
  )
}

export default PathExtensionAlert
