/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { PersonaScoreType } from '@ues-data/persona'

type UserTrustScoreEnabledModels = Record<
  Exclude<PersonaScoreType, PersonaScoreType.NETWORK>,
  {
    messageId: string
    enabled: boolean
    color: string
    width: string
    scoreType: PersonaScoreType
    dashLineIcon: boolean
    'data-autoid': string
  }
>

interface PersonaAlertScoreScatterItem {
  x: Date
  y: number
  id: string
  eventId: number
  severity: number
}

export { PersonaAlertScoreScatterItem, UserTrustScoreEnabledModels }
