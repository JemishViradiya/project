//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { Permission, ReconciliationEntityType } from '@ues-data/shared-types'

export const POLICY_READ_PERMISSIONS_MAP = {
  [ReconciliationEntityType.NetworkAccessControl]: Permission.BIG_NETWORKACCESSCONTROLPROFILE_READ,
  [ReconciliationEntityType.GatewayApp]: Permission.BIG_GATEWAYAPPPROFILE_READ,
}

export const POLICY_CREATE_PERMISSIONS_MAP = {
  [ReconciliationEntityType.NetworkAccessControl]: Permission.BIG_NETWORKACCESSCONTROLPROFILE_CREATE,
  [ReconciliationEntityType.GatewayApp]: Permission.BIG_GATEWAYAPPPROFILE_CREATE,
}

export const POLICY_UPDATE_PERMISSIONS_MAP = {
  [ReconciliationEntityType.NetworkAccessControl]: Permission.BIG_NETWORKACCESSCONTROLPROFILE_UPDATE,
  [ReconciliationEntityType.GatewayApp]: Permission.BIG_GATEWAYAPPPROFILE_UPDATE,
}

export const POLICY_DELETE_PERMISSIONS_MAP = {
  [ReconciliationEntityType.NetworkAccessControl]: Permission.BIG_NETWORKACCESSCONTROLPROFILE_DELETE,
  [ReconciliationEntityType.GatewayApp]: Permission.BIG_GATEWAYAPPPROFILE_DELETE,
}
