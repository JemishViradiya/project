const OUTPUT_DIRECTORY = '../../libs/translations/external'

const RESX_LOCATION = 'venueRESX'
const JSON_LOCATION = 'venueJSON'

const VENUE_TRANS_LOC = 'venue'
const LOGIN_TRANS_LOC = 'login'
const PROVISIONING_TRANS_LOC = 'provisioning'
const GOOGLE_AUTH_TRANS_LOC = 'googleAuth'
const FIDO_WPF_TRANS_LOC = 'fidoWPF'

const CYLANCESERVER_I18N_LOCATION_VENUE = 'src/Resource/Cylance.L10n.LocalizedStrings.Venue'
const CYLANCESERVER_I18N_LOCATION_LOGIN = 'src/Resource/Cylance.L10n.LocalizedStrings.Login'
const PROVISIONING_I18N_LOCATION = 'src/Provisioning/Provisioning.Wpf/Properties/Langs'
const GOOGLE_AUTH_I18N_LOCATION = 'src/Cylance.Auth.CyGoogleAuth/Properties/Langs'
const FIDO_WPF_AUTH_I18N_LOCATION = 'src/Cylance.Auth.FidoWPF/Properties/Langs'

const LANGUAGES = ['en-US', 'de-DE', 'fr-FR', 'ja-JP', 'pt-BR', 'es-ES', 'it-IT', 'ko-KR', 'pt-PT']

const NAMESPACES_PROVISIONING = ['ProvisioningLang']

const NAMESPACES_GOOGLE_AUTH = ['CyGoogleAuthLang']

const NAMESPACES_FIDO_WPF = ['FidoWPFLang']

const NAMESPACES_LOGIN = ['EulaResources', 'SignIn']

const NAMESPACES_VENUE = [
  'Account',
  'AgentUpdate',
  'AppControlEvent',
  'Application',
  'AuditLog',
  'CertificateSafelist',
  'CertificateStorage',
  'Common',
  'Components',
  'Dashboard',
  'Device',
  'DynamicReport',
  'Email.ThreatNotification',
  'EnumDescriptions',
  'Error',
  'Exploratory',
  'GlobalList',
  'Integrations',
  'Menu',
  'OpticsFocus',
  'Policy',
  'PolicyOpticsTab',
  'Protection.Sidebar',
  'Resources',
  'Role',
  'Threat',
  'ThreatIndicator',
  'Tutorial',
  'User',
  'Zone',
]

module.exports = {
  OUTPUT_DIRECTORY,
  RESX_LOCATION,
  JSON_LOCATION,
  CYLANCESERVER_I18N_LOCATION_LOGIN,
  CYLANCESERVER_I18N_LOCATION_VENUE,
  PROVISIONING_I18N_LOCATION,
  GOOGLE_AUTH_I18N_LOCATION,
  FIDO_WPF_AUTH_I18N_LOCATION,
  LANGUAGES,
  NAMESPACES_LOGIN,
  NAMESPACES_VENUE,
  NAMESPACES_PROVISIONING,
  NAMESPACES_GOOGLE_AUTH,
  NAMESPACES_FIDO_WPF,
  LOGIN_TRANS_LOC,
  VENUE_TRANS_LOC,
  PROVISIONING_TRANS_LOC,
  GOOGLE_AUTH_TRANS_LOC,
  FIDO_WPF_TRANS_LOC,
}
