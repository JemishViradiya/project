/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Box, Button, Dialog, Link, MenuItem, MenuList, Popover } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

import { MobileProtectData, RestrictedDomains as RestrictedHostAddresses } from '@ues-data/mtd'
import { Permission, usePermissions, usePrevious, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { dropdownMenuProps } from '@ues/assets'
import type { TableColumn, UseControlledDialogProps } from '@ues/behaviours'
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

import type { DomainModalDialogProps } from '../common-domains/domain-modal'
import DomainModalDialog from '../common-domains/domain-modal'
import DownloadSampleLink from '../download-sample'
import { CsvSampleFile } from '../download-sample/csv-sample-files'
import { useExclusionsList } from '../useExclusionsList'
import { useExclusionsListToolbar } from '../useExclusionsListToolbar'
import { useMultipleDelete } from '../useMultipleDelete'

const defaultDialogState: DomainModalDialogProps = {
  openDialog: false,
  inputValue: null,
  onClose: () => {
    return
  },
  onFormSubmit: (domain: MobileProtectData.IWebAddress) => {
    return
  },
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const RestrictedDomains = memo(() => {
  const { t } = useTranslation(['mtd/common'])
  const { hasAnyPermission } = usePermissions()

  const snackbar = useSnackbar()
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()
  const [dialogProps, setDialogProps] = useState<DomainModalDialogProps>(defaultDialogState)

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

  // Fetch domain functionality below
  const { refetch, fetchMore } = useStatefulReduxQuery(
    RestrictedHostAddresses.queryRestrictedDomainsState,
    initialSearchQueryParams,
  )
  const domainsTask = useSelector(RestrictedHostAddresses.getRestrictedDomainsTask)

  // Edit domain functionality below
  const [editRestrictedDomainStartAction, editRestrictedDomainTask] = useStatefulReduxMutation(
    RestrictedHostAddresses.mutationEditRestrictedDomain,
  )
  const editRestrictedDomainTaskPrev = usePrevious(editRestrictedDomainTask)
  useEffect(() => {
    if (!editRestrictedDomainTask.loading && editRestrictedDomainTaskPrev.loading && editRestrictedDomainTask.error) {
      if (editRestrictedDomainTask.error['response'].status === 409) {
        snackbar.enqueueMessage(t('exclusion.domains.duplicateDomainErrorMsg'), 'error')
      } else {
        snackbar.enqueueMessage(t('exclusion.domains.domainEditErrorMsg'), 'error')
      }
    } else if (!editRestrictedDomainTask.loading && editRestrictedDomainTaskPrev.loading) {
      setDialogProps(defaultDialogState) // clear form and close dialog
      snackbar.enqueueMessage(t('exclusion.domains.domainEditSuccessMsg'), 'success')
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRestrictedDomainTask])
  const openForEdit = (domainToEdit: MobileProtectData.IWebAddress): boolean => {
    setDialogProps({
      inputValue: domainToEdit,
      openDialog: true,
      onClose: () => {
        setDialogProps(defaultDialogState)
      },
      onFormSubmit: (domain: MobileProtectData.IWebAddress) => {
        editRestrictedDomainStartAction(domain)
      },
      headerTitle: t('exclusion.domains.editFormName'),
      submitBtnTitle: t('common.save'),
      isEditMode: true,
    })
    return false
  }

  const columns: TableColumn[] = useMemo(
    () => {
      return [
        {
          label: t('exclusion.domains.domain'),
          dataKey: 'value',
          renderCell: rowData => <Link onClick={() => openForEdit(rowData)}>{rowData?.value}</Link>,
          persistent: true,
          clientSortable: true,
        },
        {
          label: t('common.description'),
          dataKey: 'description',
        },
      ]
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  )

  const { tableProps, providerProps, getSelected, idFunction } = useExclusionsList({
    data: hasAnyPermission(
      Permission.VENUE_SETTINGSGLOBALLIST_READ,
      Permission.VENUE_SETTINGSGLOBALLIST_CREATE,
      Permission.VENUE_SETTINGSGLOBALLIST_UPDATE,
    )
      ? domainsTask?.result
      : [],
    fetchMore: fetchMore,
    columns: columns,
    sortingProps: sortingProps,
  })

  // Delete domain functionality below
  const { showDeleteConfirmation } = useMultipleDelete(
    providerProps,
    getSelected,
    refetch,
    RestrictedHostAddresses.mutationDeleteMultipleRestrictedDomains,
    'DOMAIN',
    idFunction,
  )

  //Create domain functionality below
  const [createDomainStartAction, createDomainTask] = useStatefulReduxMutation(
    RestrictedHostAddresses.mutationCreateRestrictedDomain,
  )
  const createDomainTaskPrev = usePrevious(createDomainTask)
  useEffect(() => {
    if (!createDomainTask.loading && createDomainTaskPrev.loading && createDomainTask.error) {
      if (createDomainTask.error['response'].status === 409) {
        snackbar.enqueueMessage(t('exclusion.domains.duplicateDomainErrorMsg'), 'error')
      } else {
        snackbar.enqueueMessage(t('exclusion.domains.domainCreateErrorMsg'), 'error')
      }
    } else if (!createDomainTask.loading && createDomainTaskPrev.loading) {
      setDialogProps(defaultDialogState) // clear form and close dialog
      snackbar.enqueueMessage(t('exclusion.domains.domainCreateSuccessMsg'), 'success')
      refetch()
      providerProps?.selectedProps?.resetSelectedItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createDomainTask])
  const openAddManualForm = () => {
    setDialogProps({
      openDialog: true,
      onClose: () => {
        setDialogProps(defaultDialogState)
      },
      onFormSubmit: (domain: MobileProtectData.IWebAddress) => {
        createDomainStartAction(domain)
      },
      headerTitle: t('exclusion.domains.addFormName'),
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

  const [importDomainsStartAction, importDomainsTask] = useStatefulReduxMutation(
    RestrictedHostAddresses.mutationImportRestrictedDomains,
  )
  const importDomainsTaskPrev = usePrevious(importDomainsTask)
  useEffect(() => {
    if (!importDomainsTask.loading && importDomainsTaskPrev.loading && importDomainsTask.error) {
      setImportLoading(false)
      importOnClose()
      const error = (importDomainsTask as any).error
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
        snackbar.enqueueMessage(t('exclusion.domains.domainImportFailureMsg'), 'error')
      }
    } else if (!importDomainsTask.loading && importDomainsTaskPrev.loading) {
      setImportLoading(false)
      importOnClose()
      if (importDomainsTask.data?.successes > 0) {
        snackbar.enqueueMessage(
          importDomainsTask.data.successes === 1
            ? t('exclusion.domains.domainImportSingularSuccessMsg')
            : t('exclusion.domains.domainImportMultipleSuccessesMsg', { count: importDomainsTask.data.successes }),
          'success',
        )
      }
      if (importDomainsTask.data?.failures?.length > 0) {
        snackbar.enqueueMessage(
          importDomainsTask.data.failures.length === 1
            ? t('exclusion.domains.domainImportSingularFailureMsg')
            : t('exclusion.domains.domainImportMultipleFailuresMsg', { count: importDomainsTask.data.failures.length }),
          'error',
        )
      }
      refetch()
      providerProps?.selectedProps.resetSelectedItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importDomainsTask])

  const handleSelectFiles = (files: Array<File>) => {
    setSelectedFiles(files)
  }

  const toolbarProps = useExclusionsListToolbar({
    selectedItems: getSelected(),
    loadedItems: providerProps?.data.length,
    totalItems: domainsTask?.result?.totals.elements,
    onAddActionClick: handlePopoverClick,
    onDeleteActionClick: () => showDeleteConfirmation(),
    addBtnText: t('exclusion.domains.addDomain'),
    exportFileNamePrefix: 'RestrictedDomains',
    exportColumns: columns,
    exportQuery: MobileProtectData.Queries.queryDomainsForExport,
    exportQueryArgs: { exclusionType: MobileProtectData.ExclusionType.Restricted },
  })

  return (
    <>
      <DomainModalDialog {...dialogProps} />

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
            {t('exclusion.domains.addManually')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handlePopoverClose()
              setImportDialogStateId(Symbol('import-restricted-domains-confirmation-dialog'))
            }}
          >
            {t('exclusion.domains.addViaImport')}
          </MenuItem>
        </MenuList>
      </Popover>

      <Dialog open={importOnOpen} onClose={importOnClose} maxWidth="sm" fullWidth={true}>
        <DialogChildren
          title={t('exclusion.domains.domainImportUploadTitle')}
          onClose={importOnClose}
          content={
            <>
              <Typography variant="body2" gutterBottom={true}>
                {t('common.importUploadDescription')} <DownloadSampleLink csvSampleFile={CsvSampleFile.Domain} />
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
                  importDomainsStartAction(selectedFiles[0])
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
})

export default RestrictedDomains
