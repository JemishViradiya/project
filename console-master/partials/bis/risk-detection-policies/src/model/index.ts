import type { MobileProtectData } from '@ues-data/mtd'
import type { FeatureName, RiskLevel } from '@ues-data/shared'
import type { ActorDetectionType } from '@ues-data/shared-types'

export enum PolicyFormMode {
  Add = 'add',
  Copy = 'copy',
  Edit = 'edit',
}

export enum DetectionsProvider {
  BIS = 'bis',
  MTD = 'mtd',
}

export type DetectionsCategoryType = `${MobileProtectData.MobileThreatEventCategory}` | 'identity'

export interface DetectionsEntity {
  type: ActorDetectionType
}

export interface DetectionsCategory {
  type: DetectionsCategoryType
  detections: ActorDetectionType[]
}

export interface DetectionsRiskLevel {
  riskLevel: RiskLevel
  detections: DetectionsEntity[]
}

export type DetectionsValue = DetectionsRiskLevel[]

export interface AutomaticRiskReductionValue {
  enabled: boolean
  minimumRiskLevel?: RiskLevel
}

export interface PolicyFormValues {
  name: string
  description: string
  detections: DetectionsValue
  automaticRiskReduction: AutomaticRiskReductionValue
}

export interface PolicyCreatorLocationState {
  copiedValues?: PolicyFormValues
}

export interface DetectionConfig {
  disabled?: boolean
  features?: FeatureName[]
  provider: DetectionsProvider
  applicableRiskLevels?: Set<RiskLevel>
}

export interface DetectionsCategoryConfig {
  provider: DetectionsProvider
}
