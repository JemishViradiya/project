import { getCurrentFeatures } from './featurizationProvider'
import type { FeatureName } from './store/types'

// Request features directly from redux storage
export const isFeatureEnabled = (key: FeatureName) => getCurrentFeatures().find(f => f.name === key)?.enabled ?? false

export const getFeaturesByKeys = (featureKeys: FeatureName[]) => getCurrentFeatures().filter(f => featureKeys.includes(f.name))

export const getAllFeatures = () => getCurrentFeatures()
