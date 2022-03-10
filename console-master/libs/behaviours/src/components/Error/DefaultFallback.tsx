import React from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, makeStyles, Typography } from '@material-ui/core'

import { ImageError } from '@ues/assets'

const useStyles = makeStyles(theme => ({
  container: {
    alignSelf: 'center',
    textAlign: 'center',
    paddingTop: theme.spacing(3),
  },
  graphic: {
    height: '160px',
    width: '160px',
    boxSizing: 'content-box',
    fontSize: '20rem',
    borderRadius: '50%',
    color: theme.palette.background.paper,
  },
  text: {
    margin: 'auto',
  },
}))

const DefaultFallback = () => {
  const { t } = useTranslation(['access'])
  const title = t('errors.generic.title')
  const description = t('errors.generic.description')
  const { container, graphic, text } = useStyles()

  return (
    <Card variant="outlined" elevation={0}>
      <CardContent className={container}>
        <ImageError viewBox="0 0 160 160" className={graphic} />
        <Typography variant="h3">{title}</Typography>
        <Typography className={text}>{description}</Typography>
      </CardContent>
    </Card>
  )
}

export default DefaultFallback
