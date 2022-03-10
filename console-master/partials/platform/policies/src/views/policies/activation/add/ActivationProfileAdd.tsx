import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { Backdrop, Box, CircularProgress, makeStyles } from '@material-ui/core'

import type { ActivationProfile } from '@ues-data/platform'
import { Permission, usePermissions, usePrevious, useStatefulReduxMutation } from '@ues-data/shared'
import { HelpLinks } from '@ues/assets'
import { ConfirmationState, PageTitlePanel, useConfirmation, useSecuredContent, useSnackbar } from '@ues/behaviours'

import { mutationCreatePolicy } from '../../../../store/policies'
import { isTaskResolved } from '../../../../store/policies/types'
import ActivationProfileEditor from '../ActivationProfileEditor'

const useStyles = makeStyles(theme => ({
  settingsPanel: {
    marginLeft: theme.spacing(15),
    marginRight: theme.spacing(15),
    marginTop: theme.spacing(2),
  },
  backdrop: {
    zIndex: theme.zIndex.snackbar,
  },
}))

const goBackPath = -1

const ActivationProfileAdd = React.memo(() => {
  useSecuredContent(Permission.ECS_ACTIVATIONPROFILE_CREATE)
  const { t } = useTranslation(['platform/common', 'general/form'])
  const navigate = useNavigate()
  const classes = useStyles()
  const formRef = useRef(null)
  const confirmation = useConfirmation()
  const snackbar = useSnackbar()
  const [externalErrors, setExternalErrors] = useState(undefined)
  const { hasPermission } = usePermissions()
  const userUpdatable = hasPermission(Permission.ECS_USERS_UPDATE)

  const [createPolicyStartAction, createPolicyTask] = useStatefulReduxMutation(mutationCreatePolicy)
  const prevCreatePolicyTask = usePrevious(createPolicyTask)

  const onSubmit = (profile: ActivationProfile) => {
    createPolicyStartAction({ ...profile })
  }

  const showCreatePolicyConfirmation = async () => {
    let confirmationState = ConfirmationState.Canceled
    if (userUpdatable) {
      confirmationState = await confirmation({
        title: t('activationProfile.assignCreatedPolicyConfirmation.title'),
        description: t('activationProfile.assignCreatedPolicyConfirmation.description'),
        cancelButtonLabel: t('general/form:commonLabels.notNow'),
        confirmButtonLabel: t('general/form:commonLabels.yes'),
      })
    }

    if (confirmationState === ConfirmationState.Confirmed) {
      navigate({ pathname: '../..', hash: `activation/edit/${createPolicyTask?.data?.id}?tabId=1` })
    }

    if (confirmationState === ConfirmationState.Canceled) {
      navigate(goBackPath)
    }
  }

  useEffect(() => {
    if (isTaskResolved(createPolicyTask, prevCreatePolicyTask)) {
      if (createPolicyTask.error) {
        if (createPolicyTask.error['response'].status === 409) {
          setExternalErrors({ name: t('activationProfile.form.nameExists') })
        } else if (
          createPolicyTask.error['response'].status === 400 &&
          createPolicyTask.error['response'].data?.subStatusCode === 101
        ) {
          snackbar.enqueueMessage(t('activationProfile.list.invalidEmailMessage'), 'error')
        } else {
          snackbar.enqueueMessage(t(createPolicyTask.error.message), 'error')
        }
      } else {
        snackbar.enqueueMessage(t('activationProfile.add.successMessage'), 'success')
        showCreatePolicyConfirmation()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createPolicyTask, prevCreatePolicyTask, navigate, t, snackbar])

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

  return (
    <Box width="100%" p={2}>
      <PageTitlePanel goBack={goBack} title={t('activationProfile.add.title')} helpId={HelpLinks.Enrollment_Cronos} />
      <Box className={classes.settingsPanel}>
        <ActivationProfileEditor
          readOnly={false}
          onSubmitAction={onSubmit}
          onCancelAction={goBack}
          externalErrors={externalErrors}
          ref={formRef}
        />
      </Box>
      <Backdrop className={classes.backdrop} open={createPolicyTask.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
})

export default ActivationProfileAdd
