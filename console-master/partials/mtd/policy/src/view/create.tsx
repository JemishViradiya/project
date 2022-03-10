/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { Formik } from 'formik'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { Box } from '@material-ui/core'

import { useQueryParams } from '@ues-behaviour/react'
import { MtdPolicies, mutateCreateMtdPolicy } from '@ues-data/mtd'
import { FeatureName, FeaturizationApi, Permission, usePermissions, useStatefulReduxMutation } from '@ues-data/shared'
import { HelpLinks } from '@ues/assets'
import {
  ConfirmationState,
  PageTitlePanel,
  useConfirmation,
  useFeatureCheck,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

import { Busy } from './common/busy'
import { getI18Name, useTranslation } from './common/i18n'
import { ENQUEUE_TYPE } from './common/notification'
import PolicyForm from './common/policyForm'
import { useReference } from './common/reference'
import {
  FORM_REFS,
  MODE_PARAM_VALUE,
  POLICY_DEFAULTS,
  QUERY_STRING_PARM,
  SERVER_POLICY_OPERATION,
  UPDATE_TABS,
} from './common/settings'
import { FormProvider, useFormValidation } from './common/validate'

const { ResetError, ResetPolicy, selectPolicy } = MtdPolicies

// eslint-disable-next-line sonarjs/cognitive-complexity
function PolicyCreateComponent(): JSX.Element {
  useSecuredContent(Permission.MTD_POLICY_CREATE)
  useFeatureCheck(isEnabled => isEnabled(FeatureName.MobileThreatDetection) && isEnabled(FeatureName.UESCronosNavigation))
  const { t } = useTranslation()
  const { creating, error, redirect, isFormDirty, data } = useSelector(selectPolicy)
  const dispatch = useDispatch()
  const [entered, setEntered] = React.useState(false)
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const confirmation = useConfirmation()
  const formValidation = useFormValidation()
  const references = useReference()
  const { hasPermission } = usePermissions()
  const userUpdatable = hasPermission(Permission.ECS_USERS_UPDATE)

  const [createPolicy] = useStatefulReduxMutation(mutateCreateMtdPolicy)
  const mode = useQueryParams().get(QUERY_STRING_PARM.MODE)
  const { state } = useLocation()
  const [payload, setPayload] = React.useState<any>()
  const [errorCondition, setErrorCondition] = React.useState<any>()

  const goBack = () => {
    navigate('../../list/protectMobile')
  }

  useEffect(() => {
    if (entered) {
      setTimeout(() => {
        references.focus(FORM_REFS.POLICY_NAME)
      }, 250)
    }
  }, [entered, references])

  const onLeavePage = async () => {
    if (isFormDirty) {
      const confirmationState = await confirmation({
        title: t('policy.modifiedPolicyConfirmationDialog.title'),
        description: t('policy.modifiedPolicyConfirmationDialog.description'),
        cancelButtonLabel: t('policy.modifiedPolicyConfirmationDialog.cancelButton'),
        confirmButtonLabel: t('policy.modifiedPolicyConfirmationDialog.confirmButton'),
      })

      if (confirmationState === ConfirmationState.Confirmed) {
        goBack()
      }
    } else {
      goBack()
    }
  }

  const onCreatePolicy = async () => {
    // If lacking assign policy permission do not display dialog
    if (!userUpdatable) {
      goBack()
    } else {
      const confirmationState = await confirmation({
        title: t('policy.createPolicyAssignConfirmationDialog.title'),
        description: t('policy.createPolicyAssignConfirmationDialog.description'),
        cancelButtonLabel: t('policy.createPolicyAssignConfirmationDialog.cancelButton'),
        confirmButtonLabel: t('policy.createPolicyAssignConfirmationDialog.confirmButton'),
      })

      if (confirmationState === ConfirmationState.Confirmed) {
        dispatch(ResetPolicy())
        navigate(`../update/${data?.id}?${QUERY_STRING_PARM.TAB}=${UPDATE_TABS.USERS_AND_GROUPS}`)
      } else if (confirmationState === ConfirmationState.Canceled) {
        goBack()
      }
    }
  }

  useEffect(() => {
    if (mode === MODE_PARAM_VALUE.COPY) {
      setPayload(state)
    } else {
      setPayload(JSON.parse(JSON.stringify(POLICY_DEFAULTS)))
    }
    if (!entered) {
      setEntered(true)
    }
    return function cleanup() {
      dispatch(ResetPolicy())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (errorCondition) {
      formValidation.processServerError(errorCondition, SERVER_POLICY_OPERATION.UPDATE)
    }
  }, [errorCondition, formValidation])

  useEffect(() => {
    if (error) {
      dispatch(ResetError())
      setErrorCondition(error)
    }
  }, [dispatch, error, formValidation])

  // upon successful policy create navigate to policy list
  useEffect(() => {
    if (redirect) {
      snackbar.enqueueMessage(t(getI18Name('policyCreatedMessage')), ENQUEUE_TYPE.SUCCESS)
      if (FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode) === false) {
        onCreatePolicy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, redirect])

  // if (creating || (mode === MODE_PARAM_VALUE.COPY && !payload)) {
  if (creating || !payload) {
    return <Busy creating={creating} />
  }

  return (
    <Box width="100%" p={2}>
      <PageTitlePanel goBack={onLeavePage} title={t(getI18Name('createPolicyPageTitle'))} helpId={HelpLinks.ProtectMobilePolicy} />
      <Formik
        initialValues={payload}
        validate={values => formValidation.validate(values, errorCondition, payload)}
        innerRef={el => references.setRef(FORM_REFS.FORMIK_BAG, el)}
        onSubmit={(values: { name: string }, { setSubmitting }) => {
          formValidation.formSubmitPreprocess(values)
          createPolicy({ payload: values, setSubmitting })
          setPayload(values)
        }}
      >
        {({ handleChange, values, isSubmitting, errors, dirty }) => (
          <PolicyForm
            handleChange={handleChange}
            values={values}
            errors={errors}
            isSubmitting={isSubmitting}
            onLeavePage={onLeavePage}
            dirty={dirty}
            isFormDirty={isFormDirty}
            writable={true}
            saveButtonLabel={t(getI18Name('create.addButtonLabel'))}
          />
        )}
      </Formik>
    </Box>
  )
}

export default function PolicyCreate() {
  return (
    <FormProvider>
      <PolicyCreateComponent />
    </FormProvider>
  )
}
