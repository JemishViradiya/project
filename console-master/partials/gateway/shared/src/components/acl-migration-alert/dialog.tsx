//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useEffect, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Box, Dialog, Typography } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import { usePrevious } from '@ues-behaviour/react'
import { useBISPolicySchema } from '@ues-data/bis'
import type { UseControlledDialogProps } from '@ues/behaviours'
import { DialogChildren, useControlledDialog, useSnackbar } from '@ues/behaviours'

import { GATEWAY_TRANSLATIONS_KEY } from '../../config'
import { isTaskRejected, isTaskResolved } from '../../utils'

const STEP_TRANSLATION_KEYS = [
  'acl.migrate.confirmationContentStep1',
  'acl.migrate.confirmationContentStep2',
  'acl.migrate.confirmationContentStep3',
]

const AlertMigrationConfirmationDialog: React.FC<Pick<UseControlledDialogProps, 'dialogId'>> = ({ dialogId }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY, 'general/form'])
  const { enqueueMessage } = useSnackbar()
  const {
    migrateToDPAndACL,
    migrateToDPAndACLResult: { loading, error },
  } = useBISPolicySchema()

  const task = useMemo(() => ({ loading, error }), [loading, error])
  const previousTask = usePrevious(task)

  const { open, onClose } = useControlledDialog({ dialogId })

  useEffect(() => {
    if (isTaskResolved(task, previousTask)) {
      onClose()
      enqueueMessage(t('acl.migrate.notificationSuccessLabel'), 'success')
    }

    if (isTaskRejected(task, previousTask)) {
      enqueueMessage(t('acl.migrate.notificationErrorLabel'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task])

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogChildren
        title={t('acl.migrate.title')}
        description={t('acl.migrate.confirmationDescription')}
        onClose={onClose}
        content={
          <>
            {STEP_TRANSLATION_KEYS.map(translationKey => (
              <Box my={8}>
                <Trans i18nKey={translationKey} t={t}>
                  <Typography variant="subtitle2" gutterBottom>
                    Placeholder
                  </Typography>
                  <Typography>Placeholder</Typography>
                </Trans>
              </Box>
            ))}

            <Form
              fields={[
                {
                  type: 'checkbox',
                  name: 'confirm',
                  label: t('acl.migrate.confirmationCheckboxLabel'),
                  validationRules: { required: { value: true, message: ' ' } },
                },
              ]}
              onSubmit={migrateToDPAndACL}
              onCancel={onClose}
              submitButtonLabel={t('acl.migrate.button')}
              isLoading={loading}
            />
          </>
        }
      />
    </Dialog>
  )
}

export default AlertMigrationConfirmationDialog
