import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { useMock } from '../lib'
import { initializeFeatures } from './store/persistence-layer'
import type { Feature, FeatureName, FeaturesState } from './store/types'

export type IsFeatureEnabled = (featureCode: FeatureName) => boolean

export type FeaturizationProps = {
  isEnabled: IsFeatureEnabled
  getFeatures: (featureKeys: FeatureName[]) => Feature[]
  getAllFeatures: () => Feature[]
}

const FeaturizationContext = createContext<FeaturizationProps>({
  isEnabled: (key: FeatureName) => false,
  getFeatures: (featureKeys: FeatureName[]) => [],
  getAllFeatures: () => [],
})

export const useFeatures = () => useContext(FeaturizationContext)

const ref: React.MutableRefObject<FeaturesState> = {
  current: {
    features: [],
    overrides: [],
    loaded: false,
    initializationPromise: undefined,
  },
}

export const FeaturizationProvider: React.FC<{ loadingElement?: React.ReactNode; mock?: true }> = ({
  children,
  loadingElement,
  mock: mockProp,
}) => {
  const [allFeatures, setAllFeatures] = useState(() => ref.current?.features ?? [])
  const mock = useMock() || mockProp

  useEffect(() => {
    ref.current.initializationPromise = ref.current.initializationPromise ?? initializeFeatures(ref, mock, setAllFeatures)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const featureProps = useMemo(() => {
    return {
      isEnabled: (key: FeatureName) => allFeatures?.find(f => f.name === key)?.enabled ?? false,
      getFeatures: (featureKeys: FeatureName[]) => allFeatures?.filter(f => featureKeys.includes(f.name)) ?? [],
      getAllFeatures: () => allFeatures ?? [],
    }
  }, [allFeatures])

  if (!ref.current?.loaded && loadingElement) {
    return <>{loadingElement}</>
  }

  return <FeaturizationContext.Provider value={featureProps}>{children}</FeaturizationContext.Provider>
}

export const getCurrentFeatures = () => ref.current.features
