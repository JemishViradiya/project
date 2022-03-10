//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Typography } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import { Components, Config, Data } from '@ues-gateway/shared'
import { ContentAreaPanel } from '@ues/behaviours'

import SplitTunnelingList from './split-tunneling-list'

const { DEFAULT_SPLIT_TUNNEL_ENABLED, GATEWAY_TRANSLATIONS_KEY } = Config
const { getLocalPolicyData, updateLocalPolicyData } = Data
const { EntityDetailsViewContext } = Components

const SplitTunneling: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const localPolicyData = useSelector(getLocalPolicyData)
  const dispatch = useDispatch()
  const { shouldDisableFormField } = useContext(EntityDetailsViewContext)

  return (
    <ContentAreaPanel title={t('policies.splitTunneling')}>
      <Typography>{t('policies.splitTunnelingInfoDescription')}</Typography>
      <Form
        initialValues={{
          splitTunnelEnabled: localPolicyData.splitTunnelEnabled ?? DEFAULT_SPLIT_TUNNEL_ENABLED,
        }}
        fields={[
          {
            type: 'switch',
            label: t('policies.splitTunneling'),
            name: 'splitTunnelEnabled',
            disabled: shouldDisableFormField,
            renderComponent: ({ fieldComponent, fieldValue: splitTunnelEnabled, fieldClassNames }) => (
              <>
                {fieldComponent}
                {splitTunnelEnabled === true && (
                  <Box className={fieldClassNames.secondary}>
                    <SplitTunnelingList />
                  </Box>
                )}
              </>
            ),
          },
        ]}
        onChange={({ formValues: { splitTunnelEnabled } }) => dispatch(updateLocalPolicyData({ splitTunnelEnabled }))}
        hideButtons
      />
    </ContentAreaPanel>
  )
}

export default SplitTunneling
