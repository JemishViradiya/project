//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Button } from '@material-ui/core'

import { usePrevious } from '@ues-behaviour/react'
import { useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { Config, Data, Hooks, Types, Utils } from '@ues-gateway/shared'
import { BasicAdd, BasicSwapHoriz } from '@ues/assets'
import { TableToolbar } from '@ues/behaviours'

import { useAclRouteDetails } from '../../hooks'

const { GATEWAY_TRANSLATIONS_KEY, DEFAULT_LIST_QUERY_PARAMS, DEFAULT_LIST_QUERY_PARAMS_LIMIT } = Config
const { makePageRoute, isTaskResolved } = Utils
const {
  getListRankModeEnabled,
  toggleListRankModeEnabled,
  getLocalAclRulesListData,
  getHasLoadedAllDraftRules,
  queryDraftAclRules,
  getHasAclRulesDraft,
  mutationBootstrapDraft,
} = Data
const { Page } = Types
const { useBigPermissions, BigService, useStatefulNotifications } = Hooks

interface ListActionsToolbarProps {
  listLoading: boolean
  readOnly: boolean
}

const ListActionsToolbar: React.FC<ListActionsToolbarProps> = ({ listLoading, readOnly }) => {
  const { canCreate, canUpdate } = useBigPermissions(BigService.Acl)

  const navigate = useNavigate()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const rankModeEnabled = useSelector(getListRankModeEnabled)
  const localListData = useSelector(getLocalAclRulesListData)
  const hasLoadedAllDraftRules = useSelector(getHasLoadedAllDraftRules)
  const hasAclRulesDraft = useSelector(getHasAclRulesDraft)
  const dispatch = useDispatch()
  const { rulesType } = useAclRouteDetails()

  const { refetch: refetchDraftRules } = useStatefulReduxQuery(queryDraftAclRules, { skip: true })
  const [bootstrapDraftAndPrepareRankMode, bootstrapDraftTask] = useStatefulNotifications(
    useStatefulReduxMutation(mutationBootstrapDraft),
    {
      success: t('acl.createDraftSuccessMessage'),
      error: t('acl.createDraftErrorMessage'),
    },
  )
  const previousBootstrapDraftTask = usePrevious(bootstrapDraftTask)

  useEffect(() => {
    if (isTaskResolved(bootstrapDraftTask, previousBootstrapDraftTask)) {
      prepareRankMode()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootstrapDraftTask])

  const loadAllDraftRules = () => {
    if (!hasLoadedAllDraftRules) {
      refetchDraftRules({
        params: { ...DEFAULT_LIST_QUERY_PARAMS, max: DEFAULT_LIST_QUERY_PARAMS_LIMIT },
      })
    }
  }

  const prepareRankMode = () => {
    loadAllDraftRules()
    dispatch(toggleListRankModeEnabled())
  }

  const goToRankMode = () => (hasAclRulesDraft ? prepareRankMode() : bootstrapDraftAndPrepareRankMode())

  return (
    <TableToolbar
      begin={
        <>
          {canCreate && !rankModeEnabled && (
            <Button
              disabled={readOnly}
              startIcon={<BasicAdd />}
              color="secondary"
              variant="contained"
              onClick={() => {
                navigate(
                  makePageRoute(Page.GatewaySettingsAclAdd, {
                    params: { rulesType },
                  }),
                )
              }}
            >
              {t('acl.labelAddRule')}
            </Button>
          )}

          {canUpdate && !rankModeEnabled && (
            <Button
              disabled={listLoading || localListData?.length <= 1 || readOnly}
              startIcon={<BasicSwapHoriz />}
              variant="contained"
              color="primary"
              onClick={goToRankMode}
            >
              {t('common.order')}
            </Button>
          )}

          {/* TODO will be addressed with BIG-5134 */}
          {/* <Button
              disabled={listLoading}
              startIcon={<ChartTopList />}
              variant="contained"
              color="primary"
            >
              {t('acl.labelTestRules')}
            </Button> */}
        </>
      }
    />
  )
}

export default ListActionsToolbar
