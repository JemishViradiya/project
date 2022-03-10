import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, CircularProgress, Collapse, IconButton, Typography } from '@material-ui/core'

import { Permission, usePermissions } from '@ues-data/shared'
import { BasicAdd, BasicSearch } from '@ues/assets'
import type { ToolbarProps } from '@ues/behaviours'
import { TableSearchPanel } from '@ues/behaviours'

type ProfileAssignmentToolbarProps = {
  selectedIds?: string[]
  items?: number
  onSearch?: (s: string) => void
  onAdd?: () => void
  onDelete?: (ids: string[]) => void
  loading?: boolean
}

export const useProfileAssignmentToolbar = ({
  selectedIds = [],
  items = 0,
  onAdd,
  onDelete,
  onSearch,
  loading = false,
}: ProfileAssignmentToolbarProps): ToolbarProps => {
  const { t } = useTranslation(['profiles'])
  const [showSearch, setShowSearch] = useState(false)
  const { hasPermission } = usePermissions()
  const canUpdate = hasPermission(Permission.ECS_USERS_UPDATE)

  return {
    begin: !showSearch && (
      <>
        {selectedIds.length > 0 && <Typography variant="body2">{selectedIds.length} selected</Typography>}
        {canUpdate && (
          <Button variant="contained" color="secondary" startIcon={<BasicAdd />} onClick={onAdd}>
            {t('policy.assignment.add')}
          </Button>
        )}
        {selectedIds.length > 0 && canUpdate && (
          <Button variant="contained" color="primary" onClick={() => onDelete(selectedIds)}>
            {t('policy.removeButton')}
          </Button>
        )}
      </>
    ),
    end: (
      <>
        {loading && <CircularProgress size={20} />}
        <Typography component="span" variant="body2">
          {t('policy.list.results', { value: items })}
        </Typography>
        {onSearch && !showSearch && (
          <IconButton onClick={() => setShowSearch(true)}>
            <BasicSearch />
          </IconButton>
        )}
      </>
    ),
    top: onSearch && (
      <Collapse in={showSearch}>
        <TableSearchPanel
          onSearch={onSearch}
          onReset={() => setShowSearch(false)}
          searchPlaceholder={t('policy.assignment.searchPlaceholder')}
        />
      </Collapse>
    ),
  }
}
