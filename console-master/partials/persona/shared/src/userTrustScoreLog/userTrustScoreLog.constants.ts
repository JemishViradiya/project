/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { amber, blue, deepPurple, indigo, lime, pink, purple, teal } from '@material-ui/core/colors'

import { PersonaScoreType, PersonaSeverity } from '@ues-data/persona'

export const CHART_LINE_TYPE = {
  DASHED_LINE_22: '2 2',
}

export const CHART_TRANSPARENCY = {
  NO_TRANSPARENCY: 1,
  DASHED_LINE: 0.6,
}

export const CHART_LABEL_SLANT = {
  X_NEGATIVE_45: -45,
}

export const MAX_TRUST_SCORE = 100
export const MIN_TRUST_SCORE = 0

export const USER_TRUST_SCORE_LOG_MODELS = {
  [PersonaScoreType.CONDUCT]: {
    messageId: 'personaModelTypes.Conduct',
    enabled: false,
    color: teal[300],
    width: '1px',
    scoreType: PersonaScoreType.CONDUCT,
    dashLineIcon: true,
    'data-autoid': `user-trust-score-log-legend-${PersonaScoreType.CONDUCT}`,
  },
  [PersonaScoreType.MOUSE]: {
    messageId: 'personaModelTypes.Mouse',
    enabled: false,
    color: lime[800],
    width: '1px',
    scoreType: PersonaScoreType.MOUSE,
    dashLineIcon: true,
    'data-autoid': `user-trust-score-log-legend-${PersonaScoreType.MOUSE}`,
  },
  [PersonaScoreType.LOGON]: {
    messageId: 'personaModelTypes.Logon',
    enabled: false,
    color: pink[500],
    width: '1px',
    scoreType: PersonaScoreType.LOGON,
    dashLineIcon: true,
    'data-autoid': `user-trust-score-log-legend-${PersonaScoreType.LOGON}`,
  },
  [PersonaScoreType.KEYBOARD]: {
    messageId: 'personaModelTypes.Keyboard',
    enabled: false,
    color: amber[600],
    width: '1px',
    scoreType: PersonaScoreType.KEYBOARD,
    dashLineIcon: true,
    'data-autoid': `user-trust-score-log-legend-${PersonaScoreType.KEYBOARD}`,
  },
  [PersonaScoreType.META]: {
    messageId: 'personaModelTypes.Meta',
    enabled: true,
    color: purple[400],
    width: '1px',
    scoreType: PersonaScoreType.META,
    dashLineIcon: false,
    'data-autoid': `user-trust-score-log-legend-${PersonaScoreType.META}`,
  },
  [PersonaScoreType.TRUSTSCORE]: {
    messageId: 'personaModelTypes.TrustScore',
    enabled: true,
    color: indigo['A700'],
    width: '1.5px',
    scoreType: PersonaScoreType.TRUSTSCORE,
    dashLineIcon: false,
    'data-autoid': `user-trust-score-log-legend-${PersonaScoreType.TRUSTSCORE}`,
  },
}

// --TODO: get rid of this map once CCLY-854 is done
export const SEVERITY_NUMBER_TO_NAME_MAP = {
  1: PersonaSeverity.INFO,
  2: PersonaSeverity.LOW,
  3: PersonaSeverity.MEDIUM,
  4: PersonaSeverity.HIGH,
  5: PersonaSeverity.CRITICAL,
}

export const SEVERITY_COLORS_MAP = {
  [PersonaSeverity.CRITICAL]: '#ff3670',
  [PersonaSeverity.HIGH]: '#cb2946',
  [PersonaSeverity.MEDIUM]: '#ff701c',
  [PersonaSeverity.LOW]: '#fdd714',
  [PersonaSeverity.INFO]: blue[500],
}

export const PERSONA_SEVERITY_CHIP_CLASSNAME = {
  [PersonaSeverity.INFO]: 'alert-chip-info',
  [PersonaSeverity.LOW]: 'alert-chip-low',
  [PersonaSeverity.MEDIUM]: 'alert-chip-medium',
  [PersonaSeverity.HIGH]: 'alert-chip-high',
  [PersonaSeverity.CRITICAL]: 'alert-chip-critical',
}
