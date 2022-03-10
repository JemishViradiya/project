import useClientParams from './useClientParams'

const CAPABILITIES_KEY = 'capabilities'
const NO_CAPABILITIES = []

export const capability = {
  POLICIES: 'policies',
  IP_ADDRESS: 'ipAddress',
  RISK_ENGINES_SETTINGS: 'riskEngineSettings',
  OPERATING_MODE: 'operatingMode',
  DATA_RETENTION: 'dataRetention',
  PRIVACY_MODE: 'privacyMode',
}

const useCapability = (...capabilitiesChecklist) => {
  const userCapabilities = useClientParams(CAPABILITIES_KEY) || NO_CAPABILITIES
  return capabilitiesChecklist.map(capability => userCapabilities.includes(capability))
}

export default useCapability
