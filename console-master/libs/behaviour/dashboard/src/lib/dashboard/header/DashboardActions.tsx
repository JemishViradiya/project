/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { BasicAddRound, BasicMoreHoriz } from '@ues/assets'

import type { DashboardProps } from './../types'
import { DashboardActionMenu } from './DashboardActionMenu'
import { useDashboardAddActions } from './useDashboardAddActions'
import { useDashboardEditActions } from './useDashboardEditActions'

type DashboardActionProps = {
  outOfBoxConfigs?: DashboardProps[]
}

export const DashboardActions = memo(({ outOfBoxConfigs = [] }: DashboardActionProps) => {
  const { t } = useTranslation(['general/form'])
  const [editTitle, deleteDashboard, editDialogs] = useDashboardEditActions()
  const [addWidgets, addNewDashboard, duplicateDashboard, addDialogs] = useDashboardAddActions(outOfBoxConfigs)

  return useMemo(() => {
    return (
      <>
        <DashboardActionMenu icon={BasicAddRound} tooltip={t('general/form:commonLabels.add')}>
          {[addWidgets, addNewDashboard, duplicateDashboard]}
        </DashboardActionMenu>
        <DashboardActionMenu icon={BasicMoreHoriz} tooltip={t('general/form:commonLabels.edit')}>
          {[editTitle, deleteDashboard]}
        </DashboardActionMenu>
        {addDialogs}
        {editDialogs}
      </>
    )
  }, [addDialogs, addNewDashboard, addWidgets, deleteDashboard, duplicateDashboard, editDialogs, editTitle, t])
})
