import { resolveOverrideEnvironmentValue } from '../../shared/overrideEnvironmentVariable'
import { tryWithSessionContextPrefetch } from '../../shared/session-context-prefetch'
import { FeaturesApi } from './common'
import { mockFeatures } from './mock'
import type { FeaturesState } from './types'
import { FeatureName } from './types'

const loadFeatureOverrides = (state: FeaturesState): FeaturesState => {
  const overrides = Object.values(FeatureName)
    .map((name: FeatureName) => {
      const { value } = resolveOverrideEnvironmentValue(name)

      return value ? { name, enabled: value === 'true' } : undefined
    })
    .filter(value => value)
  state.overrides = overrides
  return state
}

export const applyOverrides = <T extends FeaturesState>(state: T) => {
  if (!state.features) return state
  state?.overrides?.forEach(override => {
    let index = state.features.findIndex(item => item.name === override.name)
    if (index === -1) index = state.features.length
    state.features[index] = { ...override }
  })
  return state
}

export const getDefaultState = () => applyOverrides(loadFeatureOverrides({}))

export const initializeFeatures = async (ref, mock, setState) => {
  let fetchedFeatures
  if (mock) {
    fetchedFeatures = mockFeatures
  } else {
    fetchedFeatures = await tryWithSessionContextPrefetch(context => context.features, FeaturesApi.getFeatures)
  }
  ref.current = { ...ref.current, ...processFeatures(fetchedFeatures), loaded: true }
  setState(ref.current.features)
}

const processFeatures = loadedFeatures => {
  return applyOverrides(loadFeatureOverrides({ features: loadedFeatures }))
}
