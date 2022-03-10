/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import classNames from 'classnames'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { makeStyles } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/SvgIcon'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import { useFeatures } from '@ues-data/shared'
import type { UesTheme } from '@ues/assets'
import { BasicClose, StatusSuccess } from '@ues/assets'

import { useDashboardWidgets } from './DashboardProvider'
import { selectCardState, selectChartLibrary } from './store'
import { chartIcon } from './utils'

const DRAG_ITEM_WIDTH = '120px'
const DRAG_ITEM_HEIGHT = '100px'

const useStyles = makeStyles<UesTheme>(
  theme => ({
    closeIcon: {
      position: 'absolute',
      right: theme.spacing(1),
      top: `${theme.spacing(2) - 2}px`,
    },
    header: {
      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    },
    divider: {
      backgroundColor: theme.palette.divider,
    },
    widgets: {
      padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
      display: 'flex',
      justifyContent: 'center',
      flexFlow: 'row wrap',
    },
    chartIcon: {
      color: theme.palette.grey[400],
      width: '100%',
      textAlign: 'center',
      fontSize: '36px',
    },
    dragItemText: {
      ...theme.typography.caption,
      width: '100%',
      textAlign: 'center',
      paddingTop: theme.spacing(0.5),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': 2,
    },
    dragItemWrapper: {
      margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
    dragItem: {
      display: 'block',
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      height: DRAG_ITEM_HEIGHT,
      width: DRAG_ITEM_WIDTH,
      margin: -2,
      padding: `${theme.spacing(1.75)}px ${theme.spacing(0.75)}px`,
      cursor: 'move',
      outline: 'none',
      border: `1px solid ${theme.palette.grey[300]}`,
      transition: theme.transitions.create(['border', 'box-shadow']),
      '&:hover': {
        boxShadow: theme.shadows[4],
      },
    },
    toolTip: {
      maxWidth: DRAG_ITEM_WIDTH,
    },
    statusIcon: {
      fontSize: '15px',
      color: theme.palette.grey[500],
      position: 'absolute',
      top: theme.spacing(0.75),
      right: theme.spacing(0.75),
    },
    visible: {
      visibility: 'visible',
    },
    hidden: {
      visibility: 'hidden',
    },
    appBar: {
      position: 'sticky',
      top: 0,
      zIndex: theme.zIndex.appBar,
      backgroundColor: theme.palette.background.body,
    },
  }),
  {
    name: 'AddWidgetsContent',
  },
)

export const AddWidgetsContent = memo(() => {
  const { t } = useTranslation(['dashboard', 'general/form'])
  const styles = useStyles()
  const { isEnabled } = useFeatures()
  const { setAddWidgetsDrawerOpen, setDroppingItem } = useDashboardWidgets()

  const cardState = useSelector(selectCardState)
  const chartLibrary = useSelector(selectChartLibrary)

  // widgets already in the dashboard
  const selectedWidgetIds = []
  Object.values(cardState).forEach(cardInfo => {
    selectedWidgetIds.push(cardInfo.chartId)
  })

  function widgets() {
    return (
      <div className={styles.widgets}>
        {Object.keys(chartLibrary).map(id => {
          if (typeof chartLibrary[id].features !== 'undefined' && !chartLibrary[id].features(isEnabled)) {
            return null
          } else {
            return (
              <div className={styles.dragItemWrapper} key={id}>
                {dragItem(id)}
              </div>
            )
          }
        })}
      </div>
    )
  }

  function dragItem(id) {
    const title = chartLibrary[id].title
    const width = chartLibrary[id].defaultWidth
    const height = chartLibrary[id].defaultHeight
    const chartType = chartLibrary[id].chartType
    const statusIconClasses = {
      false: `${classNames(styles.statusIcon, styles.hidden)}`,
      true: `${classNames(styles.statusIcon, styles.visible)}`,
    }
    const isSelected = selectedWidgetIds.includes(id)
    const statusIconClass = statusIconClasses[String(isSelected)]
    const label = isSelected
      ? t('cardLabel', { titleText: title, chartType: t(chartType) }) + '_selected'
      : t('cardLabel', { titleText: title, chartType: t(chartType) })

    return (
      <div
        key={id}
        id={id}
        className={classNames('droppable-element', styles.dragItem)}
        role="menuitem"
        tabIndex={0}
        draggable
        unselectable="on"
        onMouseDown={() => {
          setDroppingItem({
            i: 'droppingItem',
            w: width,
            h: height,
          })
        }}
        onDragStart={e => {
          e.dataTransfer.setData('text/plain', id)
        }}
      >
        <Icon className={statusIconClass} component={StatusSuccess} aria-label={label} role="figure" />
        <Icon className={styles.chartIcon} component={chartIcon(chartType)} />
        <Tooltip title={title} enterDelay={1000} classes={{ tooltip: styles.toolTip }}>
          <div className={styles.dragItemText}>{title}</div>
        </Tooltip>
      </div>
    )
  }

  return (
    <>
      <div className={styles.appBar}>
        <Typography variant={'h3'} className={styles.header}>
          {t('addWidgets')}
        </Typography>
        <IconButton
          size={'small'}
          className={styles.closeIcon}
          aria-label={t('general/form:commonLabels.close')}
          onClick={() => setAddWidgetsDrawerOpen(false)}
        >
          <Icon component={BasicClose} />
        </IconButton>
        <Divider className={styles.divider} />
      </div>
      {widgets()}
    </>
  )
})
