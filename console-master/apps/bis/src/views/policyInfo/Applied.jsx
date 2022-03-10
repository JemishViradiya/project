import React, { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { AppliedListQuery } from '@ues-data/bis'
import { BasicAdd } from '@ues/assets'

import { CONFIRM_DELETE_POLICY_APPLIED_USERS_GROUPS, POLICY_APPLIED_USERS_GROUPS } from '../../config/consts/dialogIds'
import FilterButton from '../../list/FilterButton'
import { Header, renderStyle as HeaderStyle } from '../../list/Header'
import useSelectionCount from '../../list/useSelectionCount'
import AppliedListProvider, { Context as AppliedListProviderContext } from '../../providers/AppliedListProvider'
import { Context as PolicyContext } from '../../providers/PolicyProvider'
import {
  Container,
  hasEmptySelection,
  IconButton,
  reportClientError,
  Section,
  StandaloneCapability as capability,
  TranslatedErrorBoundary as ErrorBoundary,
  useCapability,
  useFilters,
  useQueryCallback,
  useSelection,
  useUpdatedOptions,
} from '../../shared'
import { DeleteNode } from '../policies/index'
import { AddAppliedModal } from './AddAppliedModal'
import appliedStyles from './Applied.module.less'
import AppliedList from './AppliedList'
import { DeleteAppliedModal } from './DeleteAppliedModal'
import styles from './index.module.less'

const DESC = 'policies.details.appliedListHeader'
export const GROUP_TYPENAME = 'BIS_DirectoryGroup'
const USER_TYPENAME = 'BIS_DirectoryUser'
const GROUP_ONLY = 'groupOnly'

const filterOptions = Object.freeze({
  [GROUP_ONLY]: ['true'],
})

const groupOnlyFilterOptionsBase = {
  field: GROUP_ONLY,
  levels: [{ key: 'true' }],
}

const FrontendButtons = memo(
  ({ t, onAssignUser, canEdit }) =>
    canEdit && (
      <IconButton onClick={onAssignUser} title={t('policies.details.assignUserToPolicy')}>
        <BasicAdd />
      </IconButton>
    ),
)
FrontendButtons.displayName = 'FrontendButtons'

const SelectionCount = memo(props => {
  const policies = useContext(AppliedListProviderContext)
  const count = useSelectionCount(props, policies.data.length)
  if (count === 0) {
    return null
  }
  return <span className={HeaderStyle.selectionCount}>{props.t('common.selectedItemsCount', { count })}</span>
})

const ActionButtonsNode = memo(({ t, selectionState, deleteSelected, canEdit, groupOnlyOptions }) => {
  return (
    <>
      {canEdit && <DeleteNode t={t} selectionState={selectionState} onDeleteSelected={deleteSelected} />}
      <FilterButton
        id="groupOnly-filter-button"
        key="groupOnly-filter"
        field={groupOnlyOptions.field}
        label={t('policies.details.appliedListGroupsOnly')}
        options={groupOnlyOptions.levels}
        styleClass={appliedStyles.filterButton}
        singleSelection
      />
    </>
  )
})

const mapCachedQuery = ({ applied = { users: [], groups: [] } } = {}, groupOnly) =>
  groupOnly ? { ...applied, users: [] } : applied

const computeSelection = (selectionState, users, groups) => {
  if (selectionState.selectedAll) {
    return { users, groups }
  } else if (selectionState.selectMode) {
    const selected = Object.values(selectionState.selected)
    return {
      users: selected.filter(item => item.__typename !== GROUP_TYPENAME),
      groups: selected.filter(item => item.__typename === GROUP_TYPENAME),
    }
  } else {
    const deselected = Object.values(selectionState.deselected)
    return {
      users: users.filter(({ id }) => !deselected.some(item => item.id === id)),

      groups: groups.filter(({ id }) => !deselected.some(item => item.id === id)),
    }
  }
}

const AppliedViewDetails = ({
  id,
  variables,
  groupOnly,
  addDialogId,
  onAddModalShow,
  onAddModalClose,
  filters: { searchText, onSearchChange, onFilterChange, filters },
  selection: { onSelected, onSelectAll, selectionState, selectedCount, selectedAll, deselectedCount },
}) => {
  const { t } = useTranslation()
  const policy = useContext(PolicyContext)
  const { deleteUsersAndGroups, deleteInProgress, addUsersAndGroups, addUsersAndGroupsLoading } = useContext(
    AppliedListProviderContext,
  )

  const [deleteModal, setDeleteModal] = useState({
    toDelete: [],
  })
  const [canEdit] = useCapability(capability.POLICIES)

  const [groupOnlyOptions] = useUpdatedOptions(filters, onFilterChange, groupOnlyFilterOptionsBase)

  const onLoadMoreRows = useCallback(({ startIndex }) => {
    // FIXME: do nothing for now, decide how this should work...
  }, [])

  const onDeleteRow = useQueryCallback(AppliedListQuery, { fetchPolicy: 'cache-only', variables }, (result, itemId) => {
    const { users, groups } = mapCachedQuery(result, groupOnly)
    const toDelete = {
      users: users.filter(({ id }) => id === itemId),
      groups: groups.filter(({ id }) => id === itemId),
    }
    setDeleteModal({ dialogId: CONFIRM_DELETE_POLICY_APPLIED_USERS_GROUPS, toDelete })
  })

  const deleteSelected = useQueryCallback(
    AppliedListQuery,
    { fetchPolicy: 'cache-only', variables, skip: hasEmptySelection(selectionState) },
    result => {
      const { users, groups } = mapCachedQuery(result, groupOnly)
      const selection = computeSelection(selectionState, users, groups)
      if (selection.users.length > 0 || selection.groups.length > 0) {
        setDeleteModal({ dialogId: CONFIRM_DELETE_POLICY_APPLIED_USERS_GROUPS, toDelete: selection })
      }
    },
  )

  const handleOnAdd = useCallback(
    appliedData => {
      if (canEdit) {
        const userIds = appliedData.filter(({ __typename }) => __typename === USER_TYPENAME).map(({ id }) => id)
        const groupIds = appliedData.filter(({ __typename }) => __typename === GROUP_TYPENAME).map(({ id }) => id)
        addUsersAndGroups({
          variables: {
            policyId: id,
            userIds,
            groupIds,
          },
        })
      }
    },
    [addUsersAndGroups, canEdit, id],
  )

  const onDeleteModalClose = useCallback(() => setDeleteModal(() => ({})), [])
  const onDeleteModalDelete = useCallback(
    async ids => {
      // TODO: lookup ids to know user/group
      if (canEdit) {
        try {
          await deleteUsersAndGroups({
            variables: {
              policyId: id,
              userIds: deleteModal.toDelete.users.map(({ id }) => id),
              groupIds: deleteModal.toDelete.groups.map(({ id }) => id),
            },
          })
        } catch (e) {
          reportClientError(e)
        }
      }
      onDeleteModalClose()
    },
    [canEdit, onDeleteModalClose, deleteUsersAndGroups, id, deleteModal.toDelete],
  )

  return (
    <div className={appliedStyles.appliedListContainer}>
      <Header
        desc={t(DESC)}
        selectionCount={
          <SelectionCount t={t} selectedAll={selectedAll} selectedCount={selectedCount} deselectedCount={deselectedCount} />
        }
        frontActionButtons={<FrontendButtons t={t} onAssignUser={onAddModalShow} canEdit={canEdit} />}
        actionButtons={
          <ActionButtonsNode
            t={t}
            selectionState={selectionState}
            deleteSelected={deleteSelected}
            canEdit={canEdit}
            groupOnlyOptions={groupOnlyOptions}
          />
        }
        onSearchChange={onSearchChange}
        searchText={searchText}
        isSubHeader
      />
      <AppliedList
        onLoadMoreRows={onLoadMoreRows}
        singleSelectId=""
        selectionState={selectionState}
        onSelected={onSelected}
        onSelectAll={onSelectAll}
        selectedAll={selectedAll}
        onDeleteRow={onDeleteRow}
        editable={canEdit}
      />
      {addDialogId && (
        <AddAppliedModal
          dialogId={addDialogId}
          onAdd={handleOnAdd}
          onClose={onAddModalClose}
          context={AppliedListProviderContext}
          policyName={policy.name}
          saving={addUsersAndGroupsLoading}
        />
      )}
      {deleteModal.dialogId && (
        <DeleteAppliedModal
          dialogId={deleteModal.dialogId}
          policyName={policy.name}
          data={deleteModal.toDelete}
          onClose={onDeleteModalClose}
          onDelete={onDeleteModalDelete}
          deleteInProgress={deleteInProgress}
        />
      )}
    </div>
  )
}

export const AppliedView = () => {
  const filters = useFilters(filterOptions)
  const { id } = useParams()

  const groupOnly = !!filters.filters[GROUP_ONLY]
  const selection = useSelection({
    key: 'applied',
  })

  const [addDialog, setAddDialog] = useState({})
  const openAddDialog = useCallback(() => setAddDialog({ dialogId: POLICY_APPLIED_USERS_GROUPS }), [])
  const closeAddDialog = useCallback(() => setAddDialog({}), [])

  const variables = useMemo(() => ({ policyId: id }), [id])

  return (
    <Container className={styles.tabContent}>
      <Section>
        <AppliedListProvider
          variables={variables}
          searchText={filters.searchText}
          groupOnly={groupOnly}
          onAdded={closeAddDialog}
          onDeleted={selection.clearSelection}
        >
          <AppliedViewDetails
            id={id}
            variables={variables}
            filters={filters}
            groupOnly={groupOnly}
            addDialogId={addDialog.dialogId}
            onAddModalShow={openAddDialog}
            onAddModalClose={closeAddDialog}
            selection={selection}
          />
        </AppliedListProvider>
      </Section>
    </Container>
  )
}

const Applied = () => {
  const { t } = useTranslation()
  return (
    <ErrorBoundary t={t}>
      <AppliedView />
    </ErrorBoundary>
  )
}

export default Applied
