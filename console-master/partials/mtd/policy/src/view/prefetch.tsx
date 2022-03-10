import React from 'react'
import { Outlet } from 'react-router-dom'

import { MtdPolicies, queryDeviceModels, queryDeviceOsVersions, queryWifiTypes } from '@ues-data/mtd'
import { UesReduxStore, useStatefulApolloQuery } from '@ues-data/shared'

import { MIN_OS, OS_FAMILY } from './common/settings'

UesReduxStore.mountSlice(MtdPolicies.slice)

export function PolicyPrefetch(): JSX.Element {
  console.log('prefetching device metadata')
  // prefetch device metadata
  useStatefulApolloQuery(queryDeviceOsVersions, {
    variables: { osFamily: OS_FAMILY.ANDROID, startOsVersion: MIN_OS.ANDROID },
  })
  useStatefulApolloQuery(queryDeviceOsVersions, { variables: { osFamily: OS_FAMILY.IOS, startOsVersion: MIN_OS.IOS } })
  useStatefulApolloQuery(queryDeviceModels, { variables: { osFamily: OS_FAMILY.ANDROID } })
  useStatefulApolloQuery(queryDeviceModels, { variables: { osFamily: OS_FAMILY.IOS } })

  // prefetch the wifi types
  useStatefulApolloQuery(queryWifiTypes, {})

  // TODO Place additional prefetches here - device hardware metadata, wifi settings ...
  return <Outlet />
}

export default PolicyPrefetch
