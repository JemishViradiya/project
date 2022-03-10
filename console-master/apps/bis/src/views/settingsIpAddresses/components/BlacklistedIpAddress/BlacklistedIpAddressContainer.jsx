import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useEventHandler } from '@ues-behaviour/react'
import {
  IpAddressListAddMutation,
  IpAddressListDeleteMutation,
  IpAddressListUpdateMutation,
  IpAddressSettingsQuery,
} from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'

import { EDIT_UNTRUSTED_IP_ADDRESSES } from '../../../../config/consts/dialogIds'
import { default as IpAddressSettingsProvider } from '../../../../providers/IpAddressSettingsProvider'
import {
  StandaloneCapability as capability,
  useCapability,
  useExport,
  useFilters,
  useSelection,
  useSorting,
} from '../../../../shared'
import csvFields from '../../static/csvFields'
import ipAddressesQueryParams from '../../static/ipAddressesQueryParams'
import { type } from '../../static/ipAddressListType'
import selectionOptions from '../../static/selectionOptions'
import sortingOptions from '../../static/sortingOptions'
import BlacklistedIpAddress from './BlacklistedIpAddress'

const INITIAL_STATE = {
  offset: ipAddressesQueryParams.OFFSET,
  size: ipAddressesQueryParams.SIZE,
}
const IS_BLACKLIST = true

const defaultSnackbar = {
  open: false,
  message: '',
  variant: 'error',
}

const BlacklistedIpAddressContainer = memo(() => {
  const { t } = useTranslation()
  const [state] = useState(INITIAL_STATE)
  const [editDialog, setEditDialog] = useState({})
  const openEditDialog = useEventHandler(() => setEditDialog({ dialogId: EDIT_UNTRUSTED_IP_ADDRESSES }), [])
  const closeEditDialog = useCallback(() => setEditDialog({}), [])
  const [canEdit] = useCapability(capability.IP_ADDRESS)
  const [snackbar, setSnackbar] = useState(defaultSnackbar)
  const [ipAddressListId, setIpAddressListId] = useState('')
  const { onSearchChange: handleSearchChange, searchText } = useFilters()

  const [sorting, handleSort] = useSorting({
    key: type.UNTRUSTED,
    initSortBy: sortingOptions.INIT_SORT_BY,
    initSortDirection: sortingOptions.INIT_SORT_DIRECTION,
  })
  const {
    onSelected,
    onSelectAll,
    selectionState,
    selectedCount = selectionOptions.INIT_SELECTED_COUNT,
    selectedAll = selectionOptions.INIT_SELECTED_ALL,
    deselectedCount = selectionOptions.INIT_DESELECTED_COUNT,
    clearSelection,
  } = useSelection({
    key: type.UNTRUSTED,
  })
  const variables = useMemo(
    () => ({
      searchText,
      limit: state.limit,
      offset: state.offset,
      sortBy: sorting.sortBy,
      isBlacklist: IS_BLACKLIST,
      sortDirection: sorting.sortDirection,
    }),
    [searchText, sorting.sortBy, sorting.sortDirection, state.limit, state.offset],
  )
  const { handleExport, isExporting } = useExport({
    fields: csvFields,
    query: IpAddressSettingsQuery,
    queryPathName: 'ipAddressSettings',
    filename: type.UNTRUSTED,
    selectedItems: Object.values(selectionState.selected),
    variables,
  })

  const onClose = useCallback(() => {
    ipAddressListId && setIpAddressListId('')
    closeEditDialog()
  }, [closeEditDialog, ipAddressListId])

  const onError = useCallback(
    (error, isUpdateQuery) => {
      const serverErrorMessage = error?.graphQLErrors?.find(gqlError => gqlError?.message?.message)
      const errorMessage = isUpdateQuery ? t('settings.ipAddress.errorUpdate') : t('settings.ipAddress.errorAddNew')
      setSnackbar({
        open: true,
        message: serverErrorMessage?.message?.message ? t(serverErrorMessage.message.message) : errorMessage,
        variant: 'error',
      })
    },
    [t],
  )

  const onCloseSnackbar = useCallback(() => setSnackbar({ ...snackbar, open: false }), [snackbar])

  const [addIpAddressList] = useStatefulApolloMutation(IpAddressListAddMutation, {
    onCompleted: closeEditDialog,
    onError: error => onError(error, false),
    refetchQueries: () => [{ query: IpAddressSettingsQuery.query, variables }],
  })

  const [updateIpAddressList] = useStatefulApolloMutation(IpAddressListUpdateMutation, {
    onCompleted: onClose,
    onError: error => onError(error, true),
    refetchQueries: () => [{ query: IpAddressSettingsQuery.query, variables }],
  })

  const [deleteIpAddresses, { loading: deleteIpAddressesInProgress }] = useStatefulApolloMutation(IpAddressListDeleteMutation, {
    onCompleted: clearSelection,
    onError: deleteError => console.error(deleteError),
    refetchQueries: () => [{ query: IpAddressSettingsQuery.query, variables }],
  })

  const handleUpdateIpAddressListClick = useCallback(
    ipAddressListId => {
      setIpAddressListId(ipAddressListId)
      openEditDialog()
    },
    [openEditDialog],
  )

  return (
    <IpAddressSettingsProvider variables={variables}>
      <BlacklistedIpAddress
        variables={variables}
        onClose={onClose}
        canEdit={canEdit}
        sorting={sorting}
        onSort={handleSort}
        snackbar={snackbar}
        onSelected={onSelected}
        onExport={handleExport}
        isExporting={isExporting}
        searchText={searchText}
        editDialogId={editDialog.dialogId}
        openEditDialog={openEditDialog}
        onSelectAll={onSelectAll}
        selectedAll={selectedAll}
        isBlacklist={IS_BLACKLIST}
        selectedCount={selectedCount}
        selectionState={selectionState}
        onCloseSnackbar={onCloseSnackbar}
        ipAddressListId={ipAddressListId}
        deselectedCount={deselectedCount}
        onSearchChange={handleSearchChange}
        deleteIpAddresses={deleteIpAddresses}
        deleteIpAddressesInProgress={deleteIpAddressesInProgress}
        handleAddIpAddressList={addIpAddressList}
        handleUpdateIpAddressList={updateIpAddressList}
        handleUpdateIpAddressListClick={handleUpdateIpAddressListClick}
      />
    </IpAddressSettingsProvider>
  )
})

BlacklistedIpAddressContainer.displayName = 'BlacklistedIpAddressContainer'

export default BlacklistedIpAddressContainer
