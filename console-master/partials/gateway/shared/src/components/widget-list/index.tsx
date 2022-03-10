//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, ListItem } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import { ChartList } from '@ues-behaviour/dashboard'
import { Loading } from '@ues/behaviours'

import { GATEWAY_TRANSLATIONS_KEY } from '../../config'

/* eslint-disable @typescript-eslint/no-explicit-any */
interface WidgetListProps {
  data: any[]
  renderItem?: (itemData: any, itemDataIndex: number) => React.ReactNode
  loading?: boolean
  height?: number
}
/* eslint-enabled @typescript-eslint/no-explicit-any */

const WidgetList: React.FC<WidgetListProps> = ({ data, renderItem, loading, height }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  if (loading) {
    return <Loading />
  }

  if (isEmpty(data)) {
    return (
      <Box mt={1}>
        <Alert severity="info">{t('common.noData')}</Alert>
      </Box>
    )
  }
  const heightStyle = height ? { style: { height: `${height}px` } } : {}
  return (
    <ChartList {...heightStyle}>
      {data.map((item, index) => (
        <ListItem disableGutters key={index}>
          {renderItem ? renderItem(item, index) : item}
        </ListItem>
      ))}
    </ChartList>
  )
}

export { WidgetList }
