/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useTranslation } from 'react-i18next'

import { MobileProtectData } from '@ues-data/mtd'

import { getEventTypeItems } from '../../data'

export type UseEventStateTypesReturn = {
  eventTypeItems: any
  eventTypeItemLabels: any
  stateItems: any
  stateItemsLabels: any
}

export const useEventStateTypes = (): UseEventStateTypesReturn => {
  const { t } = useTranslation(['mtd/common'])
  const eventTypeItems = getEventTypeItems()
  const eventTypeItemLabels = eventTypeItems.reduce(function (result, item, index) {
    result[item] = t('threats.' + item)
    return result
  }, {})

  const stateItems = Object.values(MobileProtectData.MobileThreatEventState)
  const stateItemsLabels = stateItems.reduce(function (result, item, index) {
    result[item] = t('threatStatus.' + item)
    return result
  }, {})

  return {
    eventTypeItems,
    eventTypeItemLabels,
    stateItems,
    stateItemsLabels,
  }
}
