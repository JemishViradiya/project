import { authTypeFrom, authTypeTo } from './externalAuthIdType'

const externalAuthSettingsModelTo = formModel => {
  return {
    externalAuthProviderId: authTypeTo[formModel.provider] || 0,
    loginUrl: formModel.loginUrl,
    partnerId: formModel.partnerId,
    enabled: formModel.isEnabled,
    x509Certificate: formModel.x509Certificate,
    allowPasswordLogin: formModel.allowPasswordLogin,
  }
}

const externalAuthSettingsModelFrom = serverModel => {
  return {
    provider: authTypeFrom[serverModel.externalAuthProviderId],
    loginUrl: serverModel.loginUrl,
    isEnabled: serverModel.enabled,
    x509Certificate: serverModel.x509Certificate,
    x509CertificateFingerprint: serverModel.thumbprint,
    allowPasswordLogin: serverModel.allowPasswordLogin,
  }
}

export { externalAuthSettingsModelTo, externalAuthSettingsModelFrom }
