import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BasicAdd } from '@ues/assets'

import { CONFIRM_DELETE_UNTRUSTED_IP_ADDRESSES } from '../../../../config/consts/dialogIds'
import { Header } from '../../../../list/Header'
import useSelectionCount from '../../../../list/useSelectionCount'
import { default as IpAddressListProvider } from '../../../../providers/IpAddressListProvider'
import { Context } from '../../../../providers/IpAddressSettingsProvider'
import { Icon, IconButton, MessageSnackbar, reportClientError } from '../../../../shared'
import DeleteButton from '../DeleteButton'
import DeleteDialog from '../DeleteDialog/DeleteDialog'
import IpAddressList from '../IpAddressList/IpAddressList'
import IpAddressModal from '../IpAddressModal'
import SelectionCount from '../SelectionCount'

const BlacklistedIpAddress = memo(
  ({
    onSort,
    onClose,
    canEdit,
    sorting,
    onExport,
    isExporting,
    snackbar,
    variables,
    searchText,
    onSelected,
    editDialogId,
    openEditDialog,
    selectedAll,
    onSelectAll,
    isBlacklist,
    selectedCount,
    onSearchChange,
    selectionState,
    deselectedCount,
    ipAddressListId,
    onCloseSnackbar,
    deleteIpAddresses,
    deleteIpAddressesInProgress,
    handleAddIpAddressList,
    handleUpdateIpAddressList,
    handleUpdateIpAddressListClick,
  }) => {
    const { t } = useTranslation()
    const { data, total } = useContext(Context)
    const selectionCounter = useSelectionCount({ selectedCount, selectedAll, deselectedCount }, total)
    const [deleteDialog, setDeleteDialog] = useState({})
    const openDeleteDialog = useCallback(
      ipAddresses => setDeleteDialog({ dialogId: CONFIRM_DELETE_UNTRUSTED_IP_ADDRESSES, toDelete: ipAddresses }),
      [],
    )
    const closeDeleteDialog = useCallback(() => setDeleteDialog({}), [])
    const onDeleteModalDelete = useCallback(async () => {
      const ids = deleteDialog.toDelete.map(ipAddress => ipAddress.id)
      if (canEdit && ids.length > 0) {
        try {
          await deleteIpAddresses({ variables: { ids } })
        } catch (e) {
          reportClientError(e)
        }
      }
      closeDeleteDialog()
    }, [canEdit, closeDeleteDialog, deleteDialog.toDelete, deleteIpAddresses])

    const renderDelete = canEdit && (
      <DeleteButton selectionState={selectionState} openDeleteDialog={openDeleteDialog} variables={variables} />
    )

    return (
      <>
        <p>{t('settings.ipAddress.untrustedListInfo')}</p>
        <Header
          isSubHeader
          selectionCount={<SelectionCount count={selectionCounter} />}
          actionButtons={renderDelete}
          frontActionButtons={
            canEdit && (
              <IconButton onClick={openEditDialog} title={t('settings.ipAddress.addNew')}>
                <Icon icon={BasicAdd} />
              </IconButton>
            )
          }
          filterBar={Header.defaultProps.filterBar}
          onSearchChange={onSearchChange}
          searchText={searchText}
          onExport={onExport}
          isExporting={isExporting}
          name="blacklist-ip-address-search"
        />
        <IpAddressList
          data={data}
          total={total}
          onSort={onSort}
          canEdit={canEdit}
          sorting={sorting}
          onSelected={onSelected}
          searchText={searchText}
          selectedAll={selectedAll}
          onSelectAll={onSelectAll}
          selectionState={selectionState}
          openDeleteDialog={openDeleteDialog}
          handleUpdateIpAddressListClick={handleUpdateIpAddressListClick}
        />
        {deleteDialog.dialogId && (
          <DeleteDialog
            dialogId={deleteDialog.dialogId}
            deleteInProgress={deleteIpAddressesInProgress}
            ipAddresses={deleteDialog.toDelete}
            onClose={closeDeleteDialog}
            onDelete={onDeleteModalDelete}
          />
        )}
        <IpAddressListProvider variables={{ id: ipAddressListId }}>
          {editDialogId && (
            <IpAddressModal
              canEdit={canEdit}
              onClose={onClose}
              dialogId={editDialogId}
              isBlacklist={isBlacklist}
              isEditMode={!!ipAddressListId}
              handleAddIpAddressList={handleAddIpAddressList}
              handleUpdateIpAddressList={handleUpdateIpAddressList}
            />
          )}
        </IpAddressListProvider>
        <MessageSnackbar open={snackbar.open} message={snackbar.message} variant={snackbar.variant} onClose={onCloseSnackbar} />
      </>
    )
  },
)

BlacklistedIpAddress.displayName = 'BlacklistedIpAddress'

BlacklistedIpAddress.propTypes = {
  searchText: PropTypes.string,
  sorting: PropTypes.object.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  onSelected: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  selectionState: PropTypes.object.isRequired,
  selectedCount: PropTypes.number.isRequired,
  selectedAll: PropTypes.bool.isRequired,
  deselectedCount: PropTypes.number.isRequired,
  variables: PropTypes.object,
  canEdit: PropTypes.bool.isRequired,
  ipAddressListId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  editDialogId: PropTypes.string,
  openEditDialog: PropTypes.func.isRequired,
  isBlacklist: PropTypes.bool.isRequired,
  handleUpdateIpAddressList: PropTypes.func,
  deleteIpAddresses: PropTypes.func.isRequired,
  handleUpdateIpAddressListClick: PropTypes.func,
  handleAddIpAddressList: PropTypes.func.isRequired,
  snackbar: PropTypes.object.isRequired,
  onCloseSnackbar: PropTypes.func.isRequired,
}

export default BlacklistedIpAddress
