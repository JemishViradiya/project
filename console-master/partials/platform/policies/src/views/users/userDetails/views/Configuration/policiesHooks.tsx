import { map, uniqBy } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton } from '@material-ui/core'

import { useBISPolicySchema } from '@ues-data/bis'
import { UsersApi } from '@ues-data/platform'
import { useFeatures, usePrevious, useStatefulAsyncMutation, useStatefulAsyncQuery } from '@ues-data/shared'
import type { ExtraTenantFeatures } from '@ues-platform/shared'
import { isEntityTypeSupported } from '@ues-platform/shared'
import { BasicDelete } from '@ues/assets'
import type { TableSortDirection } from '@ues/behaviours'
import { ConfirmationState, useClientSort, useConfirmation, useSnackbar, useSort } from '@ues/behaviours'

import { isCompleted } from '../../../userUtils'

const idFunction = row => row.entityId

export type ProfileTypes = Record<string, any[]>

export const useUserPoliciesTable = (userId, userName, allPoliciesState, editable, loading) => {
  const { t } = useTranslation(['platform/common', 'general/form'])
  const confirmation = useConfirmation()
  const { enqueueMessage } = useSnackbar()
  const [effectiveEntities, setEffectiveEntities] = useState([])
  const { isEnabled } = useFeatures()
  const { isMigratedToDP, isMigratedToACL } = useBISPolicySchema()

  const { fetchMore: fetchMoreEffectivePolicy } = useStatefulAsyncQuery(UsersApi.queryUsersEffectivePolicy, {
    variables: { userId, seviceId: '' },
  })

  const combinedPolicies = useMemo(() => {
    if (allPoliciesState?.data?.elements && effectiveEntities) {
      const nonEmptyEffective = effectiveEntities.filter(x => x.effectiveEntities.length && x)
      const effectiveList = map(nonEmptyEffective, 'effectiveEntities')
      const result = {}
      for (let i = 0; i < effectiveList?.length; i++) {
        const effectivePolicies = effectiveList[i]
        for (let j = 0; j < effectivePolicies?.length; j++) {
          const effectivePolicy = effectivePolicies[j]
          const effectivePolicyDetails = effectivePolicy.details
          for (let k = 0; k < effectivePolicyDetails?.length; k++) {
            const entityDetails = effectivePolicyDetails[k]
            result[entityDetails.entityId] = {
              entityType: effectivePolicies.entityType,
              ...entityDetails,
            }
          }
        }
      }

      const tenantSettingsFeatures: ExtraTenantFeatures = { isMigratedToDP, isMigratedToACL }
      const policies = allPoliciesState?.data?.elements
        .filter(
          x =>
            isEntityTypeSupported(x['entityType'], isEnabled, tenantSettingsFeatures) &&
            map(Object.values(result), 'entityId').includes(x.entityId),
        )
        .map(p => {
          return {
            ...result[p.entityId],
            ...p,
          }
        })

      policies.sort((a: any, b: any) => {
        if (a.name > b.name) return 1
        if (a.name < b.name) return -1
        return 0
      })

      return policies
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPoliciesState?.data, effectiveEntities, isEnabled])

  const [unassignUserPolicyAction, unassignUserPolicyState] = useStatefulAsyncMutation(UsersApi.unassignUserPolicy, {})
  const prevUassignUserPolicyState = usePrevious(unassignUserPolicyState)

  const createQueue = useCallback(
    array => {
      const queue = []
      array.forEach(serviceId => {
        queue.push(
          new Promise(resolve => {
            resolve(fetchMoreEffectivePolicy({ userId, serviceId }))
          }),
        )
      })
      return queue
    },
    [fetchMoreEffectivePolicy, userId],
  )

  const refetchEffectivePolicies = useCallback(() => {
    if (allPoliciesState?.data?.elements) {
      const { elements } = allPoliciesState?.data
      const forbidden = ['rbac']
      const unique = uniqBy(elements, 'serviceId')
      const serviceIds = map(unique, 'serviceId')
      const withoutForbidden = serviceIds.filter(id => !forbidden.includes(id))
      const queue = createQueue(withoutForbidden)
      Promise.all(queue)
        .then(values => {
          const filteredEntites = values.filter(x => x?.entityType?.toLowerCase !== 'role')
          setEffectiveEntities(filteredEntites)
        })
        .catch(err => {
          enqueueMessage(t('users.details.configuration.policies.errors.fetchPolicies'), 'error')
        })
    }
  }, [allPoliciesState?.data, createQueue, enqueueMessage, t])

  useEffect(() => {
    refetchEffectivePolicies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPoliciesState?.data])

  useEffect(() => {
    if (isCompleted(unassignUserPolicyState, prevUassignUserPolicyState)) {
      if (unassignUserPolicyState.error) {
        enqueueMessage(t('users.details.configuration.policies.errors.unassign'), 'error')
      } else {
        enqueueMessage(t('users.details.configuration.policies.success.unassign'), 'success')
        refetchEffectivePolicies()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unassignUserPolicyState])

  const handleDeletePolicy = useCallback(
    async policy => {
      const confirmationState = await confirmation({
        title: t('users.details.configuration.policies.dialogs.unassign.title'),
        description: t('users.details.configuration.policies.dialogs.unassign.description', {
          displayName: userName,
          policyName: policy.name,
        }),
        cancelButtonLabel: t('general/form:commonLabels.cancel'),
        confirmButtonLabel: t('general/form:commonLabels.unassign'),
        maxWidth: 'xs',
      })

      if (confirmationState === ConfirmationState.Confirmed) {
        unassignUserPolicyAction({ userId: userId, policy: { serviceId: policy.serviceId, entityId: policy.entityId } })
      }
    },
    [unassignUserPolicyAction, userName, userId, t, confirmation],
  )

  const COLUMNS = useMemo(
    () => [
      {
        dataKey: 'name',
        label: t('users.details.configuration.policies.policyName'),
        sortable: true,
      },
      {
        dataKey: 'type',
        label: t('users.details.configuration.policies.policyType'),
        renderCell: (rowData: any) => {
          return t('groups.policyAssign.type.' + rowData.entityType)
        },
      },
      {
        dataKey: 'assignment',
        label: t('users.details.configuration.policies.assignment'),
        renderCell: (rowData: any) => {
          switch (rowData.appliedVia) {
            case 'USER':
              return t('users.details.configuration.policies.assignedToUser')
            case 'GROUP':
              return t('users.details.configuration.policies.assignedViaGroup')
            case 'OVERRIDE':
              return t('users.details.configuration.policies.assignedViaOverride')
          }
        },
      },
      {
        dataKey: 'action',
        renderCell: (rowData: any, rowDataIndex: number) => {
          return rowData.appliedVia === 'USER' && editable ? (
            <IconButton size="small" onClick={() => handleDeletePolicy(rowData)}>
              <BasicDelete />
            </IconButton>
          ) : null
        },
        renderLabel: () => null,
        styles: { width: 30 },
        icon: true,
      },
    ],
    [t, editable, handleDeletePolicy],
  )

  const sortingProps = useSort(null, 'asc')
  const { sort, sortDirection } = sortingProps
  const sortedData = useClientSort({
    data: combinedPolicies,
    sort: { sortBy: sort, sortDir: sortDirection as TableSortDirection },
  })

  const basicProps = useMemo(
    () => ({
      columns: COLUMNS,
      idFunction,
      loading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [COLUMNS, combinedPolicies],
  )

  return {
    providerProps: { basicProps, sortingProps },
    tableData: sortedData ?? [],
    refetchEffectivePolicies,
    loadingPOlicies: false,
    directlyAssignedPolicies: combinedPolicies ?? [],
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useAssignPolicy = (userId, allPoliciesState, refetchEffectivePolicies, directlyAssignedPolicies) => {
  const { t } = useTranslation(['platform/common', 'general/form'])
  const { enqueueMessage } = useSnackbar()
  const singlePolicyIsAssigned = useRef(true)

  const { isEnabled } = useFeatures()
  const { isMigratedToDP, isMigratedToACL } = useBISPolicySchema()
  const [policyTypes, setPolicyTypes] = useState<ProfileTypes>({})
  const [rankableDialog, setRankableDialog] = useState(false)

  const { data: profileDefinitions } = useStatefulAsyncQuery(UsersApi.queryPoliciesDefinitions, {})
  const [assignUserPoliciesAction, assignUserPoliciesState] = useStatefulAsyncMutation(UsersApi.assignUserPolicies, {})
  const prevAssignUserPoliciesState = usePrevious(assignUserPoliciesState)

  useEffect(() => {
    if (allPoliciesState?.data && profileDefinitions) {
      const tenantSettingsFeatures: ExtraTenantFeatures = { isMigratedToDP, isMigratedToACL }
      const policies =
        allPoliciesState?.data.elements.filter(x => isEntityTypeSupported(x['entityType'], isEnabled, tenantSettingsFeatures)) ?? []
      const types = {}
      profileDefinitions
        .filter(x => isEntityTypeSupported(x['entityType'], isEnabled, tenantSettingsFeatures))
        .forEach(d => (types[d.entityType] = []))
      for (let i = 0; i < policies.length; i++) {
        const policy = { ...policies[i], id: policies[i].entityId }
        types[policy.entityType] = types[policy.entityType] ? [...types[policy.entityType], policy] : [policy]
      }
      setPolicyTypes(types)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPoliciesState, profileDefinitions])

  useEffect(() => {
    if (isCompleted(assignUserPoliciesState, prevAssignUserPoliciesState)) {
      if (assignUserPoliciesState.error) {
        enqueueMessage(t('users.details.configuration.policies.error.assign'), 'error')
      } else {
        const message = singlePolicyIsAssigned.current
          ? t('users.details.configuration.policies.success.assign.single')
          : t('users.details.configuration.policies.success.assign.multiple')

        enqueueMessage(message, 'success')
        refetchEffectivePolicies()
        closePolicyHandler()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignUserPoliciesState])

  const [selectedType, setSelectedType] = useState(null)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const popOverOpen = Boolean(anchorEl)
  const id = popOverOpen ? 'simple-popover' : undefined

  const handleAddClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleAddClose = () => {
    setAnchorEl(null)
  }

  const [filteredPolicyValues, setFilteredPolicyValues] = useState([])
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false)
  const [policyReplace, setPolicyReplace] = useState(false)

  const policyLabels = {
    title: policyReplace
      ? t('users.details.configuration.policies.dialogs.assign.replaceTitle')
      : t('users.details.configuration.policies.dialogs.assign.title'),
    description: t('users.details.configuration.policies.dialogs.assign.description'),
    searchText: t('users.details.configuration.policies.dialogs.assign.searchText'),
    cancel: t('general/form:commonLabels.cancel'),
    submit: t('general/form:commonLabels.assign'),
  }

  const openAddDialog = type => {
    const rankable = policyTypes[type][0].rank > 0

    checkPolicyReplace(type, rankable)
    handleAddClose()
    setSelectedType(type)
    setRankableDialog(rankable)
    handlePolicySearchChange('', type)
    setPolicyDialogOpen(true)
  }

  const checkPolicyReplace = (type, rankable) => {
    const replace = rankable && (directlyAssignedPolicies?.some(p => p.entityType === type) ?? [])
    setPolicyReplace(replace)
  }

  const renderPolicyListItem = item => {
    return item.name
  }

  const handlePolicySearchChange = (str, type) => {
    const directlyAssignedIds = directlyAssignedPolicies?.map(p => p.entityId) ?? []
    setFilteredPolicyValues(
      policyTypes[type].filter(p => !directlyAssignedIds.includes(p.entityId) && p.name.toLowerCase().includes(str.toLowerCase())),
    )
  }

  const closePolicyHandler = () => {
    setPolicyDialogOpen(false)
  }

  const submitPolicyHandler = policies => {
    const mappedPolicies = policies.map(p => ({ entityId: p.entityId, serviceId: p.serviceId }))
    singlePolicyIsAssigned.current = mappedPolicies.length === 1
    assignUserPoliciesAction({ userId: userId, policies: mappedPolicies })
  }

  return {
    addPopoverProps: { id, open: popOverOpen, anchorEl, onClose: handleAddClose },
    searchDialogProps: {
      open: policyDialogOpen,
      setOpen: setPolicyDialogOpen,
      labels: policyLabels,
      values: filteredPolicyValues,
      renderListItem: renderPolicyListItem,
      handleSearchChange: handlePolicySearchChange,
      closeHandler: closePolicyHandler,
      submitHandler: submitPolicyHandler,
      policyType: selectedType,
      rankable: rankableDialog,
    },
    policyTypes,
    openAddDialog,
    handleAddClick,
    assignmentLoading: assignUserPoliciesState?.loading,
  }
}
