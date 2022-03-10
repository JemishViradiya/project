import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { CardContent, makeStyles, Typography } from '@material-ui/core'

import type { Permission } from '@ues-data/shared-types'
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

export const SecuredContentFallback: React.FC<{ permissions: Permission[] }> = ({ permissions }) => {
  const { t } = useTranslation(['access'])
  const title = t('errors.noPermission.title')
  const { container, graphic } = useStyles()
  const permissionNames = useMemo(() => permissions.map(p => t(`access:${p.replace(/:/g, '_')}`)).join(', '), [permissions, t])

  return (
    <CardContent className={container}>
      <BasicLock className={graphic} />
      <Typography variant="h3">{title}</Typography>
      <div data-testid="errorMessage">{t('errors.noPermission.description')}</div>
      <div>
        <i>{permissionNames}</i>
      </div>
    </CardContent>
  )
}
