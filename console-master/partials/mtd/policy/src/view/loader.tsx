/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'

import { queryDeviceModels, queryDeviceOsVersions, queryWifiTypes } from '@ues-data/mtd'
import { useStatefulApolloQuery } from '@ues-data/shared'
import { PageProgress } from '@ues/behaviours'

import { getI18Name, useTranslation } from './common/i18n'
import { MIN_OS, OS_FAMILY } from './common/settings'

export default function PolicyLoader({ Component }) {
  const { t } = useTranslation()

  const { loading: loading_devicemodel_android } = useStatefulApolloQuery(queryDeviceModels, {
    variables: { osFamily: OS_FAMILY.ANDROID },
  })

  const { loading: loading_devicemodel_ios } = useStatefulApolloQuery(queryDeviceModels, { variables: { osFamily: OS_FAMILY.IOS } })

  const { loading: loading_deviceos_android } = useStatefulApolloQuery(queryDeviceOsVersions, {
    variables: { osFamily: OS_FAMILY.ANDROID, startOsVersion: MIN_OS.ANDROID },
  })

  const { loading: loading_deviceos_ios } = useStatefulApolloQuery(queryDeviceOsVersions, {
    variables: { osFamily: OS_FAMILY.IOS, startOsVersion: MIN_OS.IOS },
  })

  const { loading: loading_wifi_android } = useStatefulApolloQuery(queryWifiTypes, {})

  if (
    loading_devicemodel_android ||
    loading_devicemodel_ios ||
    loading_deviceos_android ||
    loading_deviceos_ios ||
    loading_wifi_android
  ) {
    return <PageProgress message={t(getI18Name('busyLoading'))} />
  }
  return Component
}
