/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Box, Button, Dialog, Link, MenuItem, MenuList, Popover, Typography } from '@material-ui/core'

import { MobileProtectData, RestrictedApps as RestrictedAPPs } from '@ues-data/mtd'
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

import type { AppUploadDialogProps } from '../app-file-upload'
import AppFileUploadDialog from '../app-file-upload'
import type { AppModalDialogProps } from '../common-apps/add-app-modal'
import AppModalDialog from '../common-apps/add-app-modal'
import DownloadSampleLink from '../download-sample'
import { CsvSampleFile } from '../download-sample/csv-sample-files'
import { BrandIcon, useExclusionsList } from '../useExclusionsList'
import { useExclusionsListToolbar } from '../useExclusionsListToolbar'
import { useMultipleDelete } from '../useMultipleDelete'

const defaultDialogState: AppModalDialogProps = {
  openDialog: false,
  inputValue: null,
  onClose: () => {
    return
  },
  onFormSubmit: (restrictedApp: MobileProtectData.IAppInfo) => {
    return
  },
}

type IAppInfo = MobileProtectData.IAppInfo

// eslint-disable-next-line sonarjs/cognitive-complexity
const RestrictedApps: React.FC = () => {
  const { t } = useTranslation(['mtd/common'])
  const { hasAnyPermission } = usePermissions()

  const { isEnabled } = useFeatures()
  const isIosRestrictedEnabled = isEnabled(FeatureName.ExclusionIosRestricted)

  const snackbar = useSnackbar()
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()
  const [dialogProps, setDialogProps] = useState<AppModalDialogProps>(defaultDialogState)

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

  // Fetch applications functionality below
  const { data, refetch, fetchMore } = useStatefulReduxQuery(RestrictedAPPs.queryRestrictedApps, initialSearchQueryParams)
  const appDataTask = useSelector(RestrictedAPPs.getRestrictedAppsTask)

  // Edit application functionality below
  const [editRestrictedApplicationStartAction, editRestrictedAppTask] = useStatefulReduxMutation(
    RestrictedAPPs.mutationEditRestrictedApplication,
  )
  const editRestrictedAppTaskPrev = usePrevious(editRestrictedAppTask)
  useEffect(() => {
    if (!editRestrictedAppTask.loading && editRestrictedAppTaskPrev.loading && editRestrictedAppTask.error) {
      snackbar.enqueueMessage(t('exclusion.apps.applicationEditErrorMsg'), 'error')
    } else if (!editRestrictedAppTask.loading && editRestrictedAppTaskPrev.loading) {
      setDialogProps(defaultDialogState) // clear form and close dialog
      snackbar.enqueueMessage(t('exclusion.apps.applicationEditSuccessMsg'), 'success')
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRestrictedAppTask])

  const openForEdit = useCallback(
    (appToEdit: MobileProtectData.IAppInfo): boolean => {
      setDialogProps({
        inputValue: appToEdit,
        iosEnabled: isIosRestrictedEnabled,
        openDialog: true,
        onClose: () => {
          setDialogProps(defaultDialogState)
        },
        onFormSubmit: (restrictedApp: MobileProtectData.IAppInfo) => {
          editRestrictedApplicationStartAction(restrictedApp)
        },
        headerTitle: t('exclusion.restrictedApps.editFormName'),
        submitBtnTitle: t('common.save'),
        isEditMode: true,
      })
      return false
    },
    [editRestrictedApplicationStartAction, t, isIosRestrictedEnabled],
  )

  // Infinite table view properties below
  const columns = useMemo(
    () => [
      {
        label: t('exclusion.apps.name'),
        dataKey: 'name',
        sortable: true,
        persistent: true,
        renderCell: rowData => <Link onClick={() => openForEdit(rowData)}>{rowData?.name}</Link>,
      },
      {
        label: t('exclusion.apps.os'),
        dataKey: 'platform',
        icon: true,
        sortable: true,
        renderCell: rowData => {
          return BrandIcon(rowData.platform)
        },
      },
      {
        label: t('exclusion.apps.vendor'),
        dataKey: 'vendorName',
        sortable: true,
      },
      {
        label: t('exclusion.apps.version'),
        dataKey: 'version',
        sortable: true,
      },
      {
        label: t('exclusion.apps.hashValue'),
        dataKey: 'hash',
        sortable: true,
      },
      {
        label: t('exclusion.apps.description'),
        dataKey: 'description',
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openForEdit, t],
  )
  const { tableProps, providerProps, getSelected, idFunction } = useExclusionsList({
    data: hasAnyPermission(
      Permission.VENUE_SETTINGSGLOBALLIST_READ,
      Permission.VENUE_SETTINGSGLOBALLIST_CREATE,
      Permission.VENUE_SETTINGSGLOBALLIST_UPDATE,
    )
      ? appDataTask?.result
      : [],
    fetchMore: fetchMore,
    columns: columns,
    sortingProps: sortingProps,
  })

  // Delete application functionality below
  const { showDeleteConfirmation } = useMultipleDelete(
    providerProps,
    getSelected,
    refetch,
    RestrictedAPPs.mutationDeleteRestrictedApplications,
    'APP',
    idFunction,
  )

  //Create application functionality below
  const [createRestrictedApplicationStartAction, createRestrictedAppTask] = useStatefulReduxMutation(
    RestrictedAPPs.mutationCreateRestrictedApplication,
  )
  const createRestrictedAppTaskPrev = usePrevious(createRestrictedAppTask)
  useEffect(() => {
    if (!createRestrictedAppTask.loading && createRestrictedAppTaskPrev.loading && createRestrictedAppTask.error) {
      if ((createRestrictedAppTask as any).error.response?.data?.subStatusCode === 210) {
        snackbar.enqueueMessage(t('exclusion.apps.duplicateAppErrorMsg'), 'error')
      } else {
        snackbar.enqueueMessage(t('exclusion.apps.applicationCreateErrorMsg'), 'error')
      }
    } else if (!createRestrictedAppTask.loading && createRestrictedAppTaskPrev.loading) {
      setDialogProps(defaultDialogState) // clear form and close dialog
      snackbar.enqueueMessage(t('exclusion.apps.applicationCreateSuccessMsg'), 'success')
      refetch()
      providerProps?.selectedProps?.resetSelectedItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createRestrictedAppTask])
  const openAddManualForm = (predefinedAppInfo: IAppInfo = null) => {
    setDialogProps({
      openDialog: true,
      onClose: () => {
        setDialogProps(defaultDialogState)
      },
      onFormSubmit: (restrictedApp: MobileProtectData.IAppInfo) => {
        createRestrictedApplicationStartAction(restrictedApp)
      },
      headerTitle: t('exclusion.restrictedApps.addFormName'),
      inputValue: predefinedAppInfo,
      iosEnabled: isIosRestrictedEnabled,
    })
  }

  // Application file upload
  const defaultAppUploadDialog: AppUploadDialogProps<IAppInfo> = {
    openDialog: false,
    resultType: MobileProtectData.AppUploadParseResultType.Application,
    iosEnabled: isIosRestrictedEnabled,
  }

  const [appUploadDialogProps, setAppUploadDialogProps] = useState<AppUploadDialogProps<IAppInfo>>(defaultAppUploadDialog)

  const openUploadAppForm = () => {
    setAppUploadDialogProps({
      openDialog: true,
      resultType: MobileProtectData.AppUploadParseResultType.Application,
      iosEnabled: isIosRestrictedEnabled,
      onClose: () => {
        setAppUploadDialogProps(defaultAppUploadDialog)
      },
      onSubmit: (parsedAppInfo: IAppInfo) => {
        setAppUploadDialogProps(defaultAppUploadDialog)
        openAddManualForm(parsedAppInfo)
      },
    })
  }

  const toolbarProps = useExclusionsListToolbar({
    selectedItems: getSelected(),
    loadedItems: providerProps?.data.length,
    totalItems: appDataTask?.result?.totals.elements,
    onAddActionClick: handlePopoverClick,
    onDeleteActionClick: () => showDeleteConfirmation(),
    addBtnText: t('exclusion.apps.addApp'),
    exportFileNamePrefix: 'RestrictedApps',
    exportColumns: columns,
    exportQuery: MobileProtectData.Queries.queryApplicationsForExport,
    exportQueryArgs: { exclusionType: MobileProtectData.ExclusionType.Restricted },
  })

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

  const [importAppsStartAction, importAppsTask] = useStatefulReduxMutation(RestrictedAPPs.mutationImportRestrictedApplication)
  const importAppTaskPrev = usePrevious(importAppsTask)
  useEffect(() => {
    if (!importAppsTask.loading && importAppTaskPrev.loading && importAppsTask.error) {
      setImportLoading(false)
      importOnClose()
      const error = (importAppsTask as any).error
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
        snackbar.enqueueMessage(t('exclusion.apps.applicationImportFailureMsg'), 'error')
      }
    } else if (!importAppsTask.loading && importAppTaskPrev.loading) {
      setImportLoading(false)
      importOnClose()
      setDialogProps(defaultDialogState) // clear form and close dialog

      if (importAppsTask.data.successes > 0) {
        snackbar.enqueueMessage(
          importAppsTask.data.successes === 1
            ? t('exclusion.apps.applicationImportSingularSuccessMsg')
            : t('exclusion.apps.applicationImportMultipleSuccessesMsg', { count: importAppsTask.data.successes }),
          'success',
        )
      }
      if (importAppsTask.data.failures.length > 0) {
        snackbar.enqueueMessage(
          importAppsTask.data.failures.length === 1
            ? t('exclusion.apps.applicationImportSingularFailureMsg')
            : t('exclusion.apps.applicationImportMultipleFailuresMsg', { count: importAppsTask.data.failures.length }),
          'error',
        )
      }
      refetch()
      providerProps?.selectedProps.resetSelectedItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importAppsTask])

  const handleSelectFiles = (files: Array<File>) => {
    setSelectedFiles(files)
  }

  const cancelLabel = 'common.cancel'

  return (
    <>
      <AppModalDialog {...dialogProps} />

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
            {t('exclusion.apps.addViaSelect')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handlePopoverClose()
              openAddManualForm()
            }}
          >
            {t('exclusion.apps.addManually')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handlePopoverClose()
              setImportDialogStateId(Symbol('file-upload'))
            }}
          >
            {t('exclusion.apps.addViaImport')}
          </MenuItem>
        </MenuList>
      </Popover>

      <Dialog open={importOnOpen} onClose={importOnClose} maxWidth="sm" fullWidth={true}>
        <DialogChildren
          title={t('exclusion.apps.applicationImportUploadTitle')}
          onClose={importOnClose}
          content={
            <>
              <Typography variant="body2" gutterBottom={true}>
                {t('common.importUploadDescription')} <DownloadSampleLink csvSampleFile={CsvSampleFile.Application} />
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
                  importAppsStartAction(selectedFiles[0])
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
}

export default RestrictedApps
