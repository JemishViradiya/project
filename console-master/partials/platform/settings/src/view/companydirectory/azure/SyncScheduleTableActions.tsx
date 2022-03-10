/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@material-ui/core'

import { BasicAdd } from '@ues/assets'

export type SyncScheduleTableActionsProps = {
  onAdd: () => void
}

export const SyncScheduleTableActions = memo((props: SyncScheduleTableActionsProps) => {
  const { onAdd } = props
  const { t } = useTranslation(['platform/common', 'profiles'])

  return (
    <Button startIcon={<BasicAdd />} variant="contained" color="secondary" onClick={onAdd}>
      {t('directory.syncSchedule.add')}
    </Button>
  )
})
