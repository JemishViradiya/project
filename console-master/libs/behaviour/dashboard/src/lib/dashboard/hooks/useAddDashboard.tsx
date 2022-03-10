/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { addDashboardMutation, DEFAULT_TIME_INTERVAL } from '@ues-data/dashboard'
import { updateNavApps } from '@ues-data/nav'
import { useStatefulApolloMutation } from '@ues-data/shared'

import type { DashboardProps } from '../types'

export type AddDashboardProps = {
  addDashboard: (dashProps: DashboardProps) => void
  addEmptyDashboard: (title: string) => void
  validationError: boolean
  helperText: string
  resetErrors: () => void
}

export type useAddDashboardProps = {
  onClose: () => void
}

let newDashboardId = ''

export const useAddDashboard = ({ onClose }: useAddDashboardProps): AddDashboardProps => {
  const { t } = useTranslation(['dashboard'])
  const [validationError, setValidationError] = useState(false)
  const [helperText, setHelperText] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const resetErrors = () => {
    setValidationError(false)
    setHelperText('')
  }

  const onAddSuccess = useCallback(() => {
    dispatch(updateNavApps(true))
    navigate(`/dashboard/${newDashboardId}`)
    onClose()
  }, [dispatch, navigate, onClose])

  const onAddError = useCallback(
    error => {
      if (error.graphQLErrors) {
        for (const err of error.graphQLErrors) {
          if (err.extensions.code === 'BAD_USER_INPUT') {
            setValidationError(true)
            setHelperText(t('duplicateTitleError'))
          } else {
            console.error(err.message)
          }
        }
      }
    },
    [t],
  )

  const validateTitle = titleStr => {
    const title = titleStr?.trim()
    if (typeof title != 'undefined' && title) {
      return true
    } else {
      setValidationError(true)
      setHelperText(t('emptyTitleError'))
      return false
    }
  }

  const [addDashboardFn, { loading: adding, data: addComplete, error }] = useStatefulApolloMutation(addDashboardMutation, {
    variables: { dashboardId: '' },
  })

  useEffect(() => {
    if (!adding && addComplete) {
      onAddSuccess()
    } else if (error) {
      onAddError(error)
    }
  }, [addComplete, adding, error, onAddError, onAddSuccess])

  const getUUID = (): string => {
    newDashboardId = uuid()
    return newDashboardId
  }

  const addDashboard = dashProps => {
    const title = dashProps.title
    if (validateTitle(title))
      addDashboardFn({
        variables: {
          dashboardId: getUUID(),
          title,
          globalTime: dashProps.globalTime.timeInterval,
          cardState: JSON.stringify(dashProps.cardState),
          layoutState: JSON.stringify(dashProps.layoutState),
        },
      })
  }

  const addEmptyDashboard = title => {
    if (validateTitle(title))
      addDashboardFn({
        variables: {
          dashboardId: getUUID(),
          title,
          globalTime: DEFAULT_TIME_INTERVAL,
          cardState: JSON.stringify({}),
          layoutState: JSON.stringify([]),
        },
      })
  }

  return {
    addDashboard,
    addEmptyDashboard,
    validationError,
    helperText,
    resetErrors,
  }
}
