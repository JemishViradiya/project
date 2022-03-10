import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Typography } from '@material-ui/core'

import { BasicDelete } from '@ues/assets'
import type { ToolbarProps } from '@ues/behaviours'

type EvidenceLockerToolbarProps = {
  t: (a: string, v?: any) => string
  selectedIds?: string[]
  totalItems?: number
  onDelete?: (ids: string[]) => void
  selectionModel?: any
}

export const useEvidenceLockerToolbar = ({
  selectedIds = [],
  onDelete,
  totalItems = 0,
  selectionModel,
}: EvidenceLockerToolbarProps): ToolbarProps => {
  const { t } = useTranslation(['general/form', 'dlp/common'])
  const selectedCount = selectionModel.allSelected
    ? selectionModel.allSelected && totalItems - selectionModel.selected.length
    : !selectionModel.allSelected && selectedIds.length
  return {
    begin: (
      <>
        {onDelete && selectedIds.length > 0 && (
          <>
            <Typography variant="h4">
              {t('evidenceLocker.selected', {
                count: selectedCount,
              })}
            </Typography>
            <Button variant="contained" color="primary" startIcon={<BasicDelete />} onClick={() => onDelete(selectedIds)}>
              {t('commonLabels.delete')}
            </Button>
          </>
        )}
      </>
    ),
  }
}
