/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { EChartsReactProps } from 'echarts-for-react'
import React, { useMemo } from 'react'
import { renderToString } from 'react-dom/server'

import { makeStyles, useTheme } from '@material-ui/core'

import { remToPx } from './utils'

const themeName = 'UES_CHARTS_THEME'

export const useChartStyles = makeStyles({
  toolTipIcon: {
    display: 'inline-block',
    marginRight: '5px',
    width: '6px',
    height: '12px',
  },
})

export type ToolTipItem = {
  color: string
  nameValue: string
}

export type ToolTipFormatterProps = {
  header: string
  subHeader?: string
  toolTipItems: ToolTipItem[]
}

const ToolTip = ({ header, subHeader, toolTipItems }: ToolTipFormatterProps) => {
  const classes = useChartStyles()
  return (
    <p>
      {header}
      {subHeader && <p>{subHeader}</p>}
      {toolTipItems.map(item => (
        <p>
          <span className={classes.toolTipIcon} style={{ backgroundColor: item.color }}></span>
          <span>{item.nameValue}</span>
        </p>
      ))}
    </p>
  )
}

export const formattedToolTip = ({ header, subHeader, toolTipItems }: ToolTipFormatterProps) => {
  return renderToString(<ToolTip header={header} subHeader={subHeader} toolTipItems={toolTipItems} />)
}

export const useChartTheme = (): { themeName: string; echartsTheme: EChartsReactProps['option'] } => {
  const theme = useTheme()
  const fontSize = remToPx(theme.typography.caption.fontSize)
  const lineHeight = remToPx(theme.typography.caption.lineHeight)

  return useMemo(
    () => ({
      themeName,
      echartsTheme: {
        tooltip: {
          backgroundColor: `${theme.palette.grey[900]}9A`,
          borderWidth: 0,
          borderRadius: 3,
          padding: [0, 10],
          textStyle: {
            ...theme.typography.caption,
            fontSize,
            lineHeight,
            color: '#fff',
          },
          confine: true,
        },
        legend: {
          padding: [5, 5, 0, 5],
          icon: 'rect',
          itemWidth: 6,
          itemHeight: 12,
          textStyle: {
            ...theme.typography.caption,
            lineHeight: lineHeight,
            fontSize: fontSize,
          },
        },
        pageIconSize: fontSize,
        pageTextStyle: {
          ...theme.typography.caption,
          lineHeight: lineHeight,
          fontSize: fontSize,
        },
        dataZoom: {
          handleIcon:
            'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '60%',
          handleStyle: {
            color: '#fff',
            borderColor: theme.palette.grey[400],
          },
          cursor: 'pointer',
          backgroundColor: '#fff',
          dataBackground: {
            lineStyle: {
              color: theme.palette.grey[600],
            },
            areaStyle: {
              color: theme.palette.grey[500],
            },
          },
          selectedDataBackground: {
            lineStyle: {
              color: theme.palette.grey[600],
            },
            areaStyle: {
              color: theme.palette.grey[500],
            },
          },
          moveHandleStyle: {
            color: theme.palette.grey[500],
            borderColor: theme.palette.grey[500],
          },
          emphasis: {
            handleStyle: {
              color: '#fff',
              borderColor: theme.palette.grey[500],
            },
            moveHandleStyle: {
              color: theme.palette.grey[500],
              borderColor: theme.palette.grey[500],
            },
          },
          textStyle: {
            ...theme.typography.overline,
            fontSize: remToPx(theme.typography.overline.fontSize),
            lineHeight: theme.spacing(3),
          },
          borderColor: `${theme.palette.grey[600]}1A`,
          fillerColor: `${theme.palette.grey[600]}1A`,
        },
      },
    }),
    [fontSize, lineHeight, theme],
  )
}
