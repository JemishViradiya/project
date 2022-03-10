import { useBISPolicySchema } from '@ues-data/bis'
import { FeatureName, useFeatures } from '@ues-data/shared'

const useActorDPEnabled = (): boolean => {
  const { isEnabled } = useFeatures()
  const { isMigratedToDP } = useBISPolicySchema()

  return isEnabled(FeatureName.UESActionOrchestrator) && isMigratedToDP
}

export default useActorDPEnabled
