/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

/* eslint-disable sonarjs/cognitive-complexity*/
import { Formik } from 'formik'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Box, IconButton, makeStyles, Tab, Tooltip } from '@material-ui/core'
import { TabContext, TabList, TabPanel } from '@material-ui/lab'

import { useQueryParams } from '@ues-behaviour/react'
import type { Policy } from '@ues-data/eid'
import {
  mutateDeletePolicy,
  mutateUpdatePolicy,
  queryAllTemplates,
  queryAuthenticators,
  queryAuthorizedSoftwares,
  queryPolicy,
} from '@ues-data/eid'
import {
  FeatureName,
  FeaturizationApi,
  Permission,
  usePermissions,
  useStatefulAsyncMutation,
  useStatefulAsyncQuery,
} from '@ues-data/shared'
import { BasicDelete, HelpLinks } from '@ues/assets'
import { ConfirmationState, PageTitlePanel, useConfirmation, usePageTitle, useSecuredContent, useSnackbar } from '@ues/behaviours'

import { Busy } from './common/busy'
import { filterPolicyForUpdate } from './common/filter'
import { getI18Name, useTranslation } from './common/i18n'
import PolicyForm from './common/policyForm'
import { ENQUEUE_TYPE, QUERY_STRING_PARM, SERVER_POLICY_OPERATION, UPDATE_TABS } from './common/settings'
import { FormProvider, useFormValidation } from './common/validate'
import ProfileAssignments from './policy-assigned-users'
import { useReference } from './reference'
import { FORM_REFS } from './reference/types'

const useStyles = makeStyles(theme => ({
  assignmentsTabPanel: {
    flex: '1 1 auto',
  },
}))

const enableExceptions = FeaturizationApi.isFeatureEnabled(FeatureName.PolicyAuthenticationException)

type PolicyUpdateComponentInput = {
  updatable: boolean
  creatable: boolean
  deletable: boolean
}

const PolicyUpdateComponent: React.FC<PolicyUpdateComponentInput> = ({ updatable, creatable, deletable }) => {
  const params = useParams()
  const [isFormDirty, setIsFormDirty] = React.useState<boolean>(false)
  const [isBusy, setIsBusy] = React.useState<boolean>(true)
  const [tabState, setTabState] = React.useState(UPDATE_TABS.SETTINGS)
  const [payload, setPayload] = React.useState<any>(false)
  const tabParm = useQueryParams().get(QUERY_STRING_PARM.TAB)
  const [canValidate, setCanValidate] = React.useState<boolean>(false)

  const { t } = useTranslation()
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const confirmation = useConfirmation()
  const formValidation = useFormValidation()
  const { setRef, isDirty } = useReference()
  usePageTitle(t('profiles:policy.detail.user'))

  // define mutation for policy delete
  const [deletePolicy, { data: dataDelete, loading: loadingDelete, error: errorDelete }] = useStatefulAsyncMutation(
    mutateDeletePolicy,
    {},
  )

  // defined mutation for policy update
  const [updatePolicy, { data: dataUpdate, loading: loadingUpdate, error: errorUpdate }] = useStatefulAsyncMutation(
    mutateUpdatePolicy,
    {},
  )

  // query policy
  const { data: dataPolicy, loading: loadingPolicy, error: errorPolicy } = useStatefulAsyncQuery(queryPolicy, {
    variables: { id: params.id },
  })

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

  // query authorized software - only perform when enableExceptions is set
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
    // console.log('policy: ', { dataPolicy, loadingPolicy, errorPolicy })
    if (loadingPolicy === false && errorPolicy) {
      snackbar.enqueueMessage(t(getI18Name('policyLoadErrorMesage')), ENQUEUE_TYPE.ERROR)
    } else if (loadingPolicy === false && !errorPolicy) {
      dataPolicy && setPayload(JSON.parse(JSON.stringify(dataPolicy)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataPolicy, loadingPolicy, errorPolicy])

  useEffect(() => {
    // console.log('apps: ', { dataApps, loadingApps, errorApps })
    if (loadingApps === false && errorApps) {
      snackbar.enqueueMessage(t(getI18Name('appsLoadErrorMesage')), ENQUEUE_TYPE.ERROR)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataApps, loadingApps, errorApps])

  useEffect(() => {
    // console.log('Templates: ', { dataTemplates, loadingTemplates, errorTemplates })
    if (loadingTemplates === false && errorTemplates) {
      snackbar.enqueueMessage(t(getI18Name('swTemplateLoadErrorMesage')), ENQUEUE_TYPE.ERROR)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTemplates, loadingTemplates, errorTemplates])

  useEffect(() => {
    // console.log('authenticators: ', { dataAuthenticators, loadingAuthenticators, errorAuthenticators })
    if (loadingAuthenticators === false && errorAuthenticators) {
      snackbar.enqueueMessage(t(getI18Name('authenticatorsLoadErrorMesage')), ENQUEUE_TYPE.ERROR)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataAuthenticators, loadingAuthenticators, errorAuthenticators])

  useEffect(() => {
    // console.log('delete: ', { dataDelete, loadingDelete, errorDelete })
    if (dataDelete && loadingDelete === false && !errorDelete) {
      navigate(-1)
      snackbar.enqueueMessage(t(getI18Name('policyDeletedMessage')), ENQUEUE_TYPE.SUCCESS)
    } else if (loadingDelete === false && errorDelete) {
      snackbar.enqueueMessage(t(getI18Name('policyDeleteErrorMessage')), ENQUEUE_TYPE.ERROR)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDelete, loadingDelete, errorDelete])

  useEffect(() => {
    if (dataUpdate && loadingUpdate === false && !errorUpdate) {
      navigate(-1)
      snackbar.enqueueMessage(t(getI18Name('policyUpdatedMessage')), ENQUEUE_TYPE.SUCCESS)
    } else if (loadingUpdate === false && errorUpdate) {
      setTimeout(() => {
        formValidation.processServerError(errorUpdate, SERVER_POLICY_OPERATION.UPDATE)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUpdate, loadingUpdate, errorUpdate])

  useEffect(() => {
    setIsBusy(loadingAuthenticators || loadingTemplates || loadingApps || loadingPolicy || loadingUpdate || loadingDelete)
  }, [loadingApps, loadingTemplates, loadingAuthenticators, loadingPolicy, loadingUpdate, loadingDelete])

  useEffect(() => {
    if (tabParm) {
      setTabState(tabParm as UPDATE_TABS)
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
  const classes = useStyles()

  if (isBusy) {
    return <Busy updating={loadingUpdate} deleting={loadingDelete} />
  }

  const getAction = () => {
    return (
      <Tooltip title={t(getI18Name('updateFormDeletePolicyTooltip'))}>
        <IconButton
          size="small"
          disabled={isBusy}
          onClick={async () => {
            const confirmationState = await confirmation({
              title: t('policy.deletePolicyConfirmationDialog.title'),
              description: t('policy.deletePolicyConfirmationDialog.description', {
                name: dataPolicy?.name,
              }),
              content: t('policy.deletePolicyConfirmationDialog.deleteNote'),
              cancelButtonLabel: t('policy.deletePolicyConfirmationDialog.cancelButton'),
              confirmButtonLabel: t('policy.deletePolicyConfirmationDialog.confirmButton'),
            })

            if (confirmationState === ConfirmationState.Confirmed) {
              deletePolicy({ id: params.id })
            }
          }}
        >
          <BasicDelete />
        </IconButton>
      </Tooltip>
    )
  }

  return (
    <Box width="100%" p={2}>
      <PageTitlePanel
        goBack={onLeavePage}
        title={[t(getI18Name('updatePolicyPageTitle')), dataPolicy?.name]}
        subtitle={t(getI18Name('updatePolicyPageTitleHelperText'), {
          date: new Date(dataPolicy?.last_modified),
          user: 'unknown',
        })}
        actions={deletable && getAction()}
        helpId={HelpLinks.AuthenticationPolicy}
      />
      <TabContext value={tabState}>
        <TabList>
          <Tab
            label={t(getI18Name('update.tab.settingsLabel'))}
            value={UPDATE_TABS.SETTINGS}
            onClick={() => setTabState(UPDATE_TABS.SETTINGS)}
          />
          <Tab
            label={t(getI18Name('update.tab.usersAndGroupsLabel'))}
            value={UPDATE_TABS.USERS_AND_GROUPS}
            onClick={() => setTabState(UPDATE_TABS.USERS_AND_GROUPS)}
          />
        </TabList>
        <TabPanel value={UPDATE_TABS.SETTINGS}>
          <Formik
            initialValues={payload}
            validate={values => formValidation.validate(values, errorUpdate, payload)}
            innerRef={el => setRef(FORM_REFS.FORMIK_BAG, el)}
            onSubmit={(values: Policy) => {
              setCanValidate(true)
              setPayload(values)
              filterPolicyForUpdate(values)
              updatePolicy({ id: params.id, policy: values })
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
                writable={updatable}
                creatable={creatable}
                dataAuthenticators={dataAuthenticators}
                dataTemplates={dataTemplates}
                dataApps={dataApps}
                originalPayload={payload}
                isUpdate
                canValidate={canValidate}
                setCanValidate={setCanValidate}
              />
            )}
          </Formik>
        </TabPanel>
        <TabPanel value={UPDATE_TABS.USERS_AND_GROUPS} className={classes.assignmentsTabPanel}>
          <ProfileAssignments profileId={params.id} />
        </TabPanel>
      </TabContext>
    </Box>
  )
}

export default function PolicyUpdate() {
  useSecuredContent(Permission.ECS_IDENTITY_READ)
  const { hasPermission } = usePermissions()
  return (
    <FormProvider>
      <PolicyUpdateComponent
        updatable={hasPermission(Permission.ECS_IDENTITY_UPDATE)}
        creatable={hasPermission(Permission.ECS_IDENTITY_CREATE)}
        deletable={hasPermission(Permission.ECS_IDENTITY_DELETE)}
      />
    </FormProvider>
  )
}
