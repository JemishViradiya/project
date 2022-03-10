/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Card, CardContent, CardHeader, Typography } from '@material-ui/core'

import { MtdResponseActions } from '@ues-mtd/compliance'

const ResponseActions = () => {
  const { t } = useTranslation(['platform/endpoints'])
  const params = useParams()

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Typography variant="h2" gutterBottom>
            {t('endpoint.responseActions.title')}
          </Typography>
        }
      />
      <CardContent>
        <MtdResponseActions />
      </CardContent>
    </Card>
  )
}

export default ResponseActions
