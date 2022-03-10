//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { useBISPolicySchema } from '@ues-data/bis'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { Config, Hooks } from '@ues-gateway/shared'
import { ButtonGroupNav } from '@ues/behaviours'

import { NetworkServicesList as NetworkServicesListV2 } from './v2'
import { NetworkServicesList as NetworkServicesListV3 } from './v3'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { useBigPermissions, BigService } = Hooks

const NetworkServices: React.FC = () => {
  useBigPermissions(BigService.NetworkServices)
  const { isMigratedToACL } = useBISPolicySchema()
  const { isEnabled } = useFeatures()

  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const buttons = [
    {
      label: t('acl.labelAclRules'),
      component: <NetworkServicesListV3 />,
      description: t('networkServices.networkServicesV3Note'),
    },
    {
      label: t('policies.networkAccessControl'),
      component: <NetworkServicesListV2 />,
      description: t('networkServices.networkServicesV2Note'),
    },
  ]

  if (isMigratedToACL) {
    return <NetworkServicesListV3 />
  } else {
    return !isEnabled(FeatureName.UESBigAclMigrationEnabled) ? <NetworkServicesListV2 /> : <ButtonGroupNav items={buttons} />
  }
}

export default NetworkServices
