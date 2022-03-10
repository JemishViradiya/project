import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import { useBISPolicySchema } from '@ues-data/bis'
import { GroupsApi } from '@ues-data/platform'
import type { ReconciliationEntity } from '@ues-data/shared'
import { useFeatures, usePrevious, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import type { ExtraTenantFeatures } from '@ues-platform/shared'
import { isEntityTypeSupported } from '@ues-platform/shared'
import { ConfirmationState, useConfirmation, useSnackbar } from '@ues/behaviours'

import type { GroupPoliciesTableProps } from './PoliciesTable'

export const useImmediateProfileAssignment = (id: string): GroupPoliciesTableProps => {
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const snackbar = useSnackbar()
  const confirmation = useConfirmation()
  const { isEnabled } = useFeatures()
  const { isMigratedToDP, isMigratedToACL } = useBISPolicySchema()
  const tenantSettingsFeatures = useMemo<ExtraTenantFeatures>(
    () => ({
      isMigratedToDP,
      isMigratedToACL,
    }),
    [isMigratedToDP, isMigratedToACL],
  )

  const { data: assignedPolicies, loading } = useStatefulReduxQuery(GroupsApi.queryAssignedPolicies, {
    variables: { id, local: false },
  })

  const [unassignProfile, unassignTask] = useStatefulReduxMutation(GroupsApi.mutationUnassignProfile)
  const prevUnassignTask = usePrevious(unassignTask)

  const [assignProfiles, assignTask] = useStatefulReduxMutation(GroupsApi.mutationAssignProfile)
  const prevAssignTask = usePrevious(assignTask)

  const { data: assignablePolicies } = useStatefulReduxQuery(GroupsApi.queryAssignableProfiles, {})

  const handleDelete = useCallback(
    async (profile: ReconciliationEntity) => {
      const confirmationState = await confirmation({
        title: t('groups.policyAssign.removePolicy'),
        content: (
          <Typography variant="body2">
            {t('groups.policyAssign.removePolicyNote', {
              type: t('groups.policyAssign.type.' + profile.entityType),
              name: profile.name,
            })}
          </Typography>
        ),
        cancelButtonLabel: t('general/form:commonLabels.cancel'),
        confirmButtonLabel: t('general/form:commonLabels.remove'),
        maxWidth: 'xs',
      })

      if (confirmationState === ConfirmationState.Confirmed) {
        unassignProfile({ profile, local: false, id })
      }
    },
    [unassignProfile, id, t, confirmation],
  )

  const onAssign = useCallback(
    (profiles: ReconciliationEntity[], reconciliationType: string) => {
      assignProfiles({ profiles, reconciliationType, local: false, id })
    },
    [assignProfiles, id],
  )

  useEffect(() => {
    if (GroupsApi.isTaskResolved(unassignTask, prevUnassignTask) && unassignTask.error) {
      snackbar.enqueueMessage(t('groups.policyAssign.errorUnassignMessage'), 'error')
    }
    if (GroupsApi.isTaskResolved(assignTask, prevAssignTask) && assignTask.error) {
      snackbar.enqueueMessage(t('groups.policyAssign.errorAssignMessage'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unassignTask, prevUnassignTask, assignTask, prevAssignTask])

  const filteredAssignedPolicies = useMemo(
    () => (assignedPolicies ?? []).filter(({ entityType }) => isEntityTypeSupported(entityType, isEnabled, tenantSettingsFeatures)),
    [assignedPolicies, isEnabled, tenantSettingsFeatures],
  )
  const filteredAssignablePolicies = useMemo(
    () =>
      (assignablePolicies ?? []).filter(({ entityType }) => isEntityTypeSupported(entityType, isEnabled, tenantSettingsFeatures)),
    [assignablePolicies, isEnabled, tenantSettingsFeatures],
  )

  return {
    assignedPolicies: filteredAssignedPolicies,
    assignablePolicies: filteredAssignablePolicies,
    onProfilesAssign: onAssign,
    onDelete: handleDelete,
    loading,
  }
}
