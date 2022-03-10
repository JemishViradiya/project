//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { BoxProps } from '@material-ui/core'
import { Box, Button, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import { useBISPolicySchema } from '@ues-data/bis'
import { FeatureName, useFeatures, useMock } from '@ues-data/shared'
import type { UseControlledDialogProps } from '@ues/behaviours'

import { GATEWAY_TRANSLATIONS_KEY } from '../../config'
import AlertMigrationConfirmationDialog from './dialog'

interface AclMigrationAlertProps {
  containerProps?: BoxProps
}

export const AclMigrationAlert: React.FC<AclMigrationAlertProps> = ({ containerProps }) => {
  const [dialogId, setDialogId] = useState<UseControlledDialogProps['dialogId']>()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const { isEnabled } = useFeatures()
  const { isMigratedToACL } = useBISPolicySchema()

  // TODO remove once ACL is enabled globally. This is a work around to see the dialog in mock mode
  const mock = useMock()

  const shouldShowAlert = mock || (isEnabled(FeatureName.UESBigAclMigrationEnabled) && !isMigratedToACL)

  const openConfirmationDialog = () => setDialogId(Symbol(''))

  return shouldShowAlert ? (
    <>
      <Box mb={4} {...containerProps}>
        <Alert
          severity="info"
          action={
            <Button variant="contained" color="primary" onClick={openConfirmationDialog}>
              {t('acl.migrate.button')}
            </Button>
          }
        >
          <Typography variant="subtitle2">{t('acl.migrate.title')}</Typography>
          <Typography variant="body2">{t('acl.migrate.alertContent')}</Typography>
        </Alert>
      </Box>

      <AlertMigrationConfirmationDialog dialogId={dialogId} />
    </>
  ) : null
}
