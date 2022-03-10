import HttpStatus from 'http-status-codes'
import { useTranslation } from 'react-i18next'

import { ApolloError } from '@apollo/client'

import { GenericDashboardError, NoDataError } from '@ues-behaviour/dashboard'
import { useFeatures } from '@ues-data/shared'
import { FeatureName, PermissionError } from '@ues-data/shared-types'

export const useBackendState = (error: any, noData?: boolean): void => {
  const { t } = useTranslation('dashboard')
  const features = useFeatures()

  if (error) {
    const isApolloError = error instanceof ApolloError
    const genericDashboardError = new GenericDashboardError(undefined, t('genericError'))
    const permissionError = new PermissionError([])

    if (isApolloError && error.graphQLErrors.some(err => err.extensions.code === 'FORBIDDEN')) {
      throw permissionError
    } else if (isApolloError) {
      throw genericDashboardError
    } else if (error.response?.status === HttpStatus.FORBIDDEN && features.isEnabled(FeatureName.PermissionChecksEnabled)) {
      throw permissionError
    } else {
      throw genericDashboardError
    }
  } else if (noData) {
    throw new NoDataError()
  }
}
