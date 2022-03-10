//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */

import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Box, Button, Dialog, Link, Typography } from '@material-ui/core'

import { UesSessionApi } from '@ues-data/shared'
import { Config } from '@ues-gateway/shared'
import { BasicCopy as FileCopy } from '@ues/assets'
import { DialogChildren, useControlledDialog, useSnackbar } from '@ues/behaviours'

const { GATEWAY_TRANSLATIONS_KEY } = Config

export interface AddConnectorDialogProps {
  dialogId: symbol
}

/**
 * @description The purpose of this dialog is to display the instructions to
 * an end user to explain how to add new BIG egress connector
 */
const AddConnectorDialog: React.FC<AddConnectorDialogProps> = ({ dialogId }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const { open, onClose } = useControlledDialog({ dialogId })

  const { enqueueMessage } = useSnackbar()

  // Want to get everything before the URL query
  const redirectUrl = UesSessionApi.SessionStartUrl().split('%3F')[0]
  const onCopyLink = () => {
    try {
      navigator.clipboard.writeText(redirectUrl)
      enqueueMessage(t('common.copiedToClipboard'), 'success')
    } catch {
      enqueueMessage(t('common.failedToCopyToClipboard'), 'error')
    }
  }

  return (
    <Dialog maxWidth={'md'} open={open} onClose={onClose}>
      <DialogChildren
        title={t('connectors.addConnector')}
        onClose={onClose}
        content={
          <>
            <Typography variant="subtitle2">{t('connectors.addConnectorSetup.stepNumber', { '0': 1 })}</Typography>
            <Typography>{t('connectors.addConnectorSetup.downloadText')}</Typography>

            <p />
            <Typography variant="subtitle2">{t('connectors.addConnectorSetup.stepNumber', { '0': 2 })}</Typography>
            <Trans i18nKey="connectors.addConnectorSetup.adminGuideText" t={t}>
              <Typography>Placeholder</Typography>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.blackberry.com/en/unified-endpoint-security/console/help/gateway-install-connector"
              />
            </Trans>

            <p />
            <Typography variant="subtitle2">{t('connectors.addConnectorSetup.stepNumber', { '0': 3 })}</Typography>
            <Typography>{t('connectors.addConnectorSetup.connectorUrlText')}</Typography>
            <Box p={3}>
              <Typography>{redirectUrl}</Typography>
            </Box>
            <Box mt={3} mb={3}>
              <Button aria-label="Copy URL" variant="contained" color="primary" onClick={onCopyLink} startIcon={<FileCopy />}>
                {t('connectors.addConnectorSetup.copyUrl')}
              </Button>
            </Box>
          </>
        }
      ></DialogChildren>
    </Dialog>
  )
}

export default AddConnectorDialog
