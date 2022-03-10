export const FEATURE_REQUEST = '@Cylance/feature/FEATURE_REQUEST'
export const FEATURE_SET = '@Cylance/feature/FEATURE_SET'
export const FEATURE_WIPE = '@Cylance/feature/FEATURE_WIPE'

export const requestFeatures = featureList => ({
  type: FEATURE_REQUEST,
  payload: featureList,
})

export const setFeatures = featureList => ({
  type: FEATURE_SET,
  payload: featureList,
})

export const wipeFeatures = () => ({
  type: FEATURE_WIPE,
})
