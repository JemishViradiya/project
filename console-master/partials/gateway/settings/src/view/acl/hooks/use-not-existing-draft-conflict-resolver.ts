//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import * as httpStatus from 'http-status-codes'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

import { usePrevious } from '@ues-behaviour/react'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { Config, Data, Types, Utils } from '@ues-gateway/shared'
import { ConfirmationState, useConfirmation } from '@ues/behaviours'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getCreateDraftTask, queryCommittedAclRules, queryCommittedAclRulesProfile } = Data
const { isTaskRejected, makePageRoute } = Utils
const { Page } = Types

export const useNotExistingDraftConflictResolver = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const confirmation = useConfirmation()
  const navigate = useNavigate()

  const createDraftTask = useSelector(getCreateDraftTask)
  const previousCreateDraftTask = usePrevious(createDraftTask)

  const { refetch: refetchCommittedAclRules } = useStatefulReduxQuery(queryCommittedAclRules, { skip: true })
  const { refetch: refetchCommittedAclRulesProfile } = useStatefulReduxQuery(queryCommittedAclRulesProfile, { skip: true })

  const showConfirmationDialog = async () => {
    const confirmationState = await confirmation({
      title: t('acl.notExistingDraftConflictPromptTitle'),
      description: t('acl.notExistingDraftConflictPromptDescription'),
      cancelButtonLabel: t('common.buttonCancel'),
      confirmButtonLabel: t('acl.notExistingDraftConflictPromptConfirmButton'),
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      // TODO when backend ready, check carefully in network tab upcoming requests, validate and ensure that the behaviour is as expected
      refetchCommittedAclRules()
      refetchCommittedAclRulesProfile()

      navigate(makePageRoute(Page.GatewaySettingsAcl))
    }
  }

  useEffect(() => {
    if (isTaskRejected(createDraftTask, previousCreateDraftTask) && createDraftTask?.error?.status === httpStatus.CONFLICT) {
      showConfirmationDialog()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createDraftTask])
}
