/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { Formik } from 'formik'
import { isEmpty, sortBy } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { Box, Button, Collapse } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import { usePrevious } from '@ues-behaviour/react'
import type { Certificate, CONFIG_KEY, TenantConfigItem } from '@ues-data/dlp'
import { CertificateData } from '@ues-data/dlp'
import { Permission, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { BasicAdd as AddIcon, BasicDelete, BasicSearch } from '@ues/assets'
import type { Loading, ToolbarProps } from '@ues/behaviours'
import {
  AppliedFilterPanel,
  BasicTable,
  ConfirmationDialog,
  TableProvider,
  TableSearchPanel,
  TableToolbar,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

import makeStyles from '../../styles'
import { useDlpSettingsPermissions } from '../../useDlpSettingsPermissions'
import type { CertUploadDialogProps } from './cert-file-upload'
import CertificateFileUploadDialog from './cert-file-upload'
import { useTrustedCertificatesTableProps } from './useTrustedCertificatesTableProps'

const TrustedCertificatesSettings: React.FC = () => {
  useSecuredContent(Permission.BIP_SETTINGS_READ)
  const { canUpdate } = useDlpSettingsPermissions()
  const classes = makeStyles()
  const { t } = useTranslation(['dlp/common'])
  const snackbar = useSnackbar()
  const [showSearch, setShowSearch] = useState(false)
  //TODO update search functionality if necessary
  const [searchString, setSearchString] = useState<string>()

  const [openDialogId, setOpenDialogId] = useState<string>('')
  const onConfirmationCloseDialog = () => {
    setOpenDialogId('')
  }

  //fetch certificates
  const {
    error: certificatesError,
    loading: certificatesLoading,
    data: certificatesList,
    refetch: refetchCertificates,
    fetchMore: fetchMoreCertificates,
  } = useStatefulReduxQuery(CertificateData.queryCertificates)

  const data = useMemo(() => certificatesList ?? [], [certificatesList])

  //delete certificates
  const [deleteCertificarteStartAction, deleteCertificarteTask] = useStatefulReduxMutation(
    CertificateData.mutationDeleteCertificate,
  )

  // handling for "deletion"
  const deleteTemplateTaskPrev = usePrevious(deleteCertificarteTask)
  useEffect(() => {
    if (!deleteCertificarteTask.loading && deleteTemplateTaskPrev.loading && deleteCertificarteTask.error) {
      snackbar.enqueueMessage(t('setting.trustedCertificates.error.delete'), 'error')
    } else if (!deleteCertificarteTask.loading && deleteTemplateTaskPrev.loading) {
      snackbar.enqueueMessage(t('setting.trustedCertificates.success.delete'), 'success')
      providerProps?.selectedProps.resetSelectedItems()
      refetchCertificates()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteCertificarteTask])

  const onDeleteCertificate = () => {
    if (getSelected.length > 0) {
      getSelected.forEach((row: Certificate) => {
        deleteCertificarteStartAction({ alias: row.alias })
        setOpenDialogId('')
      })
    }
  }

  const defaultCertUploadDialog: CertUploadDialogProps<Certificate> = {
    openDialog: false,
  }

  const [certUploadDialogProps, setCertUploadDialogProps] = useState<CertUploadDialogProps<Certificate>>(defaultCertUploadDialog)

  const openUploadCertificateForm = () => {
    setCertUploadDialogProps({
      openDialog: true,
      onClose: () => {
        setCertUploadDialogProps(defaultCertUploadDialog)
      },
      onSubmit: () => {
        setCertUploadDialogProps(defaultCertUploadDialog)
        refetchCertificates()
      },
    })
  }

  const { tableProps, providerProps, filterLabelProps, getSelected } = useTrustedCertificatesTableProps({
    data,
    selectionEnabled: canUpdate,
  })

  const [tableData, setTableData] = useState(providerProps.data ?? [])

  const onSearchCertificate = useCallback(
    subject => {
      setSearchString(subject)
      const newData = tableData.filter(cert => cert.subject?.toLowerCase().includes(subject?.toLowerCase()))
      setTableData(newData)
    },
    [tableData],
  )

  useEffect(() => {
    if (!searchString && ((isEmpty(tableData) && providerProps.data.length) || providerProps.data)) {
      setTableData(providerProps.data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerProps.data, tableData, onSearchCertificate])

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
          <Button startIcon={<AddIcon />} variant="contained" color="secondary" onClick={openUploadCertificateForm}>
            {t('setting.trustedCertificates.buttons.addNew')}
          </Button>
        )}
        {canUpdate && numOfselectedItems > 0 && Object.values(getSelected)?.some((row: any) => row?.alias) && (
          <Button
            startIcon={canUpdate && <BasicDelete />}
            variant="contained"
            color="primary"
            onClick={() => setOpenDialogId('remove-from-list-confirmation')}
          >
            {t('setting.trustedCertificates.buttons.delete')}
          </Button>
        )}
      </>
    ) : null,
    end: showSearch ? (
      <Collapse in={showSearch}>
        <TableSearchPanel
          onSearch={onSearchCertificate}
          onReset={() => setShowSearch(false)}
          searchPlaceholder={t('setting.table.list.searchPlaceholder')}
        />
      </Collapse>
    ) : (
      <IconButton onClick={() => setShowSearch(true)} aria-label="show more">
        <BasicSearch />
      </IconButton>
    ),
    bottom: (
      <>
        {numOfselectedItems ? (
          <ConfirmationDialog
            open={openDialogId === 'remove-from-list-confirmation'}
            title={t('setting.trustedCertificates.dialogs.removeFromYourList.title')}
            content={t('setting.trustedCertificates.dialogs.removeFromYourList.title_plural', { count: numOfselectedItems })}
            cancelButtonLabel={t('setting.trustedCertificates.dialogs.removeFromYourList.cancelBtn')}
            confirmButtonLabel={t('setting.trustedCertificates.dialogs.removeFromYourList.confirmBtn')}
            onConfirm={() => {
              onDeleteCertificate()
            }}
            onCancel={onConfirmationCloseDialog}
          />
        ) : null}
        <CertificateFileUploadDialog {...certUploadDialogProps} />
        <AppliedFilterPanel {...providerProps.filterProps} {...filterLabelProps} />
      </>
    ),
  }

  return (
    <>
      <Box>
        <Typography variant="h2">{t('setting.trustedCertificates.title')}</Typography>
        <Typography variant="body2" className={classes.description}>
          {t('setting.trustedCertificates.description')}
        </Typography>
      </Box>
      <TableToolbar {...toolbarProps} />
      <TableProvider
        basicProps={providerProps?.basicProps}
        selectedProps={providerProps?.selectedProps}
        sortingProps={providerProps?.sortingProps}
        filterProps={providerProps?.filterProps}
      >
        <BasicTable noDataPlaceholder={tableProps?.noDataPlaceholder} data={tableData} />
      </TableProvider>
    </>
  )
}

export default TrustedCertificatesSettings
