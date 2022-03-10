import {
  committedAclRulesMock,
  gatewayAppPolicyMock,
  networkAccessControlPolicyMock,
  networkServicesMock,
} from '@ues-data/gateway/mocks'

export enum CONDITIONS {
  BE_VISIBLE = 'be.visible',
  EXIST = 'exist',
  NOT_BE_VESIBLE = 'not.be.visible',
  NOT_EXIST = 'not.exist',
  BE_EMPTY = 'be.empty',
  HAVE_LENGTH = 'have.length',
  NOT_HAVE_LENGTH = 'not.have.length',
  MATCH = 'match',
  CONTAIN = 'contain',
  EQUAL = 'equal',
  BE_SELECTED = 'be.selected',
  BE_DISABLED = 'be.disabled',
  HAVE_ATTRIBUTE = 'have.attr',
  HAVE_TEXT = 'have.text',
}

export const STANDARD_TIMEOUT = 15000
export const COMMON_ADD_BUTTON = 'common.buttonAdd'
export const COMMON_AUTHORIZE_BUTTON = 'common.buttonAuthorize'
export const COMMON_COPY_BUTTON = 'common.copy'
export const COMMON_DELETE_BUTTON = 'common.buttonDelete'
export const COMMON_EDIT_BUTTON = 'common.buttonEdit'
export const COMMON_SAVE_CHANGES_BUTTON = 'common.buttonSave'
export const COMMON_CANCEL_BUTTON = 'common.buttonCancel'
export const COMMON_DESTINATION_LABEL = 'common.destination'
export const COMMON_TRANSFERRED_LABEL = 'common.transferred'
export const COMMON_USER_LABEL = 'common.user'
export const COMMON_ACTION_LABEL = 'common.action'
export const COMMON_ADD_IP_BUTTON_LABEL = 'common.ipAddressAdd'
export const COMMON_ALLOWED_LABEL = 'common.allowed'
export const COMMON_BLOCKED_LABEL = 'common.blocked'
export const COMMON_START_TIME_LABEL = 'common.startTime'
export const COMMON_DATE_RANGE_LABEL = 'common.dateRange'
export const COMMON_SOURCE_LABEL = 'common.source'
export const COMMON_STATUS_LABEL = 'common.labelStatus'
export const COMMON_NAME_LABEL = 'common.name'
export const COMMON_OFFLINE_LABEL = 'common.offline'
export const COMMON_ONLINE_LABEL = 'common.online'
export const COMMON_NOT_NOW = 'common.notNow'
export const COMMON_IP_RANGES = 'common.ipAddressesRangesCidrs'
export const COMMON_IP_ADDRESSES = 'common.labelIpAddressesRangesCidrs'
export const COMMON_ORDER_LABEL = 'common.order'
export const COMMON_DESCRIPTION_LABEL = 'common.description'

// MOCKs
export const EDITED_NETWORK_SERVICE_DATA = networkServicesMock.find(({ id }) => id === '667dea75-g123-47i5-b34u-2978a66u989d')
export const EDITED_ACL_RULE_DATA = committedAclRulesMock.find(({ id }) => id === '48a210bb-d13b-4c93-8f3b-391dae43bd13')

// Events URLs
export const EVENTS_URL = '#/events'

// Settings URLs
export const ACL_COMMITTED_URL = '#/settings/network/acl/committed'
export const ACL_DRAFT_URL = '#/settings/network/acl/draft'
export const ACL_DRAFT_ADD_URL = '#/settings/network/acl/draft/add'
export const ACL_DRAFT_EDIT_URL = `#/settings/network/acl/draft/${EDITED_ACL_RULE_DATA.id}`
export const ACL_DRAFT_COPY_URL = `#/settings/network/acl/draft/copy/${EDITED_ACL_RULE_DATA.id}`
export const ACL_COMMITTED_ADD_URL = '#/settings/network/acl/committed/add'
export const ACL_COMMITTED_EDIT_URL = `#/settings/network/acl/committed/${EDITED_ACL_RULE_DATA.id}`
export const ACL_COMMITTED_COPY_URL = `#/settings/network/acl/committed/copy/${EDITED_ACL_RULE_DATA.id}`
export const CLIENT_DNS_URL = '#/settings/network/dns-suffixes'
const CONNECTOR_ID = '52087fa844b04b79b8113aa7b3a9f37a'
export const EDIT_CONNECTOR_URL = `#/settings/network/private-network/connectors/${CONNECTOR_ID}`
export const CONNECTOR_URL = '#/settings/network/private-network/connectors'
export const CREATE_CONNECTOR_URL =
  '#/settings/network/private-network/connectors/createconnector?connectorUrl=aHR0cHM6Ly9sb2NhbC5ob3N0'
export const CONNECTORS_OLD_URL = '#/settings/network/connectors'
export const CREATE_CONNECTOR_OLD_URL = '#/settings/network/connectors/createconnector?connectorUrl=aHR0cHM6Ly9sb2NhbC5ob3N0'
export const EDIT_CONNECTOR_OLD_URL = `#/settings/network/connectors/${CONNECTOR_ID}`
export const NETWORK_PROTECTION_URL = '#/settings/network/network-protection'
export const NETWORK_SERVICES_URL = '#/settings/network/network-services'
export const ADD_NETWORK_SERVICES_URL = '#/settings/network/network-services/add'
export const EDIT_NETWORK_SERVICES_URL = `#/settings/network/network-services/${EDITED_NETWORK_SERVICE_DATA.id}`
export const PRIVATE_NETWORK_DNS_URL = '#/settings/network/private-network/dns'
export const PRIVATE_NETWORK_IP_RANGE_URL = '#/settings/network/private-network/ip-range'
export const PRIVATE_NETWORK_ROUTING_URL = '#/settings/network/private-network/routing'
export const SOURCE_IP_ANCHORING_URL = '#/settings/network/ip-pinning'

// Policies URLs
export const ADD_GATEWAY_SERVICE_POLICY_URL = '#/gatewayService/add'
export const EDIT_GATEWAY_SERVICE_POLICY_URL = `#/gatewayService/${gatewayAppPolicyMock[0].id}`
export const ADD_NAC_POLICY_URL = '#/networkAccessControl/add'
export const EDIT_NAC_POLICY_URL = `#/networkAccessControl/${networkAccessControlPolicyMock[0].id}`

// Settings translation keys
export const CLIENT_DNS_TAB = 'dns.clientDNS'
export const CONNECTORS_TAB = 'networkServices.labelGatewayConnectors'
export const NETWORK_PROTECTION_TAB = 'protection.labelProtection'
export const NETWORK_SERVICES_TAB = 'common.networkServices'
export const PRIVATE_NETWORK_DNS_TAB = 'dns.privateNetworkDns'
export const PRIVATE_NETWORK_TAB = 'privateNetwork.labelPrivateNetworkRouting'
export const SOURCE_IP_ANCHORING_TAB = 'networkServices.labelSourceIPAnchoring'
export const NETWORK_SERVICES_V3_DESCRIPTION = 'networkServices.networkServicesV3Note'
export const NETWORK_SERVICES_V2_DESCRIPTION = 'networkServices.networkServicesV2Note'
export const DNS_SUFFIX_SWITCH_LABEL = 'dnsSuffixEnabled'
export const DNS_SUFFIX_ADD_BUTTON_LABEL = 'dns.dnsSuffixAdd'
export const ACL_NOTIFY_FIELD_LABEL = 'acl.notifyFieldLabel'
export const ACL_NOTIFY_MESSAGE_FIELD_LABEL = 'acl.notifyMessageFieldLabel'
export const ACL_MIGRATION_BUTTON_LABEL = 'acl.migrate.button'
export const ACL_MIGRATION_CHECKBOX_LABEL = 'acl.migrate.confirmationCheckboxLabel'
export const PROTECTION_SWITCH_LABEL = 'intrusionProtectionEnabled'
export const PRIVATE_DNS_ADD_BUTTON_TEXT = 'dns.dnsServerAdd'
export const PRIVATE_DNS_ADD_FORWARD_ZONE_BUTTON_TEXT = 'dns.forwardZoneAdd'
export const PRIVATE_DNS_ADD_REVERSE_ZONE_BUTTON_TEXT = 'dns.reverseZoneAdd'
export const PRIVATE_DNS_ADD_SERVER_TAB_TEXT = 'dns.dnsServers'
export const PRIVATE_DNS_FORWARD_ZONE_TAB_TEXT = 'dns.dnsForwardLookupZone'
export const PRIVATE_DNS_REVERSE_ZONE_TAB_TEXT = 'dns.dnsReverseLookupZone'
export const PRIVATE_ROUTE_ADD_BUTTON = 'privateNetwork.labelAddRoute'
export const COMMITTED_RULES_DESC = 'acl.labelAclRulesTopLevelCommittedDescription'
export const DRAFT_RULES_DESC = 'acl.labelAclRulesTopLevelDraftDescription'
export const COMMITTED_ACTION_DESC = 'acl.commitActionPromptDescription'
export const COMMIT_DRAFT_SUCCESS_MESSAGE = 'acl.commitDraftSuccessMessage'
export const CREATE_DRAFT_SUCCESS_MESSAGE = 'acl.createDraftSuccessMessage'
export const CREATE_DRAFT_AND_SAVE_SUCCESS_MESSAGE = 'acl.createAclRuleSuccessMessage'
export const UPDATE_RULE_SUCCESS_MESSAGE = 'acl.updateAclRuleSuccessMessage'
export const LAST_MODIFIED_RULE = 'acl.lastModifiedAtOnlyDateLabel'
export const ADD_RULE = 'acl.labelAddRule'
export const ENABLE_RULE_FIELD = 'acl.enabledField'
export const COMMITTED_RULES = 'acl.committed'
export const DRAFT_RULES = 'acl.draft'
export const DISCARD_DRAFT = 'acl.discardDraft'
export const COMMIT_RULES = 'acl.commitActionPromptTitle'
export const COMMITTED_ALERT_MESSAGE = 'acl.committedListReadOnlyAlertMessage'
export const COPY_RULE_BELOW = 'acl.labelCopyRuleBelow'
export const ADD_RULE_BELOW = 'acl.labelAddRuleBelow'
export const DELETE_RULE = 'acl.deleteRule'
export const DEFAULT_RULE_DESC = 'acl.defaultAclRuleDescription'
export const ACL_RULES_LABEL = 'acl.labelAclRules'

// Policies translation keys
export const POLICIES_ADD_USER_OR_GROUPS = 'profiles:policy.assignment.add'
export const POLICIES_APPLIED_USERS_GROUPS = 'profiles:policy.detail.appliedUsersAndGroups'
export const POLICIES_CREATE_CONFIRMATION = 'policies.createPolicyConfirmationDescription'
export const POLICIES_DELETE_BUTTON = 'profiles:policy.deleteButton'
export const POLICIES_DELETE_TOOLTIP = 'policies.deletePolicyTooltip'
export const POLICIES_GATEWAY_SERVICE_TAB = 'profiles:navigation.gatewayService.label'
export const POLICIES_NETWORK_ACCESS_CONTROL_TAB = 'profiles:navigation.networkAccessControl.label'
export const POLICIES_NEW_POLICY_BUTTON_ADD = 'profiles:policy.list.add'
export const POLICIES_RANK = 'profiles:policy.list.rank'
export const POLICIES_SUCCESS_CREATION = 'policies.createPolicySuccessMessage'
export const POLICIES_NAC_LABEL = 'policies.networkAccessControl'
export const COMMON_APPLICATION_IDS = 'common.applicationIds'
export const POLICIES_ANDROID_PER_APP_SWITCH_LABEL = 'androidPerAppVpnEnabled'
export const POLICIES_SPLIT_TUNNEL_SWITCH_LABEL = 'splitTunnelEnabled'
export const POLICIES_WINDOWS_AUTH_APP_SWITCH_LABEL = 'authorizedAppInterfaceMode'
export const POLICIES_WINDOWS_UNAUTH_APP_SWITCH_LABEL = 'unauthorizedAppInterfaceMode'
export const POLICIES_WINDOWS_INCOMING_CONNECTIONS_SWITCH_LABEL = 'incomingConnections'
export const POLICIES_WINDOWS_PROTECT_SWITCH_LABEL = 'protectRequired'
export const POLICIES_CIDR_ADDRESSES = 'policies.cidrAddresses'
export const POLICIES_WINDOWS_OTHER_USERS_LABEL = 'otherUserMode'
export const POLICIES_WINDOWS_PER_APP_VPN = 'windowsPerAppVpn'
export const POLICIES_WINDOWS_ADD_PATH = 'policies.windowsAddPath'
export const POLICIES_WINDOWS_ADD_PFN = 'policies.windowsAddPFN'
export const POLICIES_WINDOWS_PATHS = 'policies.path'
export const POLICIES_WINDOWS_PFN = 'policies.windowsPFN'
export const POLICIES_WINDOWS_CONTROL = 'policies.windowsAccessControlTitle'
export const POLICIES_MACOS_CONTROL = 'general/form:os.macos'
export const POLICIES_MACOS_SWITCH_LABEL = 'protectRequired'

// Events translation keys
export const EVENTS_SELECT_GROUP_BY_DEFAULT = 'events.groupByDefault'
export const EVENTS_ANOMALY_COLUMN_HEADER = 'events.anomaly'
export const EVENTS_SELECT_GROUP_BY_USERS = 'events.groupByUsers'
export const EVENTS_SELECT_GROUP_BY_DESTINATION = 'events.groupByDestination'
export const EVENTS_LAST_ACTIVITY_LABEL = 'events.lastActivity'

// RBAC translation keys
export const RBAC_RESOURCE_NOT_FOUND = 'access:errors.notFound.title'
export const RBAC_RESOURCE_NOT_FOUND_MESSAGE = 'access:errors.notFound.description'
export const RBAC_NO_PERMISSION = 'access:errors.noPermission.title'
export const RBAC_NO_ACCESS_MESSAGE = 'access:errors.noPermission.description'

// Table translation keys
export const TABLE_SELECT_ALL = 'tables:selectAll'
export const TABLE_CONTAINS = 'tables:contains'
export const TABLE_DOES_NOT_CONTAIN = 'tables:doesNotContain'
export const TABLE_STARTS_WITH = 'tables:startsWith'
export const TABLE_ENDS_WITH = 'tables:endsWith'

// Form translation keys
export const FORM_CLOSE_LABEL = 'general/form:close'
