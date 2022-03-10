/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReactNode } from 'react'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { makeStyles } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'

import { updateDashboardCardAndLayoutMutation, updateDashboardCardStateMutation } from '@ues-data/dashboard'
import { useStatefulApolloMutation } from '@ues-data/shared'

import { deleteCard, selectCardStateById, selectChartLibrary, selectChartsRemovable, updateCardState } from '../store'
import { CardMenuItem } from './CardMenuItem'

const useStyles = makeStyles(theme => ({
  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  menuDivider: {
    padding: 0,
  },
}))

type useCardMenuProps = {
  id: string
}

function isSelected(options, option) {
  if (options) {
    const optValue = options[option]
    if (typeof optValue !== 'undefined') {
      if (typeof optValue === 'boolean') {
        return optValue
      } else {
        return true
      }
    }
  }
  return false
}

export const useCardMenu = ({ id }: useCardMenuProps): ReactNode[] => {
  const styles = useStyles()
  const { t } = useTranslation(['dashboard'])

  const cardState = useSelector(selectCardStateById(id))
  const chartLibrary = useSelector(selectChartLibrary)
  let chartsRemovable = useSelector(selectChartsRemovable)

  const [updateCardsFn] = useStatefulApolloMutation(updateDashboardCardStateMutation, {
    onError: error => console.error(error.message),
    variables: { dashboardId: '' },
  })

  const [deleteCardFn] = useStatefulApolloMutation(updateDashboardCardAndLayoutMutation, {
    onError: error => console.error(error.message),
    variables: { dashboardId: '' },
  })

  if (chartsRemovable == null) {
    chartsRemovable = true
  }

  const dispatch = useDispatch()
  const updateCardOptions = useCallback(cardInfo => dispatch(updateCardState({ cardInfo, updateFn: updateCardsFn })), [
    dispatch,
    updateCardsFn,
  ])
  const removeCard = useCallback(id => dispatch(deleteCard({ id, updateFn: deleteCardFn })), [deleteCardFn, dispatch])

  const availableOptions = chartLibrary[cardState.chartId].availableOptions

  const menuList = []

  if (availableOptions) {
    for (const [option, isAvailable] of Object.entries(availableOptions)) {
      if (isAvailable) {
        const selected = isSelected(cardState.options, option)
        menuList.push(
          <CardMenuItem
            key={`${option}_${id}`}
            id={id}
            option={option}
            selected={selected}
            updateCardOptions={updateCardOptions}
          ></CardMenuItem>,
        )
      }
    }
  }

  if (chartsRemovable) {
    const DeleteMenuItem = () => {
      const handleDelete = event => {
        removeCard(id)
      }

      return (
        <MenuItem onClick={handleDelete}>
          <div className={styles.menuItem} data-testid={'deleteMenuItem_' + id}>
            <Typography variant="body2">{t('cardMenu.deleteCard')}</Typography>
          </div>
        </MenuItem>
      )
    }

    if (menuList.length !== 0) {
      menuList.push(<MenuItem key={`divider_${id}`} divider classes={{ root: styles.menuDivider }}></MenuItem>)
    }

    menuList.push(<DeleteMenuItem key={`delete_${id}`} />)
  }

  return menuList
}
