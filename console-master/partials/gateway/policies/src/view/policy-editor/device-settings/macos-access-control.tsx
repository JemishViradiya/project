//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Typography } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import { Components, Config, Data } from '@ues-gateway/shared'

const { EntityDetailsViewContext } = Components
const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getLocalPolicyData, updateLocalPolicyData } = Data

const MacOSAccessControl: React.FC = () => {
  const localPolicyData = useSelector(getLocalPolicyData)
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const dispatch = useDispatch()
  const { shouldDisableFormField } = useContext(EntityDetailsViewContext)

  return (
    <>
      <Typography variant="subtitle1" color="textPrimary">
        {t('policies.windowsBlackBerryProtect')}
      </Typography>
      <Form
        initialValues={{ protectRequired: localPolicyData.platforms?.macOS?.protectRequired ?? false }}
        fields={[
          {
            type: 'switch',
            label: t('policies.protectRequiredFieldLabel'),
            helpLabel: t('policies.protectRequiredFieldMacOSHelpLabel'),
            name: 'protectRequired',
            disabled: shouldDisableFormField,
          },
        ]}
        onChange={({ formValues }) => {
          dispatch(
            updateLocalPolicyData({
              platforms: {
                ...(localPolicyData?.platforms ?? {}),
                macOS: {
                  protectRequired: formValues.protectRequired,
                },
              },
            }),
          )
        }}
        hideButtons
      />
    </>
  )
}

export default MacOSAccessControl
