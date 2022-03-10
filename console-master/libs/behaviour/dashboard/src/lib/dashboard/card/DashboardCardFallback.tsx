import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { CardContent, makeStyles, Typography } from '@material-ui/core'

import type { Permission, ServiceId } from '@ues-data/shared-types'
import { PermissionError, ServiceEnabledError } from '@ues-data/shared-types'
import { BasicInfo, BasicLock } from '@ues/assets'

import { GenericDashboardError, NoDataError } from '../types'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: theme.palette.text.disabled,
  },
  graphic: {
    boxSizing: 'content-box',
    padding: '1rem',
    fontSize: '2rem',
    background: theme.palette.grey.A100,
    borderRadius: '50%',
    color: theme.palette.background.paper,
  },
  error: {
    color: theme.palette.error.main,
  },
}))

export const CardErrorHandler = ({ error }: { error?: Error }): JSX.Element => {
  const { t } = useTranslation(['dashboard'])

  console.error(error)

  if (error instanceof PermissionError) return <PermissionDeniedFallback permissions={error.requiredPermissions} />
  else if (error instanceof ServiceEnabledError) return <ServiceNotEnabledFallback serviceId={error.service} />
  else if (error instanceof NoDataError) return <NoDataFallback />
  else if (error instanceof GenericDashboardError) return <GenericErrorFallback errorMessage={error.message} />
  else return <GenericErrorFallback errorMessage={t('genericError')} />
}

export const PermissionDeniedFallback: React.FC<{ permissions: Permission[] }> = ({ permissions }) => {
  const { t } = useTranslation(['dashboard', 'access'])
  const title = t('permissionNeeded')
  const { container, graphic } = useStyles()
  const permissionNames = useMemo(() => permissions.map(p => t(`access:${p.replace(/:/g, '_')}`)).join(', '), [permissions, t])

  return (
    <CardContent className={container}>
      <BasicLock className={graphic} />
      <Typography variant="h3">{title}</Typography>
      <div>
        <i>{permissionNames}</i>
      </div>
    </CardContent>
  )
}

export const ServiceNotEnabledFallback: React.FC<{ serviceId: ServiceId }> = ({ serviceId }) => {
  const { t } = useTranslation(['dashboard', 'access'])
  const title = t('serviceNotEnabled')
  const { container, graphic } = useStyles()
  const serviceName = useMemo(() => t(`access:service.${serviceId.replace(/\./g, '_')}`), [serviceId, t])

  return (
    <CardContent className={container}>
      <BasicLock className={graphic} />
      <Typography variant="h3">{title}</Typography>
      <div>
        <i>{serviceName}</i>
      </div>
    </CardContent>
  )
}

export const NoDataFallback: React.FC = () => {
  const { t } = useTranslation(['dashboard'])
  const title = t('noData')
  const { container, graphic } = useStyles()

  return (
    <CardContent className={container}>
      <BasicInfo className={graphic} />
      <Typography variant="h3">{title}</Typography>
    </CardContent>
  )
}

export const GenericErrorFallback: React.FC<{ errorMessage: string }> = ({ errorMessage }) => {
  const { container, error } = useStyles()

  return (
    <CardContent className={container}>
      <Typography variant="h3" className={error}>
        {errorMessage}
      </Typography>
    </CardContent>
  )
}
