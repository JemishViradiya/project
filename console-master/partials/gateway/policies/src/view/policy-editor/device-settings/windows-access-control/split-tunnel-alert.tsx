//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import Alert from '@material-ui/lab/Alert'

import { AuthorizedAppInterfaceModeType } from '@ues-data/gateway'
import { Config, Data } from '@ues-gateway/shared'
import { StatusMedium } from '@ues/assets'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getLocalPolicyData } = Data

const SplitTunnelAlert: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const localPolicyData = useSelector(getLocalPolicyData)

  const showAlert =
    localPolicyData?.platforms?.Windows?.authorizedAppInterfaceMode === AuthorizedAppInterfaceModeType.ForceTunnel &&
    localPolicyData?.splitTunnelEnabled

  return showAlert ? (
    <Alert variant="outlined" severity="warning" icon={<StatusMedium />}>
      {t('policies.windowsAuthorizedAppInterfaceModeAlert')}
    </Alert>
  ) : null
}

export default SplitTunnelAlert
