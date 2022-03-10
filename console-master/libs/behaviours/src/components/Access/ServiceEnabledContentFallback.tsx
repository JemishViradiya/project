import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { CardContent, makeStyles, Typography } from '@material-ui/core'

import type { ServiceId } from '@ues-data/shared-types'
import { BasicLock } from '@ues/assets'

const useStyles = makeStyles(theme => ({
  container: {
    alignSelf: 'center',
    textAlign: 'center',
    paddingTop: theme.spacing(3),
  },
  graphic: {
    boxSizing: 'content-box',
    padding: '1rem',
    fontSize: '3rem',
    background: theme.palette.grey.A100,
    borderRadius: '50%',
    color: theme.palette.background.paper,
  },
}))

export const ServiceEnabledContentFallback: React.FC<{ serviceId: ServiceId }> = ({ serviceId }) => {
  const { t } = useTranslation(['access'])
  const title = t('errors.noServiceEnabled.title')
  const { container, graphic } = useStyles()
  const serviceName = useMemo(() => t(`access:service.${serviceId.replace(/\./g, '_')}`), [serviceId, t])

  return (
    <CardContent className={container}>
      <BasicLock className={graphic} />
      <Typography variant="h3">{title}</Typography>
      <div data-testid="errorMessage">{t('access:errors.noServiceEnabled.description')}</div>
      <div>
        <i>{serviceName}</i>
      </div>
    </CardContent>
  )
}
