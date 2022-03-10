import { memoize } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { DETECTIONS_CATEGORIES_CONFIG } from '../config/detections'
import type { DetectionsCategoryType } from '../model'
import { DetectionsProvider } from '../model'

const TRANSLATIONS_PATHS = {
  [DetectionsProvider.BIS]: 'bis/ues:detectionPolicies.threats.categories.labels',
  [DetectionsProvider.MTD]: 'mtd/common:threats',
}

export const useDetectionsCategoryLabelFn = () => {
  const { t } = useTranslation(['bis/ues', 'mtd/common'])

  return useMemo(
    () =>
      memoize((categoryType: DetectionsCategoryType) => {
        const { provider } = DETECTIONS_CATEGORIES_CONFIG[categoryType]

        return t(`${TRANSLATIONS_PATHS[provider]}.${categoryType}`)
      }),
    [t],
  )
}
