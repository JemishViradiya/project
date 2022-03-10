import type { Location } from 'history'
import React, { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import makeStyles from '@material-ui/core/styles/makeStyles'

import type { CreateDetectionPolicyMutationResult } from '@ues-data/bis'
import { CreateDetectionPolicyMutation, useBISPolicySchema } from '@ues-data/bis'
import { FeatureName, Permission, useFeatures, usePermissions, useStatefulApolloMutation } from '@ues-data/shared'
import { HelpLinks } from '@ues/assets'
import {
  ConfirmationState,
  PageTitlePanel,
  useConfirmation,
  useFeatureCheck,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

import type { PolicyFormOnSubmitCallback } from '../../components/policy-form'
import { PolicyForm } from '../../components/policy-form'
import { PolicyFormContext, PolicyFormContextProvider } from '../../contexts/policy-form-context'
import { ViewContextProvider } from '../../contexts/view-context'
import { useDefaultPolicyFormValues } from '../../hooks/use-default-policy-form-values'
import { useGoToPoliciesListCallback } from '../../hooks/use-go-to-policies-list-callback'
import { useGoToPolicyCallback } from '../../hooks/use-go-to-policy-callback'
import { useUnsavedChangesConfirmationDialog } from '../../hooks/use-unsaved-changes-confirmation-dialog'
import type { PolicyCreatorLocationState } from '../../model'
import { PolicyFormMode } from '../../model'
import { policyFormValuesToMutationInput } from '../../utils'

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    flexDirection: 'column',
    display: 'flex',
  },
  content: {
    padding: theme.spacing(4),
  },
}))

const CreatePolicyView: React.FC = () => {
  useSecuredContent(Permission.BIS_RISKPROFILE_CREATE)
  const { isMigratedToDP } = useBISPolicySchema()
  useFeatureCheck(isEnabled => isEnabled(FeatureName.UESActionOrchestrator) && isMigratedToDP)
  const { t } = useTranslation(['bis/ues', 'bis/shared'])
  const classNames = useStyles()
  const confirmation = useConfirmation()
  const { enqueueMessage } = useSnackbar()
  const { hasChanges } = useContext(PolicyFormContext)
  const readOnly = false
  const location: Location<PolicyCreatorLocationState> = useLocation()
  const { hasPermission } = usePermissions()
  const userUpdatable = hasPermission(Permission.ECS_USERS_UPDATE)
  const features = useFeatures()
  const arrEnabled = features.isEnabled(FeatureName.ARR)
  const defaultPolicyFormValues = useDefaultPolicyFormValues()

  const isCopyMode = Boolean(location.state?.copiedValues)

  const goToPoliciesList = useGoToPoliciesListCallback()
  const goToPolicy = useGoToPolicyCallback()
  const exitPage = useUnsavedChangesConfirmationDialog(hasChanges, goToPoliciesList)

  const onCreationCompleted = useCallback(
    async ({ createDetectionPolicy: { id } }: CreateDetectionPolicyMutationResult) => {
      let confirmationState = ConfirmationState.Canceled
      if (userUpdatable) {
        confirmationState = await confirmation({
          title: t('bis/ues:detectionPolicies.create.policyConfirmationTitle'),
          description: t('bis/ues:detectionPolicies.create.policyConfirmationDescription'),
          cancelButtonLabel: t('bis/ues:detectionPolicies.create.successReject'),
          confirmButtonLabel: t('bis/ues:detectionPolicies.create.successAccept'),
        })
      }

      if (confirmationState === ConfirmationState.Confirmed) {
        goToPolicy(id, 'applied')
      }

      if (confirmationState === ConfirmationState.Canceled) {
        enqueueMessage(t('bis/ues:detectionPolicies.snackbars.successfulCreation'), 'success')
        goToPoliciesList()
      }
    },
    [enqueueMessage, goToPoliciesList, goToPolicy, confirmation, t, userUpdatable],
  )

  const onCreationError = useCallback(
    error => {
      enqueueMessage(
        t(
          error.graphQLErrors[0]?.extensions?.code === 'DUPLICATE_NAME_ERROR'
            ? 'bis/shared:policies.details.errorServerNameAlreadyExists'
            : 'bis/shared:policies.create.error',
        ),
        'error',
      )
    },
    [t, enqueueMessage],
  )

  const [createPolicy, { loading }] = useStatefulApolloMutation(CreateDetectionPolicyMutation, {
    onCompleted: onCreationCompleted,
    onError: onCreationError,
  })

  const onSubmit = useCallback<PolicyFormOnSubmitCallback>(
    formValues => {
      if (!readOnly) {
        createPolicy({
          variables: {
            input: policyFormValuesToMutationInput(formValues, arrEnabled),
          },
        })
      }
    },
    [readOnly, createPolicy, arrEnabled],
  )

  const defaultValues = useMemo(
    () =>
      location.state?.copiedValues
        ? {
            ...location.state.copiedValues,
            // Name has to be unique so always leave it blank to force user to define a new one
            name: defaultPolicyFormValues.name,
          }
        : defaultPolicyFormValues,
    [defaultPolicyFormValues, location.state?.copiedValues],
  )

  return (
    <ViewContextProvider>
      <div className={classNames.container}>
        <PageTitlePanel
          goBack={exitPage}
          helpId={HelpLinks.PoliciesRiskDetection}
          title={t(isCopyMode ? 'bis/ues:detectionPolicies.create.copyTitle' : 'bis/ues:detectionPolicies.create.title')}
        />

        <div className={classNames.content}>
          <PolicyForm
            defaultValues={defaultValues}
            onCancel={exitPage}
            onSubmit={onSubmit}
            readOnly={readOnly}
            loading={loading}
            mode={isCopyMode ? PolicyFormMode.Copy : PolicyFormMode.Add}
          />
        </div>
      </div>
    </ViewContextProvider>
  )
}

const CreatePolicy: React.FC = () => (
  <PolicyFormContextProvider>
    <CreatePolicyView />
  </PolicyFormContextProvider>
)

export default CreatePolicy
