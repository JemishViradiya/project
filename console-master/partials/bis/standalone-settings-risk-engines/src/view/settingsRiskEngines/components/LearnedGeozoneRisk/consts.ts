import memoizeOne from 'memoize-one'

import { RiskLevelLabel, RiskLevelTypes as RiskLevel, StandaloneRiskLevelColor } from '@ues-data/bis/model'

export const INNER_RADIUS_FIELD = 'learnedGeozones.geozoneDistance.innerRadius'
export const OUTER_RADIUS_FIELD = 'learnedGeozones.geozoneDistance.outerRadius'
export const SWITCH_FIELD_NAME = 'learnedGeozones.enabled'
export const INNER_RADIUS_VALUE = 'learnedGeozones.geozoneDistance.innerRadius.value'
export const INNER_RADIUS_UNIT = 'learnedGeozones.geozoneDistance.innerRadius.unit'
export const OUTER_RADIUS_VALUE = 'learnedGeozones.geozoneDistance.outerRadius.value'
export const OUTER_RADIUS_UNIT = 'learnedGeozones.geozoneDistance.outerRadius.unit'

export const GEOZONE_DISTANCE_SETTINGS = memoizeOne(t => [
  {
    key: RiskLevel.HIGH,
    text: t(RiskLevelLabel.HIGH),
    color: StandaloneRiskLevelColor[RiskLevel.HIGH],
    valueFieldName: OUTER_RADIUS_VALUE,
    unitFieldName: OUTER_RADIUS_UNIT,
  },
  {
    key: RiskLevel.MEDIUM,
    text: t(RiskLevelLabel.MEDIUM),
    color: StandaloneRiskLevelColor[RiskLevel.MEDIUM],
    valueFieldName: OUTER_RADIUS_VALUE,
    unitFieldName: OUTER_RADIUS_UNIT,
  },
  {
    key: RiskLevel.LOW,
    text: t(RiskLevelLabel.LOW),
    color: StandaloneRiskLevelColor[RiskLevel.LOW],
    valueFieldName: INNER_RADIUS_VALUE,
    unitFieldName: INNER_RADIUS_UNIT,
  },
])
