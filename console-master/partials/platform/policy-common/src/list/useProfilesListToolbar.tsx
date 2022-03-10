import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, CircularProgress, Collapse, IconButton, Typography } from '@material-ui/core'

import { BasicAdd, BasicDelete, BasicSearch, BasicSwapHoriz } from '@ues/assets'
import type { ToolbarProps } from '@ues/behaviours'
import { TableSearchPanel } from '@ues/behaviours'

type ListToolbarProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedItems?: any[]
  items?: number
  onRank?: () => void
  onSearch?: (s: string) => void
  onAddPolicy?: () => void
  onDeletePolicies?: (ids: string[]) => void
  loading?: boolean
}

export const useProfilesListToolbar = ({
  selectedItems = [],
  items = 0,
  onRank,
  onAddPolicy,
  onDeletePolicies,
  onSearch,
  loading = false,
}: ListToolbarProps): ToolbarProps => {
  const { t } = useTranslation(['profiles', 'general/form'])
  const [showSearch, setShowSearch] = useState(false)

  const isDefaultSelected = useMemo(() => selectedItems.some(item => item.default === true), [selectedItems])

  return {
    begin: (
      <>
        {selectedItems.length > 0 && (
          <Typography variant="body2">{t('policy.list.selected', { count: selectedItems.length })}</Typography>
        )}
        {onAddPolicy && (
          <Button startIcon={<BasicAdd />} variant="contained" color="secondary" onClick={onAddPolicy}>
            {t('policy.list.add')}
          </Button>
        )}
        {!showSearch && selectedItems.length === 0 && onRank && (
          <Button startIcon={<BasicSwapHoriz />} variant="contained" onClick={onRank}>
            {t('policy.list.rank')}
          </Button>
        )}
        {onDeletePolicies && selectedItems.length > 0 && (
          <Button
            disabled={isDefaultSelected}
            startIcon={<BasicDelete />}
            variant="contained"
            color="primary"
            onClick={() => onDeletePolicies(selectedItems)}
          >
            {t('policy.deleteButton')}
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
        {!showSearch && (
          <IconButton aria-label={t('general/form:commonLabels.search')} onClick={() => setShowSearch(true)}>
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
          searchPlaceholder={t('policy.list.searchPlaceholder')}
        />
      </Collapse>
    ),
  }
}
