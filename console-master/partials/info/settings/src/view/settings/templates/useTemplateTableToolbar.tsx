/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Button, Collapse } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import { BasicAdd as AddIcon, BasicCopy, BasicDelete, BasicSearch, BasicStar } from '@ues/assets'
import type { FilterProps, TableSort, ToolbarProps } from '@ues/behaviours'
import { AppliedFilterPanel, TableSearchPanel } from '@ues/behaviours'

import makeStyles from '../../styles'
import { useDlpSettingsPermissions } from '../../useDlpSettingsPermissions'
import { ConfirmationDialogs } from './ConfirmationDialogs'
import { isDeletable, isRemovable } from './rules'

type ListToolbarProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedItems?: any[]
  associatedTemplateGuids: string[]
  items?: number
  filterProps: any // FilterProps<TFilter>
  filterLabelProps: any
  onSearch?: (s: string) => void
  onAdd: () => void
  onDelete: (guids: string[]) => void
  onAdd2YourList: (guids: string[]) => void
  onRemoveFromYourList: (guids: string[]) => void
  onDuplicate: (guids: string[]) => void

  loading?: boolean
}

export const useTemplateTableToolbar = ({
  selectedItems = [],
  associatedTemplateGuids,
  items = 0,
  filterProps,
  filterLabelProps,
  onSearch,
  onAdd,
  onDelete,
  onAdd2YourList,
  onRemoveFromYourList,
  onDuplicate,
  loading = false,
}: ListToolbarProps): ToolbarProps => {
  const classes = makeStyles()
  const { t } = useTranslation(['dlp/common'])
  const [showSearch, setShowSearch] = useState(false)
  const [searchString, setSearchString] = useState<string>()
  const [openDialogId, setOpenDialogId] = useState<string>('')
  const { canUpdate } = useDlpSettingsPermissions()
  const numOfSelectedItems = selectedItems.length

  return {
    begin: !showSearch ? (
      <>
        {numOfSelectedItems > 0 && (
          <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
            {t('selected', { count: numOfSelectedItems })}
          </Typography>
        )}

        {canUpdate && (
          <Button startIcon={<AddIcon />} variant="contained" color="secondary" onClick={() => onAdd()}>
            {t('setting.template.buttons.newTemplate')}
          </Button>
        )}

        {/* //{numOfSelectedItems > 0 && Object.values(selectedItems)?.some((row: any) => isAdditable(row)) && ( */}
        {canUpdate &&
          numOfSelectedItems > 0 &&
          Object.values(selectedItems)?.some((row: any) => !associatedTemplateGuids?.includes(row.guid)) && (
            <Button
              startIcon={canUpdate && <BasicStar />}
              variant="contained"
              color="primary"
              onClick={() => setOpenDialogId('add-to-list-confirmation')}
            >
              {t('setting.template.buttons.addToYourList')}
            </Button>
          )}
        {canUpdate && numOfSelectedItems > 0 && Object.values(selectedItems)?.some((row: any) => isRemovable(row)) && (
          <Button
            startIcon={canUpdate && <BasicDelete />}
            variant="contained"
            color="primary"
            onClick={() => setOpenDialogId('remove-from-list-confirmation')}
          >
            {t('setting.template.buttons.removeFromYourList')}
          </Button>
        )}

        {canUpdate && numOfSelectedItems === 1 && (
          <Button
            startIcon={canUpdate && <BasicCopy />}
            variant="contained"
            color="primary"
            onClick={() => setOpenDialogId('duplicate-confirmation')}
          >
            {t('setting.template.buttons.duplicate')}
          </Button>
        )}

        {canUpdate && numOfSelectedItems > 0 && Object.values(selectedItems)?.some((row: any) => isDeletable(row)) && (
          <Button
            startIcon={canUpdate && <BasicDelete />}
            variant="contained"
            color="primary"
            onClick={() => setOpenDialogId('delete-confirmation')}
          >
            {t('setting.template.buttons.delete')}
          </Button>
        )}
      </>
    ) : null,
    // temporary disabling Search
    // end: showSearch ? (
    //   <>
    //     {/* {loading && <CircularProgress size={20} />} */}
    //     <Collapse in={showSearch}>
    //       <TableSearchPanel
    //         onSearch={setSearchString}
    //         onReset={() => setShowSearch(false)}
    //         searchPlaceholder={t('setting.table.list.searchPlaceholder')}
    //       />
    //     </Collapse>
    //   </>
    // ) : (
    //   <IconButton onClick={() => setShowSearch(true)} aria-label="show more">
    //     <BasicSearch />
    //   </IconButton>
    // ),
    bottom: (
      <>
        <ConfirmationDialogs
          selectedItems={selectedItems}
          onAdd2YourList={onAdd2YourList}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          associatedTemplateGuids={associatedTemplateGuids}
          onRemoveFromYourList={onRemoveFromYourList}
          setOpenDialogId={setOpenDialogId}
          openDialogId={openDialogId}
        />
        <AppliedFilterPanel {...filterProps} {...filterLabelProps} />{' '}
      </>
    ),
  }
}
