import { pick } from 'lodash-es'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { usePrevious } from '@ues-behaviour/react'
import { Types, Utils } from '@ues-gateway/shared'

const { Page } = Types
const { makePageRoute, isTaskResolved } = Utils

type UseNavigateToViewFn = () => (rulesType?: Types.AclRulesType) => void

export const useNavigateToView: UseNavigateToViewFn = () => {
  const navigate = useNavigate()

  return (rulesType: Types.AclRulesType) => {
    navigate(makePageRoute(Page.GatewaySettingsAcl, { params: { rulesType } }))
  }
}

type UseNavigateToViewListenerFn = (taskData: Utils.Task, rulesType: Types.AclRulesType) => void

export const useNavigateToViewListener: UseNavigateToViewListenerFn = (taskData, rulesType) => {
  const navigateToView = useNavigateToView()
  const task = pick(taskData, ['loading', 'error'])
  const previousTask = usePrevious(task)

  useEffect(() => {
    if (isTaskResolved(task, previousTask)) {
      navigateToView(rulesType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rulesType, task, previousTask])
}
