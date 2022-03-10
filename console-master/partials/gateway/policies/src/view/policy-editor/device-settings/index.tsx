//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { FeatureName, useFeatures } from '@ues-data/shared'
import { Config } from '@ues-gateway/shared'
import { ButtonGroupNav, ContentAreaPanel } from '@ues/behaviours'

import AndroidAccessControl from './android-access-control'
import MacOSAccessControl from './macos-access-control'
import WindowsAccessControl from './windows-access-control'

const { GATEWAY_TRANSLATIONS_KEY } = Config

const DeviceSettings: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY, 'general/form'])
  const { isEnabled } = useFeatures()

  const buttons = [
    { label: t('policies.androidAccessControlTitle'), component: <AndroidAccessControl /> },
    {
      label: t('general/form:os.macos'),
      component: <MacOSAccessControl />,
      hidden: !isEnabled(FeatureName.UESBigMacOSProtectEnabled),
    },
    { label: t('policies.windowsAccessControlTitle'), component: <WindowsAccessControl /> },
  ]

  return (
    <ContentAreaPanel title={t('policies.deviceSettings')}>
      <ButtonGroupNav items={buttons} />
    </ContentAreaPanel>
  )
}

export default DeviceSettings
