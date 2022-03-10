/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

/* eslint-disable sonarjs/cognitive-complexity*/
import { Formik } from 'formik'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Box } from '@material-ui/core'

import { useQueryParams } from '@ues-behaviour/react'
import type { Policy } from '@ues-data/eid'
import { mutateCreatePolicy, queryAllTemplates, queryAuthenticators, queryAuthorizedSoftwares } from '@ues-data/eid'
import {
  FeatureName,
  FeaturizationApi,
  Permission,
  usePermissions,
  useStatefulAsyncMutation,
  useStatefulAsyncQuery,
} from '@ues-data/shared'
import { HelpLinks } from '@ues/assets'
import { ConfirmationState, PageTitlePanel, useConfirmation, useSecuredContent, useSnackbar } from '@ues/behaviours'

import { Busy } from './common/busy'
import { getI18Name, useTranslation } from './common/i18n'
import PolicyForm from './common/policyForm'
import {
  ENQUEUE_TYPE,
  MODE_PARAM_VALUE,
  POLICY_DEFAULTS,
  QUERY_STRING_PARM,
  SERVER_POLICY_OPERATION,
  UPDATE_TABS,
} from './common/settings'
import { FormProvider, useFormValidation } from './common/validate'
import { useReference } from './reference'
import { FORM_REFS } from './reference/types'

const enableExceptions = FeaturizationApi.isFeatureEnabled(FeatureName.PolicyAuthenticationException)

function PolicyCreateComponent(): JSX.Element {
  useSecuredContent(Permission.ECS_IDENTITY_CREATE)
  const { t } = useTranslation()
  const mode = useQueryParams().get(QUERY_STRING_PARM.MODE)
  const { state } = useLocation()
  const [isFormDirty, setIsFormDirty] = React.useState<boolean>(false)
  const [isDataLoaded, setIsDataLoaded] = React.useState<boolean>(false)
  const [canValidate, setCanValidate] = React.useState<boolean>(false)
  const [payload, setPayload] = React.useState<any>()
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const confirmation = useConfirmation()
  const formValidation = useFormValidation()
  const { focus, select, isDirty, setRef } = useReference()
  const { hasPermission } = usePermissions()
  const userUpdatable = hasPermission(Permission.ECS_USERS_UPDATE)

  useEffect(() => {
    if (mode === MODE_PARAM_VALUE.COPY) {
      setPayload(state)
    } else {
      setPayload(JSON.parse(JSON.stringify(POLICY_DEFAULTS)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onLeavePage = async () => {
    if (isDirty() || isFormDirty) {
      const confirmationState = await confirmation({
        title: t('policy.modifiedPolicyConfirmationDialog.title'),
        description: t('policy.modifiedPolicyConfirmationDialog.description'),
        cancelButtonLabel: t('policy.modifiedPolicyConfirmationDialog.cancelButton'),
        confirmButtonLabel: t('policy.modifiedPolicyConfirmationDialog.confirmButton'),
      })

      if (confirmationState === ConfirmationState.Confirmed) {
        navigate(-1)
      }
    } else {
      navigate(-1)
    }
  }

  const onCreatePolicy = async () => {
    // If lacking assign policy permission do not display dialog
    if (!userUpdatable) {
      navigate(-1)
    } else {
      const confirmationState = await confirmation({
        title: t('policy.createPolicyAssignConfirmationDialog.title'),
        description: t('policy.createPolicyAssignConfirmationDialog.description'),
        cancelButtonLabel: t('policy.createPolicyAssignConfirmationDialog.cancelButton'),
        confirmButtonLabel: t('policy.createPolicyAssignConfirmationDialog.confirmButton'),
      })

      if (confirmationState === ConfirmationState.Confirmed) {
        window.history.pushState({ urlPath: '#/list/enterpriseIdentity' }, '', '#/list/enterpriseIdentity')
        navigate(`../update/${dataCreate?.id}?${QUERY_STRING_PARM.TAB}=${UPDATE_TABS.USERS_AND_GROUPS}`)
      }
      if (confirmationState === ConfirmationState.Canceled) {
        navigate(-1)
      }
    }
  }

  // defined mutation for policy create
  const [createPolicy, { data: dataCreate, loading: loadingCreate, error: errorCreate }] = useStatefulAsyncMutation(
    mutateCreatePolicy,
    {},
  )

  // query authenticators
  const { data: dataAuthenticators, error: errorAuthenticators, loading: loadingAuthenticators } = useStatefulAsyncQuery(
    queryAuthenticators,
    {},
  )

  // query all templates (static and non-static)
  const { data: dataTemplates, loading: loadingTemplates, error: errorTemplates } = enableExceptions
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useStatefulAsyncQuery(queryAllTemplates, {})
    : { data: [], error: undefined, loading: false }

  // query authorized software
  const { data: dataApps, error: errorApps, loading: loadingApps } = enableExceptions
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useStatefulAsyncQuery(queryAuthorizedSoftwares, {})
    : { data: [], error: undefined, loading: false }

  /**
   * Provides a AsyncQueryState<Result> tracking a mutation lifecycle
   *
   * 1. Renders with { loading: true, data?: Result }
   * 2. Success renders with { loading: false, data: Result }
   * 3. Failure renders with { loading: false, error: Error, data?: Result }
   * */
  useEffect(() => {
    //console.log('create: ', { dataCreate, loadingCreate, errorCreate })
    if (dataCreate && loadingCreate === false && !errorCreate) {
      snackbar.enqueueMessage(t(getI18Name('policyCreatedMessage')), ENQUEUE_TYPE.SUCCESS)
      onCreatePolicy()
    } else if (loadingCreate === false && errorCreate) {
      formValidation.processServerError(errorCreate, SERVER_POLICY_OPERATION.UPDATE)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCreate, loadingCreate, errorCreate])

  useEffect(() => {
    //console.log('apps: ', { dataApps, loadingApps, errorApps })
    if (loadingApps === false && errorApps) {
      snackbar.enqueueMessage(t(getI18Name('appsLoadErrorMesage')), ENQUEUE_TYPE.ERROR)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataApps, loadingApps, errorApps])

  useEffect(() => {
    //console.log('Templates: ', { dataTemplates, loadingTemplates, errorTemplates })
    if (loadingTemplates === false && errorTemplates) {
      snackbar.enqueueMessage(t(getI18Name('swTemplateLoadErrorMesage')), ENQUEUE_TYPE.ERROR)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTemplates, loadingTemplates, errorTemplates])

  useEffect(() => {
    //console.log('authenticators: ', { dataAuthenticators, loadingAuthenticators, errorAuthenticators })
    if (loadingAuthenticators === false && errorAuthenticators) {
      snackbar.enqueueMessage(t(getI18Name('authenticatorsLoadErrorMesage')), ENQUEUE_TYPE.ERROR)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataAuthenticators, loadingAuthenticators, errorAuthenticators])

  useEffect(() => {
    if (loadingAuthenticators === false && loadingTemplates === false && loadingApps === false) {
      setIsDataLoaded(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingApps, loadingTemplates, loadingAuthenticators])

  // Once loaded set focus to required name field
  useEffect(() => {
    if (isDataLoaded) {
      focus(FORM_REFS.POLICY_NAME)
      select(FORM_REFS.POLICY_NAME)
    }
  }, [isDataLoaded, focus, select])

  if (!isDataLoaded || loadingCreate === true) {
    return <Busy creating={loadingCreate} />
  }

  return (
    <Box width="100%" p={2}>
      <PageTitlePanel goBack={onLeavePage} title={t(getI18Name('createPolicyPageTitle'))} helpId={HelpLinks.AuthenticationPolicy} />
      <Formik
        initialValues={payload}
        validate={values => formValidation.validate(values, errorCreate, payload)}
        innerRef={el => setRef(FORM_REFS.FORMIK_BAG, el)}
        onSubmit={(values: Policy) => {
          setCanValidate(true)
          createPolicy({ policy: values })
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
            setIsFormDirty={setIsFormDirty}
            dataAuthenticators={dataAuthenticators}
            dataTemplates={dataTemplates}
            dataApps={dataApps}
            originalPayload={POLICY_DEFAULTS}
            canValidate={canValidate}
            setCanValidate={setCanValidate}
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
