/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import { isEmpty, template } from 'lodash-es'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Box, Card } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'

import { usePrevious } from '@ues-behaviour/react'
import { TemplateData } from '@ues-data/dlp'
import { Permission, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { TemplateInfo } from '@ues-info/shared'
import {
  BasicTable,
  ContentArea,
  ContentAreaPanel,
  InfiniteTable,
  InfiniteTableProvider,
  SecuredContentBoundary,
  TableProvider,
  TableToolbar,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

import makeStyles from '../../styles'
import { useDlpSettingsPermissions } from '../../useDlpSettingsPermissions'
import { buildTemplatesListQuery } from './buildTemplatesQueryParams'
import { useTemplateTableProps } from './useTemplateTableProps'
import { useTemplateTableToolbar } from './useTemplateTableToolbar'

const TemplateSettings: React.FC = () => {
  useSecuredContent(Permission.BIP_SETTINGS_READ)
  const { canUpdate } = useDlpSettingsPermissions()
  const classes = makeStyles()
  const { t } = useTranslation(['dlp/common'])
  const navigate = useNavigate()
  const { enqueueMessage } = useSnackbar()
  const [openSideDrawler, setOpenSideDrawler] = useState(false)
  const [selectedRow, setSelectedRow] = useState({})
  const [showSearch, setShowSearch] = useState(false)
  const [searchString, setSearchString] = useState<string>()
  const [allowedForAddAsCustom, setallowedForAddAsCustom] = useState([])

  const [createTemplateAtion, createTemplateTask] = useStatefulReduxMutation(TemplateData.mutationCreateTemplate)
  const [editTemplateAction, editTemplateTask] = useStatefulReduxMutation(TemplateData.mutationEditTemplate)
  const [deleteTemplateAction, deleteTemplateTask] = useStatefulReduxMutation(TemplateData.mutationDeleteTemplate)
  const [assignTemplatesAction, assignTemplatesTask] = useStatefulReduxMutation(TemplateData.mutationAssotiateTemplates)
  const [unassignTemplatesAction, unassignTemplatesTask] = useStatefulReduxMutation(TemplateData.mutationDisassociateTemplates)

  // Sorting functionality below
  const [sortParams, setSortParams] = useState('name ASC')

  // Filtering functionality below
  const [activeFilters, setActiveFilters] = useState({})

  const initialSearchQueryParams = useMemo(
    () => ({
      variables: {
        max: 25,
        offset: 0,
        sortBy: sortParams,
        query: activeFilters,
      },
    }),
    [activeFilters, sortParams],
  )

  const templateAssociatedList = useStatefulReduxQuery(TemplateData.queryAssociatedTemplates, initialSearchQueryParams)
  const templateList = useStatefulReduxQuery(TemplateData.queryTemplates, initialSearchQueryParams)

  useEffect(() => {
    if (templateAssociatedList.error || templateList.error) enqueueMessage(t('setting.template.error.listview'), 'error')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateAssociatedList.error, templateList.error])

  // handling for "add to your list"
  const assignTemplatesTaskPrev = usePrevious(assignTemplatesTask)
  useEffect(() => {
    if (!assignTemplatesTask.loading && assignTemplatesTaskPrev.loading && assignTemplatesTask.error) {
      enqueueMessage(t('setting.template.error.addToYourList'), 'error')
    } else if (!assignTemplatesTask.loading && assignTemplatesTaskPrev.loading) {
      enqueueMessage(t('setting.template.success.addToYourList'), 'success')
      templateAssociatedList.refetch()
      templateList.refetch()
      providerProps?.selectedProps.resetSelectedItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignTemplatesTask])

  // handling for "remove from your list"
  const unassignTemplatesTaskPrev = usePrevious(unassignTemplatesTask)
  useEffect(() => {
    if (!unassignTemplatesTask.loading && unassignTemplatesTaskPrev.loading && unassignTemplatesTask.error) {
      enqueueMessage(t('setting.template.error.removeFromYourList'), 'error')
    } else if (!unassignTemplatesTask.loading && unassignTemplatesTaskPrev.loading) {
      enqueueMessage(t('setting.template.success.removeFromYourList'), 'success')
      templateAssociatedList.refetch()
      templateList.refetch()
      providerProps?.selectedProps.resetSelectedItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unassignTemplatesTask])

  // handling for "deletion"
  const deleteTemplateTaskPrev = usePrevious(deleteTemplateTask)
  useEffect(() => {
    if (!deleteTemplateTask.loading && deleteTemplateTaskPrev.loading && deleteTemplateTask.error) {
      enqueueMessage(t('setting.template.error.delete'), 'error')
    } else if (!deleteTemplateTask.loading && deleteTemplateTaskPrev.loading) {
      enqueueMessage(t('setting.template.success.delete'), 'success')
      templateAssociatedList.refetch()
      templateList.refetch()
      providerProps?.selectedProps.resetSelectedItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteTemplateTask])

  const fetchMoreApps = async ({ offset, max }): Promise<any> => {
    if (sortParams === 'undefined undefined') {
      await templateList.fetchMore({ offset: offset, max: max })
    } else {
      await templateList.fetchMore({ offset: offset, max: max, sortBy: sortParams })
    }
  }

  const handleRowClick = (data: { rowData: any; event: any }) => {
    setSelectedRow(data.rowData)
    setOpenSideDrawler(true)
  }

  const { tableProps, providerProps, filterLabelProps, selectedItems } = useTemplateTableProps({
    data: templateList.data,
    handleRowClick: handleRowClick,
    fetchMore: fetchMoreApps,
    setSortParams: setSortParams,
    selectionEnabled: canUpdate,
  })

  useEffect(() => {
    if (!isEmpty(activeFilters) && isEmpty(providerProps.filterProps.activeFilters)) {
      setActiveFilters({})
    } else if (!isEmpty(providerProps.filterProps.activeFilters)) {
      setActiveFilters(buildTemplatesListQuery(providerProps.filterProps.activeFilters))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerProps.filterProps.activeFilters])

  const toolbarProps = useTemplateTableToolbar({
    filterProps: providerProps.filterProps,
    filterLabelProps: filterLabelProps,
    selectedItems: selectedItems,
    associatedTemplateGuids: templateAssociatedList?.data?.elements.map(template => template.guid),
    onSearch: () => {
      /* handleSearch  */
      console.log('onSearch')
    },
    onAdd: () => console.log('Redirects to Template Create page'), // TODO implement Create Template page to navigate on it
    onDelete: guids => {
      console.log('onDelete guids= ', guids)
      guids.forEach(guid => {
        deleteTemplateAction({ templateId: guid })
      })
    },
    onAdd2YourList: guids => {
      console.log('onAdd2YourList')
      assignTemplatesAction({ templateIds: guids })
    },
    onRemoveFromYourList: guids => {
      console.log('onRemoveFromYourList')
      unassignTemplatesAction({ templateIds: guids })
    },
    onDuplicate: guids => {
      console.log('onDuplicate ')
      // TODO: unsupported on backend
    },
    loading: templateList.loading,
  })

  return (
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
  )
}

export default TemplateSettings
