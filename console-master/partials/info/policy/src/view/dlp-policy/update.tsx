/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { Box, IconButton } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip/Tooltip'

import { usePrevious, useQueryParams } from '@ues-behaviour/react'
import { PolicyData } from '@ues-data/dlp'
import { useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { BasicDelete as DeleteIcon } from '@ues/assets'
import {
  ConfirmationState,
  ContentArea,
  ContentAreaPanel,
  PageTitlePanel,
  SecuredContentBoundary,
  Tabs,
  useConfirmation,
  usePageTitle,
  useSnackbar,
  useStatefulTabsProps,
} from '@ues/behaviours'

import { DlpQueryStringParamName, PolicyInfoTabIdParam } from './common/types/routing'
import cancelNavigation from './helpers/cancelNavigation'
import PolicyAssignedUsers from './policy-assigned-users'
import PolicyEditor from './policy-editor/index'
import { usePoliciesPermissions } from './usePoliciesPermission'

const PolicyUpdate = (): JSX.Element => {
  const { t } = useTranslation(['dlp/policy', 'profiles'])
  const { guid, policyType } = useParams()
  const confirmation = useConfirmation()
  const snackbar = useSnackbar()
  const tabId = useQueryParams().get(DlpQueryStringParamName.TabId)
  const { canDelete, canRead } = usePoliciesPermissions()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  usePageTitle(t('profiles:policy.detail.user'))

  useEffect(() => {
    dispatch(PolicyData.clearPolicy())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [deletePolicyAction, deletePolicyTask] = useStatefulReduxMutation(PolicyData.mutationDeletePolicy)
  const { loading: loadingPolicy, data: policyData, error: errorPolicy } = useStatefulReduxQuery(PolicyData.queryPolicy, {
    variables: { policyId: guid },
  })

  const tabs = useMemo(
    () => [
      {
        translations: {
          label: 'profiles:policy.detail.settings',
        },
        component: <PolicyEditor contentAreaDisplaying={true} />,
      },
      {
        translations: {
          label: 'profiles:policy.detail.appliedUsersAndGroups',
        },
        component: <PolicyAssignedUsers />,
      },
    ],
    [],
  )

  const tabsProps = useStatefulTabsProps({
    defaultSelectedTabIndex: tabId ? Number(tabId) : PolicyInfoTabIdParam.Settings,
    tabs,
    tNs: ['profiles'],
  })
  const hasUnsavedChanges = useSelector(PolicyData.getHasUnsavedPolicyChanges(false))

  // TODO add tab handling func
  const handleTabChange = useCallback(
    (selectedTabIndex: number) => {
      navigate(`../${guid}?tabId=${selectedTabIndex}`)
    },
    [navigate, guid],
  )

  const deletePolicyTaskPrev = usePrevious(deletePolicyTask)
  useEffect(() => {
    if (!deletePolicyTask.loading && deletePolicyTaskPrev.loading && deletePolicyTask.error) {
      snackbar.enqueueMessage(t('policy.error.delete'), 'error')
    } else if (!deletePolicyTask.loading && deletePolicyTaskPrev.loading) {
      snackbar.enqueueMessage(t('policy.success.delete'), 'success')
      navigate(`../../../policies/${policyType}`)
    }
  })

  const getAction = () => {
    return (
      <Tooltip title={t('policy.updateFormDeletePolicyTooltip')}>
        <IconButton
          disabled={false}
          size="small"
          id="deletePolicyButton"
          onClick={async () => {
            const confirmationState = await confirmation({
              title: t('policy.deletePolicyConfirmationDialogTitle'),
              description: t('policy.deletePolicyConfirmationDialogDesc'),
              content: t('policy.deleteNote'),
              cancelButtonLabel: t('policy.buttons.cancel'),
              confirmButtonLabel: t('policy.buttons.delete'),
            })
            if (confirmationState === ConfirmationState.Confirmed) {
              // TODO: add handler and popup
              deletePolicyAction({ policyId: guid })
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    )
  }

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <PageTitlePanel
        title={policyData?.policyName}
        subtitle={t('policy.detail.updated', { date: policyData?.modified })}
        goBack={() => cancelNavigation(hasUnsavedChanges, confirmation, navigate, t, policyType)}
        actions={canDelete && getAction()}
      />
      <Tabs {...tabsProps}>
        {canRead ? (
          tabsProps.children
        ) : (
          <ContentArea>
            <ContentAreaPanel ContentWrapper={SecuredContentBoundary} fullWidth>
              {tabsProps.children}
            </ContentAreaPanel>
          </ContentArea>
        )}
      </Tabs>
    </Box>
  )
}

export default PolicyUpdate
