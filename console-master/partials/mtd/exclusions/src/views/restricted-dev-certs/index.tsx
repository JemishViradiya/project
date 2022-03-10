/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Box, Button, Dialog, Link, MenuItem, MenuList, Popover, Typography } from '@material-ui/core'

import { MobileProtectData, RestrictedDevCerts } from '@ues-data/mtd'
import {
  FeatureName,
  Permission,
  useFeatures,
  usePermissions,
  usePrevious,
  useStatefulReduxMutation,
  useStatefulReduxQuery,
} from '@ues-data/shared'
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

import type { AppUploadDialogProps } from '../app-file-upload'
import AppFileUploadDialog from '../app-file-upload'
import type { DevCertModalDialogProps } from '../common-dev-certs/dev-certs-modal'
import DevCertModalDialog from '../common-dev-certs/dev-certs-modal'
import DownloadSampleLink from '../download-sample'
import { CsvSampleFile } from '../download-sample/csv-sample-files'
import { BrandIcon, useExclusionsList } from '../useExclusionsList'
import { useExclusionsListToolbar } from '../useExclusionsListToolbar'
import { useMultipleDelete } from '../useMultipleDelete'

type IDeveloperCertificate = MobileProtectData.IDeveloperCertificate

const defaultDialogState: DevCertModalDialogProps = {
  openDialog: false,
  inputValue: null,
  onClose: () => {
    return
  },
  onFormSubmit: (devCert: MobileProtectData.IDeveloperCertificate) => {
    return
  },
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const RestrictedDevelopers = memo(() => {
  const { t } = useTranslation(['mtd/common'])
  const { hasAnyPermission } = usePermissions()

  const { isEnabled } = useFeatures()
  const isIosRestrictedEnabled = isEnabled(FeatureName.ExclusionIosRestricted)

  const snackbar = useSnackbar()
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()
  const [dialogProps, setDialogProps] = useState<DevCertModalDialogProps>(defaultDialogState)

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

  // Fetch developer certificate functionality below
  const { refetch, fetchMore } = useStatefulReduxQuery(RestrictedDevCerts.queryRestrictedDevCerts, initialSearchQueryParams)
  const devCertsTask = useSelector(RestrictedDevCerts.getRestrictedDevCertsTask)

  // Edit developer certificate functionality below
  const [editRestrictedDevCertStartAction, editRestrictedDevCertTask] = useStatefulReduxMutation(
    RestrictedDevCerts.mutationEditRestrictedDevCert,
  )
  const editRestrictedDevCertTaskPrev = usePrevious(editRestrictedDevCertTask)
  useEffect(() => {
    if (!editRestrictedDevCertTask.loading && editRestrictedDevCertTaskPrev.loading && editRestrictedDevCertTask.error) {
      if (editRestrictedDevCertTask.error['response'].status === 409) {
        snackbar.enqueueMessage(t('exclusion.developers.duplicateDevCertErrorMsg'), 'error')
      } else {
        snackbar.enqueueMessage(t('exclusion.developers.devCertEditErrorMsg'), 'error')
      }
    } else if (!editRestrictedDevCertTask.loading && editRestrictedDevCertTaskPrev.loading) {
      setDialogProps(defaultDialogState) // clear form and close dialog
      snackbar.enqueueMessage(t('exclusion.developers.devCertEditSuccessMsg'), 'success')
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRestrictedDevCertTask])
  const openForEdit = (devCertToEdit: MobileProtectData.IDeveloperCertificate): boolean => {
    setDialogProps({
      inputValue: devCertToEdit,
      iosEnabled: isIosRestrictedEnabled,
      openDialog: true,
      onClose: () => {
        setDialogProps(defaultDialogState)
      },
      onFormSubmit: (devCert: MobileProtectData.IDeveloperCertificate) => {
        editRestrictedDevCertStartAction(devCert)
      },
      headerTitle: t('exclusion.restrictedDevelopers.editFormName'),
      submitBtnTitle: t('common.save'),
      isEditMode: true,
    })
    return false
  }

  const columns: TableColumn[] = useMemo(
    () => [
      {
        label: t('exclusion.developers.name'),
        dataKey: 'name',
        persistent: true,
        sortable: true,
        renderCell: rowData => <Link onClick={() => openForEdit(rowData)}>{rowData?.name}</Link>,
      },
      {
        label: t('exclusion.developers.os'),
        dataKey: 'platform',
        icon: true,
        sortable: true,
        renderCell: rowData => {
          return BrandIcon(rowData.platform)
        },
      },
      {
        label: t('exclusion.developers.subject'),
        dataKey: 'subject',
        sortable: true,
      },
      {
        label: t('exclusion.developers.issuer'),
        dataKey: 'issuer',
        sortable: true,
      },
      {
        label: t('exclusion.developers.identifier'),
        dataKey: 'identifier',
        sortable: true,
      },
      {
        label: t('exclusion.developers.description'),
        dataKey: 'description',
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  )

  const { tableProps, providerProps, getSelected, idFunction } = useExclusionsList({
    data: hasAnyPermission(
      Permission.VENUE_SETTINGSGLOBALLIST_READ,
      Permission.VENUE_SETTINGSGLOBALLIST_CREATE,
      Permission.VENUE_SETTINGSGLOBALLIST_UPDATE,
    )
      ? devCertsTask?.result
      : [],
    fetchMore: fetchMore,
    columns: columns,
    sortingProps: sortingProps,
  })

  const getSelectedExceptFromSystem = () => {
    return getSelected().filter(cert => cert.source !== MobileProtectData.DeveloperCertificateSourceType.System)
  }

  // Delete developer certificate functionality below
  const { showDeleteConfirmation } = useMultipleDelete(
    providerProps,
    getSelectedExceptFromSystem,
    refetch,
    RestrictedDevCerts.mutationDeleteRestrictedDevCerts,
    'DEVCERT',
    idFunction,
    getSelected().findIndex(cert => cert.source === MobileProtectData.DeveloperCertificateSourceType.System) !== -1
      ? t('exclusion.systemObjectsRemovedFromList')
      : null,
  )

  const checkAndShowDeleteConfirmation = () => {
    if (getSelectedExceptFromSystem().length === 0) {
      // if user tries to delete only system cers
      snackbar.enqueueMessage(t('exclusion.developers.systemDevCertsOnlyCannotBeDeleted'), 'error')
    } else {
      showDeleteConfirmation()
    }
  }

  //Create developer certificate functionality below
  const [createDevCertStartAction, createDevCertTask] = useStatefulReduxMutation(RestrictedDevCerts.mutationCreateRestrictedDevCert)
  const createDevCertTaskPrev = usePrevious(createDevCertTask)
  useEffect(() => {
    if (!createDevCertTask.loading && createDevCertTaskPrev.loading && createDevCertTask.error) {
      if (createDevCertTask.error['response'].status === 409) {
        snackbar.enqueueMessage(t('exclusion.developers.duplicateDevCertErrorMsg'), 'error')
      } else {
        snackbar.enqueueMessage(t('exclusion.developers.devCertCreateErrorMsg'), 'error')
      }
    } else if (!createDevCertTask.loading && createDevCertTaskPrev.loading) {
      setDialogProps(defaultDialogState) // clear form and close dialog
      snackbar.enqueueMessage(t('exclusion.developers.devCertCreateSuccessMsg'), 'success')
      refetch()
      providerProps?.selectedProps?.resetSelectedItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createDevCertTask])
  const openAddManualForm = (predefinedDevCertInfo: IDeveloperCertificate = null) => {
    setDialogProps({
      openDialog: true,
      onClose: () => {
        setDialogProps(defaultDialogState)
      },
      onFormSubmit: (devCert: MobileProtectData.IDeveloperCertificate) => {
        createDevCertStartAction(devCert)
      },
      headerTitle: t('exclusion.restrictedDevelopers.addFormName'),
      inputValue: predefinedDevCertInfo,
      iosEnabled: isIosRestrictedEnabled,
    })
  }

  // Application file upload
  const defaultAppUploadDialog: AppUploadDialogProps<IDeveloperCertificate> = {
    openDialog: false,
    resultType: MobileProtectData.AppUploadParseResultType.Certificate,
    iosEnabled: isIosRestrictedEnabled,
  }

  const [appUploadDialogProps, setAppUploadDialogProps] = useState<AppUploadDialogProps<IDeveloperCertificate>>(
    defaultAppUploadDialog,
  )

  const openUploadAppForm = () => {
    setAppUploadDialogProps({
      openDialog: true,
      resultType: MobileProtectData.AppUploadParseResultType.Certificate,
      iosEnabled: isIosRestrictedEnabled,
      onClose: () => {
        setAppUploadDialogProps(defaultAppUploadDialog)
      },
      onSubmit: (parsedDevCertInfo: IDeveloperCertificate) => {
        setAppUploadDialogProps(defaultAppUploadDialog)
        openAddManualForm(parsedDevCertInfo)
      },
    })
  }

  const [importDevCertsStartAction, importDevCertsTask] = useStatefulReduxMutation(
    RestrictedDevCerts.mutationImportRestrictedDevCerts,
  )
  const importDevCertsTaskPrev = usePrevious(importDevCertsTask)
  useEffect(() => {
    if (!importDevCertsTask.loading && importDevCertsTaskPrev.loading && importDevCertsTask.error) {
      setImportLoading(false)
      importOnClose()
      const error = (importDevCertsTask as any).error
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
        snackbar.enqueueMessage(t('exclusion.developers.devCertImportFailureMsg'), 'error')
      }
    } else if (!importDevCertsTask.loading && importDevCertsTaskPrev.loading) {
      setImportLoading(false)
      importOnClose()
      if (importDevCertsTask.data.successes > 0) {
        snackbar.enqueueMessage(
          importDevCertsTask.data.successes === 1
            ? t('exclusion.developers.devCertImportSingularSuccessMsg')
            : t('exclusion.developers.devCertImportMultipleSuccessesMsg', { count: importDevCertsTask.data.successes }),
          'success',
        )
      }
      if (importDevCertsTask.data.failures.length > 0) {
        snackbar.enqueueMessage(
          importDevCertsTask.data.failures.length === 1
            ? t('exclusion.developers.devCertImportSingularFailureMsg')
            : t('exclusion.developers.devCertImportMultipleFailuresMsg', { count: importDevCertsTask.data.failures.length }),
          'error',
        )
      }
      refetch()
      providerProps?.selectedProps.resetSelectedItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importDevCertsTask])

  const handleSelectFiles = (files: Array<File>) => {
    setSelectedFiles(files)
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

  const cancelLabel = 'common.cancel'

  const toolbarProps = useExclusionsListToolbar({
    selectedItems: getSelected(),
    loadedItems: providerProps?.data.length,
    totalItems: devCertsTask?.result?.totals.elements,
    onAddActionClick: handlePopoverClick,
    onDeleteActionClick: () => checkAndShowDeleteConfirmation(),
    addBtnText: t('exclusion.developers.addDevCert'),
    exportFileNamePrefix: 'RestrictedDevelopers',
    exportColumns: columns,
    exportQuery: MobileProtectData.Queries.queryDevCertsForExport,
    exportQueryArgs: { exclusionType: MobileProtectData.ExclusionType.Restricted },
  })

  return (
    <>
      <DevCertModalDialog {...dialogProps} />

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
              openUploadAppForm()
            }}
          >
            {t('exclusion.developers.addViaSelect')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handlePopoverClose()
              openAddManualForm()
            }}
          >
            {t('exclusion.developers.addManually')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handlePopoverClose()
              setImportDialogStateId(Symbol('file-upload'))
            }}
          >
            {t('exclusion.developers.addViaImport')}
          </MenuItem>
        </MenuList>
      </Popover>

      <Dialog open={importOnOpen} onClose={importOnClose} maxWidth="sm" fullWidth={true}>
        <DialogChildren
          title={t('exclusion.developers.devCertImportUploadTitle')}
          onClose={importOnClose}
          content={
            <>
              <Typography variant="body2" gutterBottom={true}>
                {t('common.importUploadDescription')} <DownloadSampleLink csvSampleFile={CsvSampleFile.DevCertificate} />
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
                {t(cancelLabel)}
              </Button>
              <ProgressButton
                loading={importLoading}
                variant="contained"
                disabled={!selectedFiles}
                color="primary"
                onClick={() => {
                  importDevCertsStartAction(selectedFiles[0])
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

      <AppFileUploadDialog {...appUploadDialogProps} />
    </>
  )
})

export default RestrictedDevelopers
