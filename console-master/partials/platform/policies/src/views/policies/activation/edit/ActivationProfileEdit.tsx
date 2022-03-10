import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'

import { Backdrop, Box, CircularProgress, IconButton, makeStyles } from '@material-ui/core'

import { useQueryParams } from '@ues-behaviour/react'
import type { ActivationProfile } from '@ues-data/platform'
import { Permission, usePermissions, usePrevious, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { FullHeightTabs, PolicyInfoTabId, TAB_ID_QUERY_PARAM_NAME } from '@ues-platform/shared'
import { BasicCopy, BasicDelete, HelpLinks, I18nFormats } from '@ues/assets'
import {
  ConfirmationState,
  Loading,
  PageTitlePanel,
  useConfirmation,
  usePageTitle,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

import { mutationDeletePolicy, mutationUpdatePolicy, queryPolicy } from '../../../../store/policies'
import { isTaskResolved } from '../../../../store/policies/types'
import ActivationProfileEditor from '../ActivationProfileEditor'
import ProfileAssignments from './ProfileAssignments'

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  backdrop: {
    zIndex: theme.zIndex.snackbar,
  },
}))

const goBackPath = '/list/activation'

// eslint-disable-next-line sonarjs/cognitive-complexity
const ActivationProfileEdit = React.memo(() => {
  useSecuredContent(Permission.ECS_ACTIVATIONPROFILE_READ)
  const tabId = useQueryParams().get(TAB_ID_QUERY_PARAM_NAME)
  const { t, i18n } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const { profileId } = useParams()
  const navigate = useNavigate()
  const classes = useStyles()
  const formRef = useRef(null)
  const confirmation = useConfirmation()
  const snackbar = useSnackbar()
  const { hasPermission } = usePermissions()
  const [externalErrors, setExternalErrors] = useState(undefined)
  const [subtitle, setSubtitle] = useState('')

  const variables = useMemo(() => ({ entityId: profileId }), [profileId])
  const { data: policy, loading: policyTaskLoading } = useStatefulReduxQuery(queryPolicy, {
    skip: !profileId,
    variables,
  })

  const [updatePolicyStartAction, updatePolicyTask] = useStatefulReduxMutation(mutationUpdatePolicy)
  const [deletePolicyStartAction, deletePolicyTask] = useStatefulReduxMutation(mutationDeletePolicy)
  const prevUpdatePolicyTask = usePrevious(updatePolicyTask)
  const prevDeletePolicyTask = usePrevious(deletePolicyTask)
  const prevPolicyTaskLoading = usePrevious(policyTaskLoading)

  usePageTitle(t('profiles:policy.detail.user'))

  const checkTaskAndNotify = useCallback(
    (task, previousTask, successMessage) => {
      if (isTaskResolved(task, previousTask)) {
        if (task.error) {
          if (task.error['response']?.status === 409) {
            setExternalErrors({ name: t('activationProfile.form.nameExists') })
          } else if (task.error['response'].status === 400 && task.error['response'].data?.subStatusCode === 101) {
            snackbar.enqueueMessage(t('activationProfile.list.invalidEmailMessage'), 'error')
          } else if (task.error['response']?.status === 412) {
            snackbar.enqueueMessage(t('activationProfile.list.singleDeleteFailure'), 'error')
          } else {
            snackbar.enqueueMessage(t('activationProfile.list.deleteFailure'), 'error')
          }
        } else {
          navigate(goBackPath)
          snackbar.enqueueMessage(successMessage, 'success')
        }
      }
    },
    [snackbar, t, navigate],
  )

  useEffect(() => {
    checkTaskAndNotify(updatePolicyTask, prevUpdatePolicyTask, t('activationProfile.edit.successMessage'))
    checkTaskAndNotify(deletePolicyTask, prevDeletePolicyTask, t('activationProfile.delete.successMessage'))
  }, [updatePolicyTask, prevUpdatePolicyTask, deletePolicyTask, prevDeletePolicyTask, checkTaskAndNotify, t])

  const handleSubmit = async (profile: ActivationProfile) => {
    const confirmationState = await confirmation({
      title: t('activationProfile.editResendEmailConfirmation.title'),
      description: t('activationProfile.editResendEmailConfirmation.content'),
      cancelButtonLabel: t('general/form:commonLabels.no'),
      confirmButtonLabel: t('general/form:commonLabels.send'),
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      const profileCopy = { ...profile }
      profileCopy.resendEmail = true
      updatePolicyStartAction(profileCopy)
    }

    if (confirmationState === ConfirmationState.Canceled) {
      const profileCopy = { ...profile }
      profileCopy.resendEmail = false
      updatePolicyStartAction(profileCopy)
    }
  }

  const goBack = async () => {
    if (formRef.current && !formRef.current.isModified()) {
      navigate(goBackPath)
    } else {
      const confirmationState = await confirmation({
        title: t('activationProfile.unsaved.title'),
        description: t('activationProfile.unsaved.content'),
        cancelButtonLabel: t('general/form:commonLabels.cancel'),
        confirmButtonLabel: t('activationProfile.unsaved.submit'),
      })

      if (confirmationState === ConfirmationState.Confirmed) {
        navigate(goBackPath)
      }
    }
  }

  const confirmDelete = async () => {
    const confirmationState = await confirmation({
      title: t('activationProfile.delete.title'),
      description: t('activationProfile.delete.content', {
        profile: policy.name,
      }),
      content: t('activationProfile.delete.note'),
      cancelButtonLabel: t('general/form:commonLabels.cancel'),
      confirmButtonLabel: t('general/form:commonLabels.delete'),
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      deletePolicyStartAction({ entityId: profileId })
    }
  }

  const copyProfile = () => {
    navigate(`../../copy/${profileId}`)
  }

  useEffect(() => {
    if (profileId && prevPolicyTaskLoading === true && policyTaskLoading === false && policy) {
      setSubtitle(
        policy && policy.modified
          ? i18n.format(new Date(policy.modified), I18nFormats.DateTimeShort)
          : t('general/form:commonLabels.unknown'),
      )
    }
  }, [policyTaskLoading, prevPolicyTaskLoading, profileId, policy, t, i18n])

  return (
    <Box className={classes.container}>
      <PageTitlePanel
        goBack={goBack}
        title={[t('profiles:navigation.activation.label'), policy?.name]}
        subtitle={subtitle}
        actions={
          <>
            {hasPermission(Permission.ECS_ACTIVATIONPROFILE_CREATE) && (
              <IconButton size="small" onClick={copyProfile}>
                <BasicCopy />
              </IconButton>
            )}
            {hasPermission(Permission.ECS_ACTIVATIONPROFILE_DELETE) && (
              <IconButton size="small" onClick={confirmDelete}>
                <BasicDelete />
              </IconButton>
            )}
          </>
        }
        helpId={HelpLinks.Enrollment_Cronos}
      />
      <FullHeightTabs
        defaultSelectedTabIndex={tabId ? Number(tabId) : PolicyInfoTabId.Settings}
        tabs={[
          {
            label: t('profiles:policy.detail.settings'),
            tabContent: policyTaskLoading ? (
              <Loading />
            ) : (
              <Box marginLeft={15} marginRight={15}>
                <ActivationProfileEditor
                  readOnly={!hasPermission(Permission.ECS_ACTIVATIONPROFILE_UPDATE)}
                  initialEntity={policy}
                  onSubmitAction={handleSubmit}
                  onCancelAction={goBack}
                  externalErrors={externalErrors}
                  ref={formRef}
                />
              </Box>
            ),
          },
          {
            label: t('profiles:policy.detail.appliedUsersAndGroups'),
            tabContent: <ProfileAssignments profileId={profileId} />,
          },
        ]}
        onChange={tabId =>
          setImmediate(() => navigate(`/activation/edit/${profileId}?${TAB_ID_QUERY_PARAM_NAME}=${tabId}`, { replace: true }))
        }
      />
      <Backdrop className={classes.backdrop} open={updatePolicyTask.loading || deletePolicyTask.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
})

export default ActivationProfileEdit
