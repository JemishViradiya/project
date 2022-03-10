/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { Box, Button, Collapse } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import { usePrevious } from '@ues-behaviour/react'
import { DataEntities } from '@ues-data/dlp'
import { Permission, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { BasicAdd as AddIcon, BasicCopy, BasicDelete, BasicSearch, BasicStar } from '@ues/assets'
import type { TableSort, ToolbarProps } from '@ues/behaviours'
import {
  AppliedFilterPanel,
  ConfirmationDialog,
  ContentArea,
  ContentAreaPanel,
  InfiniteTable,
  InfiniteTableProvider,
  SecuredContentBoundary,
  TableSearchPanel,
  TableToolbar,
  useClientSearch,
  useControlledDialog,
  UseControlledDialogProps,
  useSecuredContent,
} from '@ues/behaviours'

import makeStyles from '../../styles'
import { useDlpSettingsPermissions } from '../../useDlpSettingsPermissions'
import { Message4Addition, Message4Deletion, Message4Removal } from './dialogMessages'
import { isAdditable, isDeletable, isRemovable } from './rules'
import { useAddToListDataType } from './useAddToListDataType'
import { useDataTypesTableProps } from './useDataTypesTableProps'
import { useDeleteDataType } from './useDeleteDataType'

const DataTypesSettings: React.FC = () => {
  useSecuredContent(Permission.BIP_SETTINGS_READ)
  const { canUpdate } = useDlpSettingsPermissions()
  const classes = makeStyles()
  const { t } = useTranslation(['dlp/common'])
  const navigate = useNavigate()
  const [showSearch, setShowSearch] = useState(false)
  const [searchString, setSearchString] = useState<string>()

  // Sorting functionality below
  const [sortParams, setSortParams] = useState('')

  const initialSearchQueryParams = useMemo(
    () => ({
      variables: {
        max: 25,
        offset: 0,
        sortBy: sortParams,
      },
    }),
    [sortParams],
  )
  const sortingChanged = (sort: TableSort) => {
    if (`${sort.sortBy} ${sort.sortDir}` !== sortParams) {
      setSortParams(`${sort.sortBy} ${sort.sortDir}`)
    }
  }

  const [openDialogId, setOpenDialogId] = useState<string>('')
  const onConfirmationCloseDialog = () => {
    setOpenDialogId('')
  }

  const { error, loading, data: tableData, refetch } = useStatefulReduxQuery(DataEntities.queryDataEntities)
  const {
    error: associatedDataTypesError,
    loading: associatedDataTypesLoading,
    data: associatedDataTypes,
    refetch: refetchFavoriteList,
  } = useStatefulReduxQuery(DataEntities.queryAssociatedDataEntities)

  console.log('SettingList entered loading: ', { loading, tableData })

  const data = useMemo(() => tableData ?? [], [tableData])

  const { tableProps, providerProps, filterLabelProps, getSelected, unselectAll } = useDataTypesTableProps({
    data: data,
    selectionEnabled: canUpdate,
  })

  const newAbleToAddListDataTypes = useMemo(
    () => {
      return getSelected?.filter(s => (associatedDataTypes?.elements.find(d => s.guid === d.guid) ? null : s))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getSelected],
  )

  const unableToAddListDataTypes = useMemo(
    () => {
      return getSelected?.filter(s => (associatedDataTypes?.elements.find(d => s.guid === d.guid) ? s : null))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getSelected],
  )

  const { deleteFromAssociatedDataTypesAtion } = useDeleteDataType({ refetch, unselectAll })
  const { addToAssociatedDataTypesAction } = useAddToListDataType({ refetch, refetchFavoriteList, unselectAll })

  const numOfselectedItems = providerProps?.selectedProps?.selected.length ?? 0

  const toolbarProps: ToolbarProps = {
    begin: !showSearch ? (
      <>
        {numOfselectedItems > 0 && (
          <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
            {t('selected', { count: numOfselectedItems })}
          </Typography>
        )}
        {canUpdate && (
          <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => navigate('/data-types/create')}>
            {t('setting.dataTypes.buttons.newDataType')}
          </Button>
        )}

        {canUpdate && numOfselectedItems > 0 && Object.values(newAbleToAddListDataTypes)?.some((row: any) => isAdditable(row)) && (
          <Button
            variant="contained"
            color="primary"
            startIcon={canUpdate && <BasicStar />}
            onClick={() => setOpenDialogId('add-to-list-confirmation')}
          >
            {t('setting.dataTypes.buttons.addToYourList')}
          </Button>
        )}

        {canUpdate && numOfselectedItems > 0 && Object.values(getSelected)?.some((row: any) => isDeletable(row)) && (
          <Button
            variant="contained"
            color="primary"
            startIcon={canUpdate && <BasicDelete />}
            onClick={() => setOpenDialogId('remove-from-list-confirmation')}
          >
            {t('setting.dataTypes.buttons.removeFromYourList')}
          </Button>
        )}
      </>
    ) : null,
    end: showSearch ? (
      <>
        {/* {loading && <CircularProgress size={20} />} */}
        <Collapse in={showSearch}>
          <TableSearchPanel
            onSearch={setSearchString}
            onReset={() => setShowSearch(false)}
            searchPlaceholder={t('setting.table.list.searchPlaceholder')}
          />
        </Collapse>
      </>
    ) : (
      <IconButton onClick={() => setShowSearch(true)} aria-label="show more">
        <BasicSearch />
      </IconButton>
    ),
    bottom: <AppliedFilterPanel {...providerProps.filterProps} {...filterLabelProps} />,
  }

  return (
    <>
      <div className={classes.table}>
        <TableToolbar {...toolbarProps} />
        <InfiniteTableProvider
          basicProps={providerProps.basicProps}
          selectedProps={providerProps.selectedProps}
          sortingProps={providerProps.sortingProps}
          data={providerProps.data ?? []}
          filterProps={providerProps.filterProps}
        >
          <InfiniteTable noDataPlaceholder={tableProps.noDataPlaceholder} infinitLoader={tableProps.infinitLoader} />
        </InfiniteTableProvider>
      </div>

      {numOfselectedItems ? (
        <>
          <ConfirmationDialog
            open={openDialogId === 'add-to-list-confirmation'}
            title={t('setting.dataTypes.dialogs.addToYourList.title', { count: numOfselectedItems })}
            content={<Message4Addition selectedItems={newAbleToAddListDataTypes} existingItems={unableToAddListDataTypes} />}
            cancelButtonLabel={t('setting.dataTypes.dialogs.addToYourList.cancelBtn')}
            confirmButtonLabel={t('setting.dataTypes.dialogs.addToYourList.confirmBtn')}
            onConfirm={() => {
              const selectedGuids = newAbleToAddListDataTypes.map(d => d.guid)
              addToAssociatedDataTypesAction({ dataEntityGuids: selectedGuids })
              onConfirmationCloseDialog()
            }}
            onCancel={onConfirmationCloseDialog}
          />

          <ConfirmationDialog
            open={openDialogId === 'remove-from-list-confirmation'}
            title={t('setting.dataTypes.dialogs.removeFromYourList.title', { count: numOfselectedItems })}
            content={<Message4Deletion selectedItems={getSelected} />}
            cancelButtonLabel={t('setting.dataTypes.dialogs.removeFromYourList.cancelBtn')}
            confirmButtonLabel={t('setting.dataTypes.dialogs.removeFromYourList.confirmBtn')}
            onConfirm={() => {
              const customDataTypes = associatedDataTypes?.elements.filter(d => isDeletable(d))
              const deletableDataTypes = providerProps?.selectedProps?.selected.filter(
                guid => customDataTypes.find(d => d.guid === guid)?.guid,
              )
              deletableDataTypes.forEach(guid => deleteFromAssociatedDataTypesAtion({ dataEntityGuid: guid }))
              onConfirmationCloseDialog()
            }}
            onCancel={onConfirmationCloseDialog}
          />
        </>
      ) : null}
    </>
  )
}

export default DataTypesSettings
