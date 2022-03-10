import React from 'react'
import { Navigate, useNavigate } from 'react-router'

import type { FeatureName, IsFeatureEnabled } from '@ues-data/shared'
import { useFeatures } from '@ues-data/shared'

/**
 * useFeatureCheck hook accepts function to resolve feature enablement
 * If feature is loaded and resolved to false the user is redirected to the base page of current app
 */
export const useFeatureCheck = (isFeaturesEnabled: (isEnabled: IsFeatureEnabled) => boolean) => {
  const { isEnabled, getAllFeatures } = useFeatures()
  const navigate = useNavigate()
  if (getAllFeatures() !== [] && !isFeaturesEnabled(isEnabled)) navigate('/')
}

// Sometimes useFeatureCheck doesn't work properly because of navigate() - e.g On Second entry on disabled view
export const FeatureWrapper: React.FC<{ featureName: FeatureName }> = ({ children, featureName }) => {
  const { isEnabled, getAllFeatures } = useFeatures()
  return getAllFeatures() !== [] && !isEnabled(featureName) ? <Navigate to={'/'} /> : (children as React.ReactElement)
}
