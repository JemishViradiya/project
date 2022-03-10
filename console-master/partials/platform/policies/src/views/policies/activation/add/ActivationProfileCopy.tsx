import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { Backdrop, Box, CircularProgress, makeStyles } from '@material-ui/core'

import type { ActivationProfile } from '@ues-data/platform'
import { Permission, usePrevious, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { HelpLinks } from '@ues/assets'
import { ConfirmationState, Loading, PageTitlePanel, useConfirmation, useSecuredContent, useSnackbar } from '@ues/behaviours'

import { mutationCreatePolicy, queryPolicy } from '../../../../store/policies'
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

const ActivationProfileCopy = React.memo(() => {
  useSecuredContent(Permission.ECS_ACTIVATIONPROFILE_READ, Permission.ECS_ACTIVATIONPROFILE_CREATE)
  const { t } = useTranslation(['platform/common', 'general/form'])
  const navigate = useNavigate()
  const { profileId } = useParams()
  const classes = useStyles()
  const formRef = useRef(null)
  const confirmation = useConfirmation()
  const snackbar = useSnackbar()
  const [externalErrors, setExternalErrors] = useState(undefined)

  const variables = useMemo(() => ({ entityId: profileId }), [profileId])
  const { data: policy, loading: policyTaskLoading, refetch } = useStatefulReduxQuery(queryPolicy, {
    skip: !profileId,
    variables,
  })

  useEffect(() => {
    refetch({ entityId: profileId })
  }, [profileId, refetch])

  const [createPolicyStartAction, createPolicyTask] = useStatefulReduxMutation(mutationCreatePolicy)
  const prevCreatePolicyTask = usePrevious(createPolicyTask)

  const onSubmit = (profile: ActivationProfile) => {
    createPolicyStartAction({ ...profile })
  }

  const getInitialEntity = (entity: ActivationProfile): ActivationProfile => {
    return { ...entity, name: '', id: null, isDefault: false }
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
        navigate(goBackPath + profileId)
      }
    }
  }, [createPolicyTask, prevCreatePolicyTask, navigate, profileId, t, snackbar])

  const goBack = async () => {
    if (formRef.current && !formRef.current.isModified()) {
      navigate(goBackPath + profileId)
    } else {
      const confirmationState = await confirmation({
        title: t('activationProfile.unsaved.title'),
        description: t('activationProfile.unsaved.content'),
        cancelButtonLabel: t('general/form:commonLabels.cancel'),
        confirmButtonLabel: t('activationProfile.unsaved.submit'),
      })

      if (confirmationState === ConfirmationState.Confirmed) {
        navigate(goBackPath + profileId)
      }
    }
  }

  return (
    <Box width="100%" p={2}>
      <PageTitlePanel goBack={goBack} title={t('activationProfile.copy.title')} helpId={HelpLinks.Enrollment_Cronos} />
      <Box className={classes.settingsPanel}>
        {policyTaskLoading ? (
          <Loading />
        ) : (
          <ActivationProfileEditor
            readOnly={false}
            initialEntity={getInitialEntity(policy)}
            onSubmitAction={onSubmit}
            onCancelAction={goBack}
            externalErrors={externalErrors}
            ref={formRef}
          />
        )}
      </Box>
      <Backdrop className={classes.backdrop} open={createPolicyTask.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
})

export default ActivationProfileCopy
