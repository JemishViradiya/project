import { useNavigate } from 'react-router'

import { FeatureName, useFeatures } from '@ues-data/shared'
import type { MobileAlertsFilters } from '@ues-mtd/shared'

interface NavProps {
  features
  navigate
}

export function useFeatureNavigation(): NavProps {
  return { features: useFeatures(), navigate: useNavigate() }
}

export const mobileAlertNavigate = (navProps: NavProps, query): void => {
  const { features, navigate } = navProps
  const singleNxAppNavigation = features.isEnabled(FeatureName.SingleNXApp)

  if (singleNxAppNavigation) {
    navigate('/mobile-alerts?' + new URLSearchParams((query as MobileAlertsFilters) as string).toString())
  } else {
    window.location.assign('uc/mtd#/mobile-alerts?' + new URLSearchParams((query as MobileAlertsFilters) as string).toString())
  }
}

export const mobileDevicesAlertsNavigate = (navProps: NavProps, endpointId, query): void => {
  const { features, navigate } = navProps
  const singleNxAppNavigation = features.isEnabled(FeatureName.SingleNXApp)

  if (singleNxAppNavigation) {
    navigate(`/mobile-devices/${endpointId}/alerts?` + new URLSearchParams((query as MobileAlertsFilters) as string).toString())
  } else {
    window.location.assign(
      `uc/platform#/mobile-devices/${endpointId}/alerts?` +
        new URLSearchParams((query as MobileAlertsFilters) as string).toString(),
    )
  }
}
