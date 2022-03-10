/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormControl, Paper, TextField } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { usePrevious } from '@ues-behaviour/react'
import type { BrowserDomain } from '@ues-data/dlp'
import { Domain } from '@ues-data/dlp'
import type { PagableResponse } from '@ues-data/shared'
import { Permission, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { ROW_HEIGHT } from '@ues-info/shared'
import {
  ContentArea,
  ContentAreaPanel,
  InfiniteTable,
  InfiniteTableProvider,
  SecuredContentBoundary,
  TableToolbar,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

import { useDlpSettingsPermissions } from '../../useDlpSettingsPermissions'
import { ENQUEUE_TYPE } from '../shared/notification'
import GeneralDialog from './dialogs/GeneralDialog'
import makeStyles from './styles'
import { useDomainTableProps } from './useGeneralTableProps'
import { useToolbar } from './useToolbar'

const WhitelistSettings: React.FC = () => {
  useSecuredContent(Permission.BIP_SETTINGS_READ)
  const { canUpdate } = useDlpSettingsPermissions()
  const classes = makeStyles()
  const { t } = useTranslation(['dlp/common'])
  const snackbar = useSnackbar()
  const [createDomainAction, createDomainTask] = useStatefulReduxMutation(Domain.mutationCreateBrowserDomain)
  const [deleteDomainAction, deleteDomainTask] = useStatefulReduxMutation(Domain.mutationDeleteBrowserDomain)
  const [editDomainAction, editDomainTask] = useStatefulReduxMutation(Domain.mutationEditBrowserDomain)

  const { loading, data: domains, error, refetch: refetchDomains } = useStatefulReduxQuery(Domain.queryBrowserDomains, {
    variables: {
      policiesAssignment: true,
    },
  })
  console.log('Domain List entered loading: ', { loading, domains })

  useEffect(() => {
    if (error) {
      snackbar.enqueueMessage(t('setting.unexpectedErrorMessage'), ENQUEUE_TYPE.ERROR)
    }
  }, [error, snackbar, t])

  const data = useMemo(() => domains ?? ({} as PagableResponse<BrowserDomain>), [domains])

  const emptyTableMaxHeight = ROW_HEIGHT * 2 //header + 1 row

  const [setOfDomains, setSetOfDomains] = useState(null)
  const [tableHeight, setTableHeight] = useState(emptyTableMaxHeight)
  const [validEmailDomains, setValidEmailDomains] = useState(true)

  useEffect(() => {
    const domainElements = data?.elements
    setSetOfDomains({
      elements: domainElements,
    })
    setTableHeight((ROW_HEIGHT * (domainElements?.length + 1)) | emptyTableMaxHeight)
  }, [data, emptyTableMaxHeight])

  const onDeleteDomain = (itemIds: BrowserDomain[]) => {
    itemIds.forEach(item => {
      deleteDomainAction({ browserDomainGuid: item.guid })
    })
  }
  const onEnableDomain = (itemIds: BrowserDomain[]) => {
    console.log(
      'Items to be enabled are: ',
      itemIds.map((i: any) => i.domain),
    )
  }
  const onDisableDomain = (itemIds: BrowserDomain[]) => {
    console.log(
      'Items to be disabled are: ',
      itemIds.map((i: any) => i.domain),
    )
  }

  const onCreate = (entity: BrowserDomain) => {
    const domainNameCheck = data?.elements?.filter(element => element.domain === entity.domain)
    if (domainNameCheck?.length) {
      return snackbar.enqueueMessage(t('setting.domainNameErrorMessage'), ENQUEUE_TYPE.ERROR)
    }
    console.log('Browser domain creating', entity)
    createDomainAction(entity)
  }

  const onEdit = (entity: BrowserDomain) => {
    console.log('Browser domain editing', entity)
    editDomainAction({ browserDomainGuid: entity.guid, browserDomain: entity })
  }

  const handleRowClick = (rowData: { columnData: any; dataKey: string; event: any }) => {
    console.log('handleRowClick = ', rowData)
  }

  // domains
  const {
    tableProps: domainsTableProps,
    providerProps: domainsProviderProps,
    filterLabelProps: domainsFilterLabelProps,
    getSelected: getSelectedDomain,
    editDialogProps,
  } = useDomainTableProps({
    data: setOfDomains,
    handleRowClick: handleRowClick,
    onEdit: onEdit,
    selectionEnabled: canUpdate,
  })

  const toolbarPropsEnabled = useToolbar({
    selectedItems: getSelectedDomain,
    onDeleteDomain: onDeleteDomain,
    onDisableDomain: onDisableDomain,
    onEnableDomain: onEnableDomain,
    onCreate: onCreate,
    // onEdit: onEdit,
    filterLabelProps: domainsFilterLabelProps,
    providerProps: domainsProviderProps,
  })

  // handling for "deletion"
  const deleteDomainTaskPrev = usePrevious(deleteDomainTask)
  useEffect(() => {
    if (!deleteDomainTask.loading && deleteDomainTaskPrev.loading && deleteDomainTaskPrev.error) {
      snackbar.enqueueMessage(t('setting.general.domain.dialog.error.delete'), ENQUEUE_TYPE.ERROR)
    } else if (!deleteDomainTask.loading && deleteDomainTaskPrev.loading) {
      snackbar.enqueueMessage(t('setting.general.domain.dialog.success.delete'), ENQUEUE_TYPE.SUCCESS)
      refetchDomains()
      domainsProviderProps?.selectedProps.resetSelectedItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteDomainTask])

  //handling for "create"
  const createDomainTaskPrev = usePrevious(createDomainTask)
  useEffect(() => {
    if (!createDomainTask.loading && createDomainTaskPrev.loading && createDomainTaskPrev.error) {
      snackbar.enqueueMessage(t('setting.general.domain.dialog.error.create'), ENQUEUE_TYPE.ERROR)
    } else if (!createDomainTask.loading && createDomainTaskPrev.loading) {
      snackbar.enqueueMessage(t('setting.general.domain.dialog.success.create'), ENQUEUE_TYPE.SUCCESS)
      refetchDomains()
      domainsProviderProps?.selectedProps.resetSelectedItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createDomainTask])

  // handling for "create"
  const editDomainTaskPrev = usePrevious(editDomainTask)
  useEffect(() => {
    if (!editDomainTask.loading && editDomainTaskPrev.loading && editDomainTaskPrev.error) {
      snackbar.enqueueMessage(t('setting.general.domain.dialog.error.edit'), ENQUEUE_TYPE.ERROR)
    } else if (!editDomainTask.loading && editDomainTaskPrev.loading) {
      snackbar.enqueueMessage(t('setting.general.domain.dialog.success.edit'), ENQUEUE_TYPE.SUCCESS)
      refetchDomains()
      domainsProviderProps?.selectedProps.resetSelectedItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editDomainTask])

  const emailDomainsCheck = e => {
    return setValidEmailDomains(
      e.target.value
        .trim()
        .split(',')
        .filter(Boolean)
        .map(domain => !!domain.match(/([a-z0-9]+\.)*[a-z0-9]+\.[a-z]{2,3}$/))
        .every(isDomainMatch => isDomainMatch),
    )
  }

  return (
    <div>
      <GeneralDialog {...editDialogProps} />
      <Box className={classes.title}>
        <Typography variant="h2">{t('setting.general.domain.title')}</Typography>
        <Typography variant="body2" className={classes.description}>
          {t('setting.general.domain.description')}
        </Typography>
      </Box>
      <Box className={classes.container}>
        <TableToolbar {...toolbarPropsEnabled} />
        <Box className={classes.table} height={tableHeight}>
          <InfiniteTableProvider
            basicProps={domainsProviderProps.basicProps}
            selectedProps={domainsProviderProps.selectedProps}
            sortingProps={domainsProviderProps.sortingProps}
            data={domainsProviderProps.data ?? []}
            filterProps={domainsProviderProps.filterProps}
          >
            <InfiniteTable
              noDataPlaceholder={domainsTableProps.noDataPlaceholder}
              infinitLoader={domainsTableProps.infinitLoader}
            />
          </InfiniteTableProvider>
        </Box>
      </Box>
    </div>
  )
}

export default WhitelistSettings
