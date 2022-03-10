import type { TFunction } from 'i18next'

import type { DetectionPolicyInput, DetectionPolicyQueryResult } from '@ues-data/bis'
import type { ActorDetectionType, RiskLevel } from '@ues-data/shared-types'

import { DEFAULT_RISK_LEVEL } from '../config/automatic-risk-reduction'
import { DETECTIONS_CONFIG } from '../config/detections'
import type { DetectionsEntity, DetectionsRiskLevel, PolicyFormValues } from '../model'

export const policyFormValuesToMutationInput = (
  formValues: PolicyFormValues,
  arrEnabled: boolean,
  isDefault?: boolean,
): DetectionPolicyInput => ({
  name: formValues.name,
  description: formValues.description,
  policyData: {
    arr: {
      enabled: arrEnabled ? formValues.automaticRiskReduction.enabled : false,
      ...(arrEnabled && { minimumRiskLevel: formValues.automaticRiskReduction.minimumRiskLevel }),
    },
    defaultPolicy: isDefault,
    deviceRiskDetection: {
      riskDetections: formValues.detections.map(({ riskLevel, detections }) => ({
        riskLevel,
        detections: detections.map(detection => ({
          name: detection.type,
        })),
      })),
    },
  },
})

export const fetchedPolicyToPolicyFormValues = (
  policy: DetectionPolicyQueryResult['detectionPolicy'],
  t: TFunction,
  defaultValues: PolicyFormValues,
  riskLevelsSet: Set<RiskLevel>,
): PolicyFormValues => ({
  name: policy?.policyData?.defaultPolicy ? t('profiles:policy.defaultPolicyName') : policy?.name ?? defaultValues.name,
  description: policy?.description ?? defaultValues.description,
  detections:
    policy?.policyData?.deviceRiskDetection?.riskDetections
      ?.filter(({ riskLevel }) => riskLevelsSet.has(riskLevel))
      .map<DetectionsRiskLevel>(level => ({
        riskLevel: level.riskLevel,
        detections: level.detections.reduce<DetectionsEntity[]>((acc, item) => {
          if (item.name in DETECTIONS_CONFIG) {
            return [...acc, { type: item.name as ActorDetectionType }]
          }

          return acc
        }, []),
      })) ?? defaultValues.detections,
  automaticRiskReduction: policy?.policyData?.arr
    ? policy.policyData.arr.enabled
      ? { enabled: true, minimumRiskLevel: policy.policyData.arr.minimumRiskLevel ?? DEFAULT_RISK_LEVEL }
      : { enabled: false }
    : defaultValues.automaticRiskReduction,
})
