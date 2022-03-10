/* eslint-disable @typescript-eslint/ban-ts-comment */
/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { isEmpty } from 'lodash-es'
import type { VariantType } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Box } from '@material-ui/core'

import { usePrevious } from '@ues-behaviour/react'
import type { Policy } from '@ues-data/dlp'
import { PoliciesApi, PoliciesMockApi, POLICY_TYPE } from '@ues-data/dlp'
import { useBaseProfilesData } from '@ues-data/platform'
import { Permission } from '@ues-data/shared'
import type { TableSort } from '@ues/behaviours'
import {
  ConfirmationDialog,
  InfiniteTable,
  InfiniteTableProvider,
  TableToolbar,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

import { buildPoliciesListQuery } from './buildPolicesQueryParams'
import { PolicyInfoTabIdParam } from './common/types/routing'
import makeStyles from './styles'
import { useDeleteProfilesConfirmation } from './useDeleteProfilesConfirmation'
import { usePoliciesPermissions } from './usePoliciesPermission'
import { usePolicyDataMutation } from './usePolicyDataMutation'
import usePolicyDataSource from './usePolicyDataSource'
import { usePolicyList } from './usePolicyList'
import { useProfilesListToolbar } from './useProfilesListToolbar'

const DLP_SERVICE_ID = 'com.blackberry.dlp'
const DLP_POLICY_TYPE = 'content'

const PolicyList: React.FC = () => {
  useSecuredContent(Permission.BIP_POLICY_READ)
  const { canDelete } = usePoliciesPermissions()
  const maxElementsPerRequest = 25
  const classes = makeStyles()
  const { t } = useTranslation(['dlp/policy'])
  const snackbar = useSnackbar()
  const navigate = useNavigate()

  const [sortParams, setSortParams] = useState('policyName asc')
  const [activeFilters, setActiveFilters] = useState({})
  const [isUpdatedPoliciesListInUse, setIsUpdatedPoliciesListInUse] = useState(true)
  // Exposing a reference to the application’s classes by attaching it to the window object.
  // This property gives cypress tests an easy way to call methods from application’s classes
  // @ts-ignore
  if (window.Cypress) {
    // @ts-ignore
    window.IPolicyMock = PoliciesMockApi
    // @ts-ignore
    window.IPolicy = PoliciesApi
  }

  const notify = (message: string, type: VariantType) => {
    console.log('notify called with args= ', { message, type })
    if (type === 'error') {
      snackbar.enqueueMessage(t('policy.serverError.retrievePolicies', { error: policiesError }), type)
    }
  }
  // get Policies related - counters users and groups ssigned per policy
  const { profilesData, profilesLoading, refetchProfiles } = useBaseProfilesData(DLP_SERVICE_ID, POLICY_TYPE.CONTENT, notify)

  const { policiesError, policiesLoading, policiesList, refetch, fetchMore } = usePolicyDataSource(
    POLICY_TYPE.CONTENT,
    sortParams,
    activeFilters,
    maxElementsPerRequest,
  )

  // merging policies data received from ECS and policy service
  const updatedPoliciesList = { elements: [], totals: {}, count: 0, navigation: { next: '' } }
  if (!policiesLoading && !profilesLoading) {
    const policyAssignmentInfo = (profilesData?.profiles?.elements ?? []).reduce((obj, row) => {
      const policyId = row.entityId
      obj[policyId] = [row.groupCount, row.userCount]
      return obj
    }, {})

    policiesList?.elements.forEach(row => {
      const newRow = {}
      const policyStat = row.policyId in policyAssignmentInfo ? policyAssignmentInfo[row.policyId] : [0, 0]
      Object.assign(newRow, row, { groupCount: policyStat[0] }, { userCount: policyStat[1] })
      updatedPoliciesList.elements.push(newRow)
    })
    updatedPoliciesList.totals = policiesList?.totals
    updatedPoliciesList.count = policiesList?.count
    updatedPoliciesList.navigation.next = policiesList?.navigation?.next
  }

  const fetchMoreApps = async ({ offset }): Promise<any> => {
    const defaultParams = { offset: offset, max: maxElementsPerRequest, sortBy: sortParams }
    const requestUrlSetting = {
      policyType: POLICY_TYPE.CONTENT,
      queryParams: typeof activeFilters === 'object' ? defaultParams : { ...defaultParams, query: activeFilters },
    }
    fetchMore(requestUrlSetting)
  }

  useEffect(() => {
    setIsUpdatedPoliciesListInUse(true)
  }, [sortParams, activeFilters])

  const { tableProps, providerProps, filterLabelProps, getSelected, unselectAll, selectedItems, handleSearch } = usePolicyList({
    data: isUpdatedPoliciesListInUse ? updatedPoliciesList : policiesList,
    fetchMore: fetchMoreApps,
    getNamePath: policy => `../../${DLP_POLICY_TYPE}/update/${policy.policyId}`,
    getUsersPath: policy => `../../${DLP_POLICY_TYPE}/update/${policy.policyId}?tabId=${PolicyInfoTabIdParam.UsersAndGroups}`,
    getGroupsPath: policy => `../../${DLP_POLICY_TYPE}/update/${policy.policyId}?tabId=${PolicyInfoTabIdParam.UsersAndGroups}`,
    tableName: DLP_POLICY_TYPE,
    policiesLoading,
    setIsUpdatedPoliciesListInUse,
  })

  const { deletePolicyStartAction } = usePolicyDataMutation({ refetch, unselectAll })

  const onDeletePolicy = (rows: any[]) => {
    if (rows.length > 1) {
      rows.forEach((row: Policy) => {
        // TODO:  how todo batch deletion??
        deletePolicyStartAction({ policyId: row.policyId })
      })
    }

    return deletePolicyStartAction({ policyId: rows[0].policyId })
  }

  const { confirmationOptions, confirmDelete } = useDeleteProfilesConfirmation(unselectAll, onDeletePolicy)

  const toolbarProps = useProfilesListToolbar({
    selectedItems,
    items: isUpdatedPoliciesListInUse ? updatedPoliciesList?.elements?.length ?? 0 : policiesList?.elements?.length ?? 0,
    onSearch: handleSearch,
    onAddPolicy: () => navigate('../../content/create'),
    onDeletePolicies: items => {
      confirmDelete(items)
    },
    filterProps: providerProps.filterProps,
    filterLabelProps,
  })

  const { sort, sortDirection } = providerProps.sortingProps

  useEffect(
    () => {
      if (sort && `${sort} ${sortDirection}` !== sortParams) {
        const sortProp = sort === 'name' ? 'policyName' : sort
        setSortParams(`${sortProp} ${sortDirection}`)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sort, sortDirection],
  )

  useEffect(
    () => {
      if (!isEmpty(activeFilters) && isEmpty(providerProps.filterProps.activeFilters)) {
        setActiveFilters({})
      } else if (!isEmpty(providerProps.filterProps.activeFilters)) {
        setActiveFilters(buildPoliciesListQuery(providerProps.filterProps.activeFilters))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [providerProps.filterProps.activeFilters],
  )

  return (
    <>
      <Box className={classes.table}>
        <TableToolbar {...toolbarProps} />
        <InfiniteTableProvider
          basicProps={providerProps.basicProps}
          selectedProps={canDelete && providerProps.selectedProps}
          sortingProps={providerProps.sortingProps}
          data={providerProps.data ?? []}
          filterProps={providerProps.filterProps}
        >
          <InfiniteTable noDataPlaceholder={tableProps.noDataPlaceholder} infinitLoader={tableProps.infinitLoader} />
        </InfiniteTableProvider>
      </Box>
      <ConfirmationDialog {...confirmationOptions} />
    </>
  )
}

export default PolicyList
