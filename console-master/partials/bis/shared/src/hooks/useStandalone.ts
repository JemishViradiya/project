import once from 'lodash/once'

import { resolveOverrideEnvironmentVariable } from '@ues-data/shared'

const UES_ORIGIN_PATTERNS = [/[-.]ues\./, /\.cylance\.com$/, /ues-console-sites\..+\.net$/]

const useStandalone = once(() => {
  const { enabled } = resolveOverrideEnvironmentVariable('UES_BIS_STANDALONE')
  return enabled || UES_ORIGIN_PATTERNS.every(pattern => !pattern.test(window.location.origin))
})

export default useStandalone
