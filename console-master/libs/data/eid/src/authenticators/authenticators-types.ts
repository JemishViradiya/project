export interface Authenticator {
  id?: string
  type: keyof typeof AuthenticationType
  name: string
  description?: string
  configuration?: OIDCClientConfiguartion | DUOMFAConfiguartion | OKTAMFAConfiguartion | TOTPConfiguration
  created?: string
  last_modified?: string
}

export interface OIDCClientConfiguartion {
  discovery_url: string
  client_authentication: {
    client_id: string
    jwks: Record<string, unknown>
    id_token_signed_response_alg: keyof typeof SigningType
  }
}

export interface DUOMFAConfiguartion {
  auth_api_hostname: string
  auth_secret_key: string
  auth_integration_key: string
  admin_api_hostname: string
  admin_secret_key: string
  admin_integration_key: string
  username_format: UsernameFormat
}
export interface OKTAMFAConfiguartion {
  auth_api_key: string
  auth_domain: string
}

export interface TOTPConfiguration {
  window: number
}

export enum UsernameFormat {
  USERNAME = 'USERNAME',
  EMAIL = 'EMAIL',
}

export enum AuthenticationType {
  ENTERPRISE = 'ENTERPRISE',
  AD = 'AD',
  LDAP = 'LDAP',
  CUR = 'CUR',
  VENUE = 'VENUE',
  OKTA = 'OKTA',
  PING = 'PING',
  DUO_MFA = 'DUO_MFA',
  OKTA_MFA = 'OKTA_MFA',
  TOTP = 'TOTP',
  // UEM = 'UEM',
  // BB2FA = 'BB2FA',
  // AZURE = 'AZURE',
  // OTP = 'OTP',
  // ZSO = 'ZSO',
  // KERBEROS = 'KERBEROS',
  // PING_MFA = 'PING_MFA',
  // DUO = 'DUO',
}
export enum SigningType {
  ES512 = 'ES512',
  ES384 = 'ES384',
  ES256 = 'ES256',
  RS256 = 'RS256',
}

export const Authenticator = void 0
