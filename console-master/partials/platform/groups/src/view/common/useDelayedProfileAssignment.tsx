import { useCallback, useMemo } from 'react'

import { useBISPolicySchema } from '@ues-data/bis'
import { GroupsApi } from '@ues-data/platform'
import type { ReconciliationEntity } from '@ues-data/shared'
import { useFeatures, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import type { ExtraTenantFeatures } from '@ues-platform/shared'
import { isEntityTypeSupported } from '@ues-platform/shared'

import type { GroupPoliciesTableProps } from './PoliciesTable'

export const useDelayedProfileAssignment = (): GroupPoliciesTableProps => {
  const { isEnabled } = useFeatures()
  const { isMigratedToDP, isMigratedToACL } = useBISPolicySchema()
  const tenantSettingsFeatures = useMemo<ExtraTenantFeatures>(
    () => ({
      isMigratedToDP,
      isMigratedToACL,
    }),
    [isMigratedToDP, isMigratedToACL],
  )

  const { data: assignedPolicies } = useStatefulReduxQuery(GroupsApi.queryAssignedPolicies, { variables: { id: '', local: true } })

  const [unassignProfile] = useStatefulReduxMutation(GroupsApi.mutationUnassignProfile)

  const [assignProfiles] = useStatefulReduxMutation(GroupsApi.mutationAssignProfile)

  const { data: assignablePolicies } = useStatefulReduxQuery(GroupsApi.queryAssignableProfiles, {})

  const onDelete = useCallback(
    (profile: ReconciliationEntity) => {
      unassignProfile({ profile, local: true, id: '' })
    },
    [unassignProfile],
  )

  const onAssign = useCallback(
    (profiles: ReconciliationEntity[], reconciliationType: string) => {
      assignProfiles({ profiles, reconciliationType, local: true, id: '' })
    },
    [assignProfiles],
  )

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
    onDelete,
  }
}
