import { PersonaScoreChartInterval, PersonaScoreType } from '../alert-service'

export const DEFAULT_PERSONA_SCORE_DATA = {
  [PersonaScoreChartInterval.Last24Hours]: {
    [PersonaScoreType.TRUSTSCORE]: [],
    [PersonaScoreType.META]: [],
    [PersonaScoreType.KEYBOARD]: [],
    [PersonaScoreType.CONDUCT]: [],
    [PersonaScoreType.NETWORK]: [],
    [PersonaScoreType.MOUSE]: [],
    [PersonaScoreType.LOGON]: [],
  },
  [PersonaScoreChartInterval.Last30Days]: {
    [PersonaScoreType.TRUSTSCORE]: [],
    [PersonaScoreType.META]: [],
    [PersonaScoreType.KEYBOARD]: [],
    [PersonaScoreType.CONDUCT]: [],
    [PersonaScoreType.NETWORK]: [],
    [PersonaScoreType.MOUSE]: [],
    [PersonaScoreType.LOGON]: [],
  },
}

export const DEFAULT_USER_ALERTS_WITH_TRUST_SCORE_DATA = {
  [PersonaScoreChartInterval.Last24Hours]: [],
  [PersonaScoreChartInterval.Last30Days]: [],
}
