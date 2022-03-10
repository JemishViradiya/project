//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Box } from '@material-ui/core'

import { useStatefulReduxMutation } from '@ues-data/shared'
import { Config, Data, Hooks } from '@ues-gateway/shared'
import { ConfirmationState, FormButtonPanel, ProgressButton, useConfirmation } from '@ues/behaviours'

import useStyles from './list/styles'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { useStatefulNotifications } = Hooks
const { mutationCommitDraft, mutationDiscardDraft, getHasAclVersionsConflict } = Data

const DraftUpdateActions: React.FC = () => {
  const classes = useStyles()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const confirmation = useConfirmation()
  const hasAclVersionsConflict = useSelector(getHasAclVersionsConflict)

  const [commitDraftStart, commitAclRulesTask] = useStatefulNotifications(useStatefulReduxMutation(mutationCommitDraft), {
    success: t('acl.commitDraftSuccessMessage'),
    error: t('acl.commitDraftErrorMessage'),
  })
  const [discardDraftStart, discardAclRulesTask] = useStatefulNotifications(useStatefulReduxMutation(mutationDiscardDraft), {
    success: t('acl.discardDraftSuccessMessage'),
    error: t('acl.discardDraftErrorMessage'),
  })

  const shouldDisableActionButton = commitAclRulesTask?.loading || discardAclRulesTask?.loading

  const showActionConfirmation = async (
    triggerAction: () => void,
    titleTranslationKey: string,
    descriptionTranslationKey: string,
    confirmBtnTranslationKey: string,
    contentTranslationKey?: string,
  ) => {
    const confirmationState = await confirmation({
      title: t(titleTranslationKey),
      description: t(descriptionTranslationKey),
      content: contentTranslationKey && t(contentTranslationKey),
      cancelButtonLabel: t('common.buttonCancel'),
      confirmButtonLabel: t(confirmBtnTranslationKey),
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      triggerAction()
    }
  }

  return (
    <Box className={classes.tableStickyActions}>
      <FormButtonPanel show>
        <ProgressButton
          disabled={shouldDisableActionButton}
          loading={discardAclRulesTask?.loading}
          onClick={() =>
            showActionConfirmation(
              discardDraftStart,
              'acl.discardActionPromptTitle',
              'acl.discardActionPromptDescription',
              'acl.discardDraft',
            )
          }
          variant="outlined"
        >
          {t('acl.discardDraft')}
        </ProgressButton>
        <ProgressButton
          color="primary"
          disabled={shouldDisableActionButton}
          loading={commitAclRulesTask?.loading}
          onClick={() =>
            showActionConfirmation(
              commitDraftStart,
              'acl.commitActionPromptTitle',
              hasAclVersionsConflict ? 'acl.commitOutOfSyncActionPromptDescription' : 'acl.commitActionPromptDescription',
              hasAclVersionsConflict ? 'acl.commitRulesAndOverride' : 'acl.commitRules',
              hasAclVersionsConflict && 'acl.commitOutOfSyncActionPromptContent',
            )
          }
          variant="contained"
        >
          {t('acl.commitRules')}
        </ProgressButton>
      </FormButtonPanel>
    </Box>
  )
}

export default DraftUpdateActions
