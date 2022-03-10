import React, { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { IconButton } from '@material-ui/core'

import { PolicyListDeleteMutation, PolicyListQuery } from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'
import { BasicAdd, BasicDelete, BasicSwapHoriz } from '@ues/assets'

import { CONFIRM_DELETE_POLICY_FROM_LIST } from '../../config/consts/dialogIds'
import { Header, renderStyle as HeaderStyle } from '../../list/Header'
import useSelectionCount from '../../list/useSelectionCount'
import PolicyListProvider, { Context as ListProviderContext } from '../../providers/PolicyListProvider'
import {
  ErrorBoundary,
  hasEmptySelection,
  Loading,
  reportClientError,
  RiskLevelFilterOptions,
  StandaloneCapability as capability,
  useCapability,
  useFilters,
  useQueryCallback,
  useSelection,
  useSorting,
} from '../../shared'
import { isPolicyAssigned } from '../policyInfo/common'
import { PolicyHeader } from './Header'
import styles from './index.module.less'
import { default as PolicyList } from './PolicyList'
import { DeletionConfirmation } from './PolicyModals'

const LoadingView = memo(({ children }) => {
  const { loading, data } = useContext(ListProviderContext)
  if (!data && loading) {
    return <Loading />
  }
  return children
})

export const DeleteNode = memo(
  ({
    t,
    selectionState,
    onDeleteSelected,
    dialogId,
    selected,
    onCloseDeleteConfirmation,
    onDeleteConfirmation,
    deleteInProgress,
    handleDeleteDialog,
  }) => {
    const emptySelection = hasEmptySelection(selectionState)
    if (emptySelection) {
      return null
    }
    return (
      <>
        <IconButton onClick={onDeleteSelected} aria-label={t('policies.deleteUserOrGroupIconBtn')} title={t('common.delete')}>
          <BasicDelete />
        </IconButton>
        {handleDeleteDialog && (
          <DeletionConfirmation
            dialogId={dialogId}
            policies={selected}
            onClose={onCloseDeleteConfirmation}
            onDelete={onDeleteConfirmation}
            deleteInProgress={deleteInProgress}
          />
        )}
      </>
    )
  },
)

const FrontButtons = memo(({ onCreatePolicy, onRankPolicy, t, canEdit }) => {
  const { total } = useContext(ListProviderContext)
  const hasRankIcon = total > 1
  return (
    <>
      {' '}
      {canEdit && (
        <IconButton onClick={onCreatePolicy} title={t('policies.addNew')}>
          <BasicAdd />
        </IconButton>
      )}
      {hasRankIcon && (
        <IconButton onClick={onRankPolicy} title={t('policies.rankPolicies')}>
          <BasicSwapHoriz />
        </IconButton>
      )}
    </>
  )
})

const SelectionCount = memo(props => {
  const { t } = useTranslation()
  const { total } = useContext(ListProviderContext)
  const count = useSelectionCount(props, total)
  if (count === 0) {
    return null
  }

  return (
    <span className={HeaderStyle.selectionCount} aria-label={t('policies.selectedPolicies')}>
      {t('common.selectedItemsCount', { count })}
    </span>
  )
})

const getSelectedPolicies = (policies, selectionIds, selectMode, searchText) =>
  policies.filter(zone => {
    let allow = true
    if (selectMode) {
      // In normal selection mode, export everything if
      // nothing is selected, or just export the ones
      // selected if something is selected.
      if (selectionIds.length > 0) {
        allow = allow && selectionIds.includes(zone.id)
      }
    } else {
      // In inverse selection mode, export everything unless
      // the id is explicitly deselected.
      allow = allow && !selectionIds.includes(zone.id)
    }

    if (searchText.length >= 1) {
      allow = allow && zone.name.toLowerCase().includes(searchText.toLowerCase())
    }
    return allow
  })

export const PoliciesDashboardView = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [sorting, onSort] = useSorting({ key: 'policies', initSortBy: 'name', initSortDirection: 'ASC' })
  const {
    onSelected,
    onSelectAll,
    selectionState,
    selectedCount = 0,
    selectedAll = false,
    deselectedCount = 0,
    selectionVariables,
    clearSelection,
    validateSelection,
  } = useSelection({ key: 'policies' })
  const { onSearchChange, searchText } = useFilters(RiskLevelFilterOptions)
  const [state, setState] = useState({
    allowRowSelection: true,
    selected: [],
  })
  const [canEdit] = useCapability(capability.POLICIES)
  const location = useLocation()

  const onLoadMoreRows = useCallback(({ startIndex }) => {
    // FIXME: do nothing for now, decide how this should work...
  }, [])

  const onRowSelected = useCallback(
    rowSelectId => {
      if (state.allowRowSelection) {
        setState({ ...state, rowSelectId })
      }
    },
    [state],
  )

  const headerTitle = useMemo(() => {
    return <PolicyHeader title={t('policies.title')} />
  }, [t])

  const deleteSelected = useQueryCallback(PolicyListQuery, { fetchPolicy: 'cache-only' }, result => {
    const policies = getSelectedPolicies(result?.policies || [], selectionVariables.ids, selectionVariables.selectMode, searchText)
    if (policies && policies.length > 0) {
      const selected = policies.map(policy => ({
        id: policy.id,
        name: policy.name,
        appliedUsers: isPolicyAssigned(policy),
      }))
      setState({ ...state, dialogId: CONFIRM_DELETE_POLICY_FROM_LIST, selected })
    }
  })

  const onCreatePolicy = useCallback(() => {
    const pathname = location.pathname.replace(/\/policies.*$/, '/policies/create')
    navigate(pathname, { state: { goBack: true } })
  }, [navigate, location])

  const onRankPolicy = useCallback(() => {
    const pathname = location.pathname.replace(/\/policies.*$/, '/policies/rank')
    navigate(pathname, { state: { goBack: true } })
  }, [navigate, location])

  const variables = useMemo(
    () => ({
      searchText,
      sortBy: sorting.sortBy,
      sortDirection: sorting.sortDirection,
    }),
    [searchText, sorting.sortBy, sorting.sortDirection],
  )

  const [deletePolicies, { loading: deleteInProgress }] = useStatefulApolloMutation(PolicyListDeleteMutation, {
    onCompleted: clearSelection,
    onError: deleteError => console.error(deleteError),
    refetchQueries: () => [{ query: PolicyListQuery.query, variables }],
  })

  const onCloseDeleteConfirmation = useCallback(
    () =>
      setState(state => {
        const { dialogId, ...rest } = state
        return { ...rest }
      }),
    [],
  )
  const onDeleteConfirmation = useCallback(async () => {
    try {
      await deletePolicies({ variables: { ids: state.selected.map(item => item.id) } })
    } catch (e) {
      reportClientError(e)
    }
    onCloseDeleteConfirmation()
  }, [deletePolicies, onCloseDeleteConfirmation, state.selected])

  const renderDelete = canEdit ? (
    <DeleteNode
      t={t}
      {...state}
      selectionState={selectionState}
      onCloseDeleteConfirmation={onCloseDeleteConfirmation}
      onDeleteConfirmation={onDeleteConfirmation}
      onDeleteSelected={deleteSelected}
      deleteInProgress={deleteInProgress}
      handleDeleteDialog
    />
  ) : null

  return (
    <PolicyListProvider variables={variables}>
      <LoadingView>
        <div id="policies-dashboard-list" className={styles.listContainer}>
          <Header
            title={headerTitle}
            selectionCount={
              <SelectionCount selectedAll={selectedAll} selectedCount={selectedCount} deselectedCount={deselectedCount} />
            }
            frontActionButtons={
              <FrontButtons onCreatePolicy={onCreatePolicy} onRankPolicy={onRankPolicy} t={t} canEdit={canEdit} />
            }
            actionButtons={renderDelete}
            onSearchChange={onSearchChange}
            searchText={searchText}
            filterBar={Header.defaultProps.filterBar}
          />
          <PolicyList
            onSort={onSort}
            sortBy={sorting.sortBy}
            sortDirection={sorting.sortDirection}
            onLoadMoreRows={onLoadMoreRows}
            onRowSelected={onRowSelected}
            singleSelectId={state.rowSelectId}
            selectionState={selectionState}
            onSelected={onSelected}
            onSelectAll={onSelectAll}
            selectedAll={selectedAll}
            canEdit={canEdit}
            selectedCount={selectedCount}
            deselectedCount={deselectedCount}
            validateSelection={validateSelection}
          />
        </div>
      </LoadingView>
    </PolicyListProvider>
  )
}

export const PoliciesDashboard = memo(() => (
  <ErrorBoundary>
    <PoliciesDashboardView />
  </ErrorBoundary>
))

export default PoliciesDashboard
