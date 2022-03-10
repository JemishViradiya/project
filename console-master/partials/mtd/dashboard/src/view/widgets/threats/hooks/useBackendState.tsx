import HttpStatus from 'http-status-codes'
import { useTranslation } from 'react-i18next'

import { GenericDashboardError, NoDataError } from '@ues-behaviour/dashboard'
import { useFeatures } from '@ues-data/shared'
import { FeatureName, PermissionError } from '@ues-data/shared-types'

export const useBackendState = (error: any, noData?: boolean): void => {
  const { t } = useTranslation(['mtd/common'])
  const features = useFeatures()

  if (error) {
    if (error.response?.status === HttpStatus.FORBIDDEN && features.isEnabled(FeatureName.PermissionChecksEnabled)) {
      throw new PermissionError([])
    } else {
      throw new GenericDashboardError(undefined, t('mobileAlert.errorMessageGeneric'))
    }
  } else if (noData === true) {
    throw new NoDataError()
  }
}
