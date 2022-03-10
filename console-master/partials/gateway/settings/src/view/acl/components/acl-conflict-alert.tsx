//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import { Config, Data } from '@ues-gateway/shared'

const { GATEWAY_TRANSLATIONS_KEY } = Config

const { getHasAclVersionsConflict } = Data

const AclConflictAlert: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const hasAclVersionsConflict = useSelector(getHasAclVersionsConflict)

  return hasAclVersionsConflict ? (
    <Box mb={4}>
      <Alert severity="warning" variant="outlined">
        {t('acl.draftOutOfSyncAlertDescription')}
      </Alert>
    </Box>
  ) : null
}

export default AclConflictAlert
