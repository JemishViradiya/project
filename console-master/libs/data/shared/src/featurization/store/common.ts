import { UesAxiosClient } from '../../network/axios'

export const FeaturesApi = {
  getFeatures: async () => {
    const features = await UesAxiosClient().get('platform/v1/featurization', {})
    return features.data
  },
}
