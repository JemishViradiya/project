import type React from 'react'
import { useLocation } from 'react-router-dom'

import type { FeatureName } from '@ues-data/shared'
import { useFeatures } from '@ues-data/shared'

type PathAndFeatureName = {
  path: string
  featureName: FeatureName
}

interface RoutesFilterHOCProps {
  children: any
  routesToRemoveIfDisabled: PathAndFeatureName[]
}

export const FeatureRoutesFilterHOC: React.FC<RoutesFilterHOCProps> = ({ children, routesToRemoveIfDisabled }) => {
  const features = useFeatures()
  const location = useLocation()

  const isBlocked = routesToRemoveIfDisabled
    .map(i => i.path && location.pathname.includes(i.path) && !features.isEnabled(i.featureName))
    .some(i => i)

  return isBlocked ? null : children
}
