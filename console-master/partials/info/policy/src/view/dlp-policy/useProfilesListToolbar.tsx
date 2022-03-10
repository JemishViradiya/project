import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, CircularProgress, Collapse, IconButton, Typography } from '@material-ui/core'

import { BasicAdd, BasicDelete, BasicSearch, BasicSwapHoriz } from '@ues/assets'
import type { ToolbarProps } from '@ues/behaviours'
import { AppliedFilterPanel, TableSearchPanel, TableToolbar } from '@ues/behaviours'

import { usePoliciesPermissions } from './usePoliciesPermission'

type ListToolbarProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedItems?: any[]
  items?: number
  //   onRank?: () => void
  onSearch?: (s: string) => void
  onAddPolicy: () => void
  onDeletePolicies: (ids: string[]) => void
  loading?: boolean
  filterProps: any // TODO refactor typescript later
  filterLabelProps: any // TODO refactor typescript later
}

export const useProfilesListToolbar = ({
  selectedItems = [],
  items = 0,
  onAddPolicy,
  onDeletePolicies,
  onSearch,
  loading = false,
  filterLabelProps,
  filterProps,
}: ListToolbarProps): ToolbarProps => {
  const { t } = useTranslation(['dlp/policy'])
  const [showSearch, setShowSearch] = useState(false)
  const { canCreate, canDelete } = usePoliciesPermissions()

  return {
    begin: (
      <>
        {selectedItems.length > 0 && <Typography variant="body2">{selectedItems.length} selected</Typography>}
        {selectedItems.length === 0 && onAddPolicy && canCreate && (
          <Button startIcon={<BasicAdd />} variant="contained" color="secondary" onClick={onAddPolicy}>
            {t('policy.buttons.add')}
          </Button>
        )}
        {selectedItems.length > 0 && canDelete && (
          <Button startIcon={<BasicDelete />} variant="contained" color="primary" onClick={() => onDeletePolicies(selectedItems)}>
            {t('policy.buttons.delete')}
          </Button>
        )}
      </>
    ),
    end: (
      <>
        {loading && <CircularProgress size={20} />}
        <Typography component="span" variant="body2">
          {t('policy.search.results', { value: items })}
        </Typography>
        {!showSearch && (
          <IconButton onClick={() => setShowSearch(true)}>
            <BasicSearch />
          </IconButton>
        )}
      </>
    ),
    top: (
      <Collapse in={showSearch}>
        <TableSearchPanel
          isInputFocused={true}
          onSearch={onSearch}
          onReset={() => setShowSearch(false)}
          searchPlaceholder={t('policy.search.placeholder')}
        />
      </Collapse>
    ),
    bottom: <AppliedFilterPanel {...filterProps} {...filterLabelProps} />,
  }
}
