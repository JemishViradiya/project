//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

export enum DashboardWidgetType {
  NetworkTraffic = 'network-traffic',
  TransferredBytes = 'transferred-bytes',
  ConnectorStatus = 'connector-status',
  TLSVersions = 'tls-versions',
  TopNetworkDestinations = 'top-network-destinations',
  NetworkAccess = 'network-access',
  EgressHealthConnectorWidget = 'egress-health-connector',
  PrivateTopNetworkDestinations = 'private-top-network-destinations',
  PublicTopNetworkDestinations = 'public-top-network-destinations',
  PublicNetworkAccess = 'public-network-access',
  PrivateNetworkAccess = 'private-network-access',
  NetworkAccessControlAppliedPolicies = 'network-access-control-applied-policies',
  TotalActiveUsers = 'total-active-users',
  TopUsersBandwidth = 'top-user-bandwidth',
  TopBlockedCategories = 'top-blocked-categories',
  SecurityRiskCategories = 'security-risk-categories',
}

export enum BytesTransferType {
  Uploaded = 'Uploaded',
  Downloaded = 'Downloaded',
}
