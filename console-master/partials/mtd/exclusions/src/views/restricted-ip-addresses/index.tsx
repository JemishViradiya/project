/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Box, Button, Dialog, Link } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'

import { MobileProtectData, RestrictedIPAddresses } from '@ues-data/mtd'
import { Permission, usePermissions, usePrevious, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { dropdownMenuProps } from '@ues/assets'
import type { UseControlledDialogProps } from '@ues/behaviours'
import {
  DEFAULT_SORT,
  DEFAULT_SORT_DIRECTION,
  DialogChildren,
  FileUpload,
  InfiniteTable,
  InfiniteTableProvider,
  ProgressButton,
  TableToolbar,
  useControlledDialog,
  usePopover,
  useSnackbar,
  useSort,
} from '@ues/behaviours'

import type { IPAddressModalDialogProps } from '../common-ip-addresses/ip-address-modal'
import IPAddressModalDialog from '../common-ip-addresses/ip-address-modal'
import DownloadSampleLink from '../download-sample'
import { CsvSampleFile } from '../download-sample/csv-sample-files'
import { useExclusionsList } from '../useExclusionsList'
import { useExclusionsListToolbar } from '../useExclusionsListToolbar'
import { useMultipleDelete } from '../useMultipleDelete'

const defaultDialogState: IPAddressModalDialogProps = {
  openDialog: false,
  inputValue: null,
  onClose: () => {
    return
  },
  onFormSubmit: (ipAddress: MobileProtectData.IWebAddress) => {
    return
  },
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const RestrictedIpAddresses: React.FC = () => {
  const { t } = useTranslation(['mtd/common'])
  const { hasAnyPermission } = usePermissions()

  const snackbar = useSnackbar()
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()
  const [dialogProps, setDialogProps] = useState<IPAddressModalDialogProps>(defaultDialogState)

  // Sorting functionality below
  const sortingProps = useSort(DEFAULT_SORT, DEFAULT_SORT_DIRECTION)
  const { sort, sortDirection } = sortingProps
  const initialSearchQueryParams = useMemo(
    () => ({
      variables: {
        max: 25,
        offset: 0,
        sortBy: `${sort} ${sortDirection}`,
      },
    }),
    [sort, sortDirection],
  )

  // Fetch ip address functionality below
  const { data, refetch, fetchMore } = useStatefulReduxQuery(
    RestrictedIPAddresses.queryRestrictedIpAddressesState,
    initialSearchQueryParams,
  )
  const ipAddressesTask = useSelector(RestrictedIPAddresses.getRestrictedIpAddressesTask)

  // Edit ip address functionality below
  const [editRestrictedIPAddressStartAction, editRestrictedIPAddressTask] = useStatefulReduxMutation(
    RestrictedIPAddresses.mutationEditRestrictedIpAddress,
  )
  const editRestrictedIPAddressTaskPrev = usePrevious(editRestrictedIPAddressTask)
  useEffect(() => {
    if (!editRestrictedIPAddressTask.loading && editRestrictedIPAddressTaskPrev.loading && editRestrictedIPAddressTask.error) {
      if ((editRestrictedIPAddressTask as any).error.response?.data?.subStatusCode === 510) {
        snackbar.enqueueMessage(t('exclusion.webAddresses.duplicateIPErrorMsg'), 'error')
      } else {
        snackbar.enqueueMessage(t('exclusion.webAddresses.ipAddressEditErrorMsg'), 'error')
      }
    } else if (!editRestrictedIPAddressTask.loading && editRestrictedIPAddressTaskPrev.loading) {
      setDialogProps(defaultDialogState) // clear form and close dialog
      snackbar.enqueueMessage(t('exclusion.webAddresses.ipAddressEditSuccessMsg'), 'success')
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRestrictedIPAddressTask])

  const openForEdit = useCallback(
    (ipAddressToEdit: MobileProtectData.IWebAddress): boolean => {
      setDialogProps({
        inputValue: ipAddressToEdit,
        openDialog: true,
        onClose: () => {
          setDialogProps(defaultDialogState)
        },
        onFormSubmit: (ipAddress: MobileProtectData.IWebAddress) => {
          editRestrictedIPAddressStartAction(ipAddress)
        },
        headerTitle: t('exclusion.webAddresses.editFormName'),
        submitBtnTitle: t('common.save'),
        isEditMode: true,
      })
      return false
    },
    [editRestrictedIPAddressStartAction, t],
  )

  // Infinite table view properties below
  const columns = useMemo(() => {
    return [
      {
        label: t('exclusion.webAddresses.ipAddressStart'),
        dataKey: 'value',
        sortable: true,
        persistent: true,
        renderCell: rowData => <Link onClick={() => openForEdit(rowData)}>{rowData?.value?.split('-', 2)[0]}</Link>,
        exportValue: rowData => rowData?.value.split('-', 2)[0],
      },
      {
        label: t('exclusion.webAddresses.ipAddressEnd'),
        dataKey: 'endValue', // dataKey must be unique and required, thus use any unused field here
        renderCell: rowData => {
          return !rowData?.value.split('-', 2)[1] ? (
            ''
          ) : (
            <Link onClick={() => openForEdit(rowData)}>{rowData?.value.split('-', 2)[1]}</Link>
          )
        },
        exportValue: rowData => rowData?.value.split('-', 2)[1],
      },
      {
        label: t('common.description'),
        dataKey: 'description',
      },
    ]
  }, [openForEdit, t])

  const { tableProps, providerProps, getSelected, idFunction } = useExclusionsList({
    data: hasAnyPermission(
      Permission.VENUE_SETTINGSGLOBALLIST_READ,
      Permission.VENUE_SETTINGSGLOBALLIST_CREATE,
      Permission.VENUE_SETTINGSGLOBALLIST_UPDATE,
    )
      ? ipAddressesTask?.result
      : [],
    fetchMore: fetchMore,
    columns: columns,
    sortingProps: sortingProps,
  })

  // Delete ip address functionality below
  const { showDeleteConfirmation } = useMultipleDelete(
    providerProps,
    getSelected,
    refetch,
    RestrictedIPAddresses.mutationDeleteRestrictedIpAddresses,
    'IPADDRESS',
    idFunction,
  )

  //Create ip address functionality below
  const [createIPAddressStartAction, createIPAddressTask] = useStatefulReduxMutation(
    RestrictedIPAddresses.mutationCreateRestrictedIpAddress,
  )
  const createIPAddressTaskPrev = usePrevious(createIPAddressTask)
  useEffect(() => {
    if (!createIPAddressTask.loading && createIPAddressTaskPrev.loading && createIPAddressTask.error) {
      // eslint-disable-next-line sonarjs/no-all-duplicated-branches
      if ((createIPAddressTask as any).error.response?.data?.subStatusCode === 518) {
        snackbar.enqueueMessage(t('exclusion.webAddresses.ipAddressOverlappingApprovedErrorMsg'), 'error')
      } else if ((createIPAddressTask as any).error.response?.data?.subStatusCode === 510) {
        snackbar.enqueueMessage(t('exclusion.webAddresses.duplicateIPErrorMsg'), 'error')
      } else {
        snackbar.enqueueMessage(t('exclusion.webAddresses.ipAddressCreateErrorMsg'), 'error')
      }
    } else if (!createIPAddressTask.loading && createIPAddressTaskPrev.loading) {
      setDialogProps(defaultDialogState) // clear form and close dialog
      snackbar.enqueueMessage(t('exclusion.webAddresses.ipAddressCreateSuccessMsg'), 'success')
      refetch()
      providerProps?.selectedProps?.resetSelectedItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createIPAddressTask])
  const openAddManualForm = () => {
    setDialogProps({
      openDialog: true,
      onClose: () => {
        setDialogProps(defaultDialogState)
      },
      onFormSubmit: (ipAddress: MobileProtectData.IWebAddress) => {
        createIPAddressStartAction(ipAddress)
      },
      headerTitle: t('exclusion.webAddresses.addFormName'),
    })
  }

  const [importDialogStateId, setImportDialogStateId] = useState<UseControlledDialogProps['dialogId']>()
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>()
  const [importLoading, setImportLoading] = useState(false)
  const { open: importOnOpen, onClose: importOnClose } = useControlledDialog({
    dialogId: importDialogStateId,
    onClose: useCallback(reason => {
      setImportDialogStateId(undefined)
      setImportLoading(false)
    }, []),
  })

  const [importIPAddressesStartAction, importIPAddressesTask] = useStatefulReduxMutation(
    RestrictedIPAddresses.mutationImportRestrictedIpAddresses,
  )
  const importIPAddressesTaskPrev = usePrevious(importIPAddressesTask)
  useEffect(() => {
    if (!importIPAddressesTask.loading && importIPAddressesTaskPrev.loading && importIPAddressesTask.error) {
      setImportLoading(false)
      importOnClose()
      const error = (importIPAddressesTask as any).error
      if (!error.response && error.message.includes('timeout')) {
        snackbar.enqueueMessage(t('common.importTooLargeFile'), 'error')
        return
      }
      const errorCode = error?.response?.data?.subStatusCode
      if (errorCode === 600) {
        snackbar.enqueueMessage(t('common.importUnsupportedFileTypeMsg'), 'error')
      } else if (errorCode === 601 || errorCode === 602) {
        snackbar.enqueueMessage(t('common.importInvalidFormat'), 'error')
      } else {
        snackbar.enqueueMessage(t('exclusion.webAddresses.ipAddressImportFailureMsg'), 'error')
      }
    } else if (!importIPAddressesTask.loading && importIPAddressesTaskPrev.loading) {
      setImportLoading(false)
      importOnClose()
      if (importIPAddressesTask.data.successes > 0) {
        snackbar.enqueueMessage(
          importIPAddressesTask.data.successes === 1
            ? t('exclusion.webAddresses.ipAddressImportSingularSuccessMsg')
            : t('exclusion.webAddresses.ipAddressImportMultipleSuccessesMsg', { count: importIPAddressesTask.data.successes }),
          'success',
        )
      }
      if (importIPAddressesTask.data.failures.length > 0) {
        snackbar.enqueueMessage(
          importIPAddressesTask.data.failures.length === 1
            ? t('exclusion.webAddresses.ipAddressImportSingularFailureMsg')
            : t('exclusion.webAddresses.ipAddressImportMultipleFailuresMsg', { count: importIPAddressesTask.data.failures.length }),
          'error',
        )
      }
      refetch()
      providerProps?.selectedProps.resetSelectedItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importIPAddressesTask])

  const handleSelectFiles = (files: Array<File>) => {
    setSelectedFiles(files)
  }

  const toolbarProps = useExclusionsListToolbar({
    selectedItems: getSelected(),
    loadedItems: providerProps?.data.length,
    totalItems: ipAddressesTask?.result?.totals.elements,
    onAddActionClick: handlePopoverClick,
    onDeleteActionClick: () => showDeleteConfirmation(),
    addBtnText: t('exclusion.webAddresses.addIPAddress'),
    exportFileNamePrefix: 'RestrictedIPAddresses',
    exportColumns: columns,
    exportQuery: MobileProtectData.Queries.queryWebAddressesForExport,
    exportQueryArgs: { exclusionType: MobileProtectData.ExclusionType.Restricted },
  })

  return (
    <>
      <IPAddressModalDialog {...dialogProps} />

      <Box display="flex" flexDirection="column" height={'100%'}>
        <TableToolbar {...toolbarProps} />
        <InfiniteTableProvider {...providerProps}>
          <InfiniteTable {...tableProps} />
        </InfiniteTableProvider>
      </Box>

      <Popover
        open={popoverIsOpen}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        {...dropdownMenuProps.anchorOrigin}
        {...dropdownMenuProps.transformOrigin}
        {...dropdownMenuProps.marginThreshold}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              handlePopoverClose()
              openAddManualForm()
            }}
          >
            {t('exclusion.webAddresses.addManually')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handlePopoverClose()
              setImportDialogStateId(Symbol('import-approved-ip-address-confirmation-dialog'))
            }}
          >
            {t('exclusion.webAddresses.addViaImport')}
          </MenuItem>
        </MenuList>
      </Popover>

      <Dialog open={importOnOpen} onClose={importOnClose} maxWidth="sm" fullWidth={true}>
        <DialogChildren
          title={t('exclusion.webAddresses.ipAddressImportUploadTitle')}
          onClose={importOnClose}
          content={
            <>
              <Typography variant="body2" gutterBottom={true}>
                {t('common.importUploadDescription')} <DownloadSampleLink csvSampleFile={CsvSampleFile.IpAddress} />
              </Typography>
              <FileUpload onSelectFiles={handleSelectFiles} />
            </>
          }
          actions={
            <>
              <Button
                variant="outlined"
                size="medium"
                onClick={() => {
                  importOnClose()
                  setSelectedFiles(null)
                }}
              >
                {t('common.cancel')}
              </Button>
              <ProgressButton
                loading={importLoading}
                variant="contained"
                disabled={!selectedFiles}
                color="primary"
                onClick={() => {
                  importIPAddressesStartAction(selectedFiles[0])
                  setSelectedFiles(null)
                  setImportLoading(true)
                }}
              >
                {t('common.upload')}
              </ProgressButton>
            </>
          }
        />
      </Dialog>
    </>
  )
}

export default RestrictedIpAddresses
