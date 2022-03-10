//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { useLocation } from 'react-router-dom'

import { Types, Utils } from '@ues-gateway/shared'

const { AclRulesType } = Types
const { GATEWAY_ROUTES_DICTIONARY } = Utils

export const useAclRouteDetails = (): { isCommittedView: boolean; rulesType: Types.AclRulesType } => {
  const location = useLocation()

  const isCommittedView = location.pathname.split('/').includes(GATEWAY_ROUTES_DICTIONARY[AclRulesType.Committed])
  const rulesType = isCommittedView ? AclRulesType.Committed : AclRulesType.Draft

  return { isCommittedView, rulesType }
}
