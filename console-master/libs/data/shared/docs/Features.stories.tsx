import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import { FeatureName, FeaturizationApi, FeaturizationProvider, MockProvider, UesReduxStore, useFeatures } from '@ues-data/shared'

const decorator = Story => (
  <MockProvider value={true}>
    <ReduxProvider store={UesReduxStore}>
      <Story />
    </ReduxProvider>
  </MockProvider>
)

export default {
  title: 'Features',
  decorators: [decorator],
}

export const FeaturesApi = () => {
  const Features = () => {
    const { isEnabled, getFeatures, getAllFeatures } = useFeatures()

    return (
      <section>
        <h3>Feature provider</h3>
        <p>
          Use the <b>useFeatures()</b> hook to get access to <b>isEnabled</b>, <b>getFeatures</b>, <b>getAllFeatures</b> methods.
        </p>
        <p>
          <b>isEnabled</b> accepts feature key and returns true if feature is enabled (if present)
        </p>
        <pre>{JSON.stringify(isEnabled(FeatureName.ReferenceDiagnostic), null, 2)}</pre>

        <p>
          <b>getFeatures</b> accepts array of feature keys and returns Feature objects
        </p>
        <pre>{JSON.stringify(getFeatures([FeatureName.ReferenceDiagnostic]), null, 2)}</pre>

        <p>
          <b>getAllFeatures</b> returns all Feature objects
        </p>
        <pre>{JSON.stringify(getAllFeatures(), null, 2)}</pre>
        <br />
        <p>
          Or use <b>FeaturizationApi</b> to get features directly from Redux store.
        </p>

        <p>
          <b>isFeatureEnabled</b> accepts feature key and returns true if feature is enabled (if present)
        </p>
        <pre>{JSON.stringify(FeaturizationApi.isFeatureEnabled(FeatureName.ReferenceDiagnostic), null, 2)}</pre>

        <p>
          <b>getFeaturesByKeys</b> accepts array of feature keys and returns Feature objects
        </p>
        <pre>{JSON.stringify(FeaturizationApi.getFeaturesByKeys([FeatureName.ReferenceDiagnostic]), null, 2)}</pre>

        <p>
          <b>getAllFeatures</b> returns all Feature objects
        </p>
        <pre>{JSON.stringify(FeaturizationApi.getAllFeatures(), null, 2)}</pre>
      </section>
    )
  }

  return (
    <FeaturizationProvider>
      <Features />
    </FeaturizationProvider>
  )
}
