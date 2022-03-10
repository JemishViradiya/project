/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box } from '@material-ui/core'

import { useQueryParams } from '@ues-behaviour/react'
import { Permission } from '@ues-data/shared'
import { GroupBy, QueryStringParamKeys } from '@ues-mtd/alert-types'
import { HelpLinks } from '@ues/assets'
import { PageTitlePanel, SecuredContent, usePageTitle } from '@ues/behaviours'

import MobileAlertsTable from '../view/mobileAlerts/MobileAlertsTable'
import MobileAlertsGroupByDetectionTable from './mobileAlerts/MobileAlertsGroupByDetectionTable'
import MobileAlertsGroupByDeviceTable from './mobileAlerts/MobileAlertsGroupByDeviceTable'

export default function MobileAlertsList(): JSX.Element {
  const { t } = useTranslation(['mtd/common'])
  usePageTitle(t('mobileAlert.list.pageTitle'))
  const groupBy: GroupBy = (useQueryParams().get(QueryStringParamKeys.GROUP_BY) as GroupBy) ?? GroupBy.none

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      <PageTitlePanel
        title={[t('mobileAlert.list.sideNavigationTitle'), t('mobileAlert.list.pageTitle')]}
        helpId={HelpLinks.ProtectMobileAlerts}
      />
      <SecuredContent requiredPermissions={Permission.MTD_EVENTS_READ}>
        {groupBy === GroupBy.detection && <MobileAlertsGroupByDetectionTable />}
        {groupBy === GroupBy.device && <MobileAlertsGroupByDeviceTable />}
        {groupBy === GroupBy.none && <MobileAlertsTable />}
      </SecuredContent>
    </Box>
  )
}
