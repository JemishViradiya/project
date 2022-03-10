//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@material-ui/core'

import type { NetworkServicesV2 } from '@ues-data/gateway'
import { Config } from '@ues-gateway/shared'
import { DialogChildren, useControlledDialog } from '@ues/behaviours'

import ServiceDetails from '../service-details'

const { GATEWAY_TRANSLATIONS_KEY } = Config

interface ServiceDetailsModalProps {
  onClose: () => void
  dialogId: symbol
  data: Partial<NetworkServicesV2.NetworkServiceEntity>
}

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({ onClose: closeHandler, dialogId, data }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const { open, onClose } = useControlledDialog({
    dialogId: dialogId,
    onClose: closeHandler,
  })

  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
      <DialogChildren
        title={t('networkServices.labelNetworkServiceNameLink', {
          name: data?.name ?? '',
        })}
        content={<ServiceDetails data={data} />}
        actions={
          <Button variant="contained" size="medium" color="primary" onClick={onClose}>
            {t('general/form:commonLabels.close')}
          </Button>
        }
      />
    </Dialog>
  )
}

export default ServiceDetailsModal
