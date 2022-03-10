import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@material-ui/core'

import { BasicAdd } from '@ues/assets'

import { useDirectoryPermissions } from './azure/directoryHooks'

interface TableActionProps {
  onAdd: () => void
}
export const CompanyDirectoryTableActions = memo(({ onAdd }: TableActionProps) => {
  const { t } = useTranslation(['platform/common', 'profiles'])
  const { canCreate } = useDirectoryPermissions()

  return (
    <>
      {/*
      *** Leaving selection sections commented out in anticipation of mockup changes.

      {selectedItems.length > 0 && (
        <Typography variant="h4">{t('directory.selectedCount', { value: selectedItems.length })}</Typography>
      )} */}
      {canCreate && (
        <Button startIcon={<BasicAdd />} variant="contained" color="secondary" onClick={onAdd} title={t('directory.actions.add')}>
          {t('directory.actions.add')}
        </Button>
      )}

      {/* {selectedItems.length > 0 && (
        <Button startIcon={<BasicDelete />} variant="contained" color="primary" onClick={() => onDelete(selectedItems)}>
          {t('directory.actions.delete')}
        </Button>
      )} */}
    </>
  )
})
