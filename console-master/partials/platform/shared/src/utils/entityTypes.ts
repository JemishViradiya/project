import type { IsFeatureEnabled } from '@ues-data/shared'
import { ReconciliationEntityType } from '@ues-data/shared'
import { FeatureName } from '@ues-data/shared-types'

export interface ExtraTenantFeatures {
  isMigratedToDP?: boolean
  isMigratedToACL?: boolean
}

/**
 * This method is used to filter out unsupported entity types
 * for both "assigned" and "assignable" policies
 * from "users" as well as "groups".
 * Some entity types (i.e. "role") are filtered out before this method is used
 * but to keep compatibility between "users" and "groups" they are being checked here as well.
 */
export const isEntityTypeSupported = (
  entityType: string,
  isFeatureEnabled: IsFeatureEnabled,
  extraTenantFeatures: ExtraTenantFeatures,
) =>
  entityType !== 'role' &&
  // TODO: Hide BISActionPolicy behind feature flag once we'll have requirements and feature flag created
  entityType !== ReconciliationEntityType.BISActionPolicy &&
  // START of deprecated but old tenants still use that value, can be removed once migration is done
  entityType !== 'BISActionPolicy' &&
  (entityType !== 'BISDetectionPolicy' ||
    (entityType === 'BISDetectionPolicy' && isFeatureEnabled(FeatureName.UESActionOrchestrator))) &&
  // END of deprecated
  (entityType !== ReconciliationEntityType.BISDetectionPolicy ||
    (entityType === ReconciliationEntityType.BISDetectionPolicy && isFeatureEnabled(FeatureName.UESActionOrchestrator))) &&
  (entityType !== ReconciliationEntityType.BisPolicy ||
    (entityType === ReconciliationEntityType.BisPolicy && !extraTenantFeatures?.isMigratedToDP)) &&
  (entityType !== ReconciliationEntityType.NetworkAccessControl ||
    (entityType === ReconciliationEntityType.NetworkAccessControl && !extraTenantFeatures?.isMigratedToACL))
