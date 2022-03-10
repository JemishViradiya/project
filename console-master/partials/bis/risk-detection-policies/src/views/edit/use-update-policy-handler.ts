import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { UpdateDetectionPolicyMutation } from '@ues-data/bis'
import { FeatureName, useFeatures, useStatefulApolloMutation } from '@ues-data/shared'
import { useSnackbar } from '@ues/behaviours'

import { useGoToPoliciesListCallback } from '../../hooks/use-go-to-policies-list-callback'
import type { PolicyFormValues } from '../../model'
import { policyFormValuesToMutationInput } from '../../utils'

export const useUpdatePolicyHandler = (isDefault: boolean) => {
  const { enqueueMessage } = useSnackbar()
  const { t } = useTranslation(['bis/ues', 'bis/shared'])
  const goToPoliciesList = useGoToPoliciesListCallback()
  const features = useFeatures()
  const arrEnabled = features.isEnabled(FeatureName.ARR)

  const onCompleted = useCallback(() => {
    enqueueMessage(t('bis/ues:detectionPolicies.snackbars.successfulUpdate'), 'success')
    goToPoliciesList()
  }, [t, enqueueMessage, goToPoliciesList])

  const onError = useCallback(
    error => {
      enqueueMessage(
        t(
          error.graphQLErrors[0]?.extensions?.code === 'DUPLICATE_NAME_ERROR'
            ? 'bis/shared:policies.details.errorServerNameAlreadyExists'
            : 'bis/shared:policies.details.errorSave',
        ),
        'error',
      )
    },
    [t, enqueueMessage],
  )

  const [updatePolicy, { loading: pending }] = useStatefulApolloMutation(UpdateDetectionPolicyMutation, {
    onCompleted,
    onError,
  })
  const updatePolicyHandler = useCallback(
    async (policyId: string, formValues: PolicyFormValues) => {
      const input = policyFormValuesToMutationInput(formValues, arrEnabled, isDefault)
      await updatePolicy({
        variables: {
          id: policyId,
          input,
        },
      })
    },
    [arrEnabled, isDefault, updatePolicy],
  )

  return { updatePolicyHandler, pending }
}
