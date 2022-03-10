/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { VariantType } from 'notistack'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Box } from '@material-ui/core'

import { UESPolicyListDeleteMutation } from '@ues-data/bis'
import type { Policy } from '@ues-data/dlp'
import { POLICY_TYPE } from '@ues-data/dlp'
import { useBaseProfilesData } from '@ues-data/platform'
import { Permission, useStatefulApolloMutation } from '@ues-data/shared'
import { ReconciliationEntityType, ServiceId } from '@ues-data/shared-types'
import { useDeleteProfilesConfirmation, useProfilesList, useProfilesListToolbar, useRankable } from '@ues-platform/policy-common'
import {
  ConfirmationDialog,
  DraggableTable,
  DraggableTableProvider,
  FormButtonPanel,
  SecuredContent,
  TableToolbar,
  useDialogPrompt,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

import { PolicyInfoTabIdParam } from '../../common/types/routing'
import { usePoliciesPermissions } from '../../usePoliciesPermission'
import { usePolicyDataMutation } from '../../usePolicyDataMutation'
import usePolicyDataSource from '../../usePolicyDataSource'
import { useMobilePolicyList } from '../useMobilePolicyList'
import { useStyles } from './styles'

interface PolicyRow {
  entityId: string
  name: string
  description: string
  groupCount: number
  userCount: number
  rank: number
  policyType?: POLICY_TYPE
  created?: string
  modified?: string
  policyName?: string
  policyId?: string
}
const MobilePoliciesList = memo(() => {
  useSecuredContent(Permission.BIP_POLICY_READ)

  const { t } = useTranslation(['dlp/policy'])
  const { t: gatewayT } = useTranslation(['gateway/common'])
  const classes = useStyles()
  const snackbar = useSnackbar()
  const navigate = useNavigate()
  const [sortParams, setSortParams] = useState('')
  const [rankingSaved, setRankingSaved] = useState<boolean>(true)
  const DLP_POLICY_TYPE = POLICY_TYPE.MOBILE.toLocaleLowerCase()
  const { canCreate, canDelete, canUpdate } = usePoliciesPermissions()

  const { policiesError, policiesLoading, policiesList, refetch, fetchMore } = usePolicyDataSource(POLICY_TYPE.MOBILE)

  const notify = useCallback(
    (message: string, type: VariantType) => {
      console.log('notify called with args= ', { message, type })
      if (type === 'error') {
        snackbar.enqueueMessage(t('policy.serverError.retrievePolicies', { error: policiesError }), type)
      }
    },
    [t, snackbar, policiesError],
  )

  // get Policies related - counters users and groups assigned per policy
  const { profilesData, profilesLoading, updateRank, refetchProfiles } = useBaseProfilesData(
    ServiceId.DLP,
    POLICY_TYPE.MOBILE,
    notify,
  )

  useEffect(() => {
    try {
      refetchProfiles()
    } catch (e) {
      console.log('unknown error has occured')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // merging policies data received from ECS and policy service
  const updatedPoliciesList = { elements: [], total: {}, count: 0 }

  if (!policiesLoading && !profilesLoading) {
    const policyAssignmentInfo = (profilesData?.profiles?.elements ?? []).reduce((obj, row) => {
      const policyId = row.entityId
      obj[policyId] = [row.groupCount, row.userCount, row.rank]
      return obj
    }, {})

    policiesList?.elements.forEach(row => {
      const newRow: PolicyRow = {
        name: '',
        description: '',
        entityId: '',
        groupCount: 0,
        userCount: 0,
        rank: 0,
      }
      const policyStat = row.policyId in policyAssignmentInfo ? policyAssignmentInfo[row.policyId] : [0, 0, 0]
      Object.assign(
        newRow,
        row,
        { name: row.policyName },
        { entityId: row.policyId },
        { groupCount: policyStat[0] },
        { userCount: policyStat[1] },
        { rank: policyStat[2] },
      )
      delete newRow.policyName
      // delete newRow.policyId
      updatedPoliciesList.elements.push(newRow)
    })
    updatedPoliciesList.total = policiesList?.totals
    updatedPoliciesList.count = policiesList?.count
    updatedPoliciesList.elements.sort((element1, element2) => element1.rank - element2.rank)
  }

  const fetchMoreApps = async ({ offset, max }): Promise<any> => {
    if (sortParams === 'undefined undefined') {
      await fetchMore({ policyType: POLICY_TYPE.MOBILE, queryParams: { offset: offset, max: max } })
    } else {
      await fetchMore({ policyType: POLICY_TYPE.MOBILE, queryParams: { offset: offset, max: max, sortBy: sortParams } })
    }
  }

  const onAddPolicy = useCallback(() => navigate('../../mobile/create'), [navigate])

  const {
    tableProps,
    providerProps,
    filterLabelProps,
    getSelected,
    unselectAll,
    selectedItems,
    handleSearch,
    rankMode,
    setRankMode,
    resetDrag,
  } = useMobilePolicyList({
    rankable: true,
    getNamePath: policy => `../../${DLP_POLICY_TYPE}/update/${policy.policyId}`,
    getUsersPath: policy => `../../${DLP_POLICY_TYPE}/update/${policy.policyId}?tabId=${PolicyInfoTabIdParam.UsersAndGroups}`,
    getGroupsPath: policy => `../../${DLP_POLICY_TYPE}/update/${policy.policyId}?tabId=${PolicyInfoTabIdParam.UsersAndGroups}`,
    elements: updatedPoliciesList?.elements ?? [],
    setRankingSaved,
    tableName: DLP_POLICY_TYPE,
  })

  const { deletePolicyStartAction } = usePolicyDataMutation({ refetch, unselectAll })

  const onDeletePolicy = useCallback(
    (rows: PolicyRow[]) => {
      if (rows.length > 1) {
        rows.forEach((row: PolicyRow) => {
          // TODO:  how todo batch deletion??
          deletePolicyStartAction({ policyId: row.entityId })
        })
      }
      return deletePolicyStartAction({ policyId: rows[0].entityId })
    },
    [deletePolicyStartAction],
  )

  const { confirmationOptions, confirmDelete } = useDeleteProfilesConfirmation(unselectAll, onDeletePolicy)

  const onRank = useCallback(() => setRankMode(true), [setRankMode])
  const toolbarProps = useProfilesListToolbar({
    selectedItems,
    onRank: canUpdate && onRank,
    items: tableProps?.data?.length ?? 0,
    onSearch: handleSearch,
    onAddPolicy: canCreate && onAddPolicy,
    onDeletePolicies: canDelete && confirmDelete,
    loading: profilesLoading,
  })

  const rankProps = useRankable({
    rankMode,
    setRankMode,
    resetDrag: resetDrag,
    data: tableProps?.data,
    updateRank,
    rankingSaved,
    setRankingSaved,
  })

  const UnsavedConfirmationDialog = useDialogPrompt('gateway/common:common.unsavedChangesMessage', !rankingSaved)

  return (
    <Box className={classes.container}>
      {!rankMode && <TableToolbar {...toolbarProps} />}
      <DraggableTableProvider {...providerProps}>
        <DraggableTable {...tableProps} />
      </DraggableTableProvider>
      <FormButtonPanel {...rankProps} />
      <ConfirmationDialog {...confirmationOptions} />
      {UnsavedConfirmationDialog}
    </Box>
  )
})

MobilePoliciesList.displayName = 'MobilePoliciesList'

export default MobilePoliciesList
