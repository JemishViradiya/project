import type { Location } from 'history'
import React, { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import makeStyles from '@material-ui/core/styles/makeStyles'

import { UESPolicyListAddMutation, useBISPolicySchema } from '@ues-data/bis'
import { Permission, ServiceId, usePermissions, useStatefulApolloMutation } from '@ues-data/shared'
import {
  ConfirmationState,
  PageTitlePanel,
  useConfirmation,
  useFeatureCheck,
  useSecuredContentWithService,
  useSnackbar,
} from '@ues/behaviours'

import type { PolicyFormOnSubmitCallback } from '../../components/policy-form'
import { PolicyForm, PolicyFormMode } from '../../components/policy-form'
import { DEFAULT_POLICY_FORM_VALUES, TRANSLATION_NAMESPACES } from '../../config'
import { PolicyFormContext, PolicyFormContextProvider } from '../../contexts/policy-form-context'
import { useAvailableActions } from '../../hooks/use-available-actions'
import { useGoToPoliciesListCallback } from '../../hooks/use-go-to-policies-list-callback'
import { useGoToPolicyCallback } from '../../hooks/use-go-to-policy-callback'
import { useUnsavedChangesConfirmationDialog } from '../../hooks/use-unsaved-changes-confirmation-dialog'
import type { PolicyCreatorLocationState } from '../../model'
import { PolicyFormField } from '../../model'
import { policyFormValuesToMutationInput } from '../../utils'

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    flexDirection: 'column',
    display: 'flex',
  },
  content: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}))

const CreatePolicyView: React.FC = () => {
  useSecuredContentWithService({ requiredPermissions: Permission.BIS_RISKPROFILE_CREATE, requiredServices: ServiceId.BIG })
  const { isMigratedToDP } = useBISPolicySchema()
  useFeatureCheck(() => !isMigratedToDP)
  const { t } = useTranslation(TRANSLATION_NAMESPACES)
  const classNames = useStyles()
  const confirmation = useConfirmation()
  const { enqueueMessage } = useSnackbar()
  const { hasChanges } = useContext(PolicyFormContext)
  const { hasCommonUnavailableActions } = useAvailableActions()
  const readOnly = hasCommonUnavailableActions
  const location: Location<PolicyCreatorLocationState> = useLocation()
  const { hasPermission } = usePermissions()
  const userUpdatable = hasPermission(Permission.ECS_USERS_UPDATE)

  const isCopyMode = Boolean(location.state?.copiedValues)

  const goToPoliciesList = useGoToPoliciesListCallback()
  const goToPolicy = useGoToPolicyCallback()
  const exitPage = useUnsavedChangesConfirmationDialog(hasChanges, goToPoliciesList)

  const onCreationCompleted = useCallback(
    async ({ createPolicy: { id } }) => {
      let confirmationState = ConfirmationState.Canceled
      if (userUpdatable) {
        confirmationState = await confirmation({
          title: t('policies.create.policyConfirmationTitle'),
          description: t('policies.create.policyConfirmationDescription'),
          cancelButtonLabel: t('policies.create.successReject'),
          confirmButtonLabel: t('policies.create.successAccept'),
        })
      }

      if (confirmationState === ConfirmationState.Confirmed) {
        goToPolicy(id, 'applied')
      }

      if (confirmationState === ConfirmationState.Canceled) {
        enqueueMessage(t('bis/ues:policies.snackbars.successfulCreation'), 'success')
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

  const [createPolicy, { loading }] = useStatefulApolloMutation(UESPolicyListAddMutation, {
    onCompleted: onCreationCompleted,
    onError: onCreationError,
  })

  const onSubmit = useCallback<PolicyFormOnSubmitCallback>(
    formValues => {
      if (!readOnly) {
        createPolicy({ variables: { input: policyFormValuesToMutationInput(formValues) } })
      }
    },
    [readOnly, createPolicy],
  )

  const defaultValues = useMemo(
    () =>
      location.state?.copiedValues
        ? {
            ...location.state.copiedValues,
            // Name has to be unique so always leave it blank to force user to define a new one
            [PolicyFormField.Name]: DEFAULT_POLICY_FORM_VALUES[PolicyFormField.Name],
          }
        : DEFAULT_POLICY_FORM_VALUES,
    [location.state?.copiedValues],
  )

  return (
    <div className={classNames.container}>
      <PageTitlePanel goBack={exitPage} title={t(isCopyMode ? 'policies.create.copyTitle' : 'policies.create.title')} />

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
  )
}

const CreatePolicy: React.FC = () => (
  <PolicyFormContextProvider>
    <CreatePolicyView />
  </PolicyFormContextProvider>
)

export default CreatePolicy
