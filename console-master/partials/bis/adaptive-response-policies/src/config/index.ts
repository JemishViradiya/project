import { RiskLevelTypes } from '@ues-data/bis/model'

import type { PolicyFormValues } from '../model'
import { PolicyFormField } from '../model'

export const TRANSLATION_NAMESPACES = ['bis/ues', 'bis/shared', 'profiles']

export const EDITABLE_POLICY_FORM_FIELDS = [PolicyFormField.Name, PolicyFormField.Description, PolicyFormField.PolicyData]

export const DEFAULT_POLICY_FORM_VALUES: PolicyFormValues = {
  [PolicyFormField.Name]: '',
  [PolicyFormField.Description]: '',
  [PolicyFormField.PolicyData]: {
    identityPolicy: {
      riskFactors: ['networkAnomalyDetection'],
      fixUp: {
        enabled: false,
        minimumBehavioralRiskLevel: RiskLevelTypes.HIGH,
        actionPauseDuration: 7200,
      },
      riskLevelActions: [],
    },
    geozonePolicy: {
      riskFactors: [],
    },
  },
}
