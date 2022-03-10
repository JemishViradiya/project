import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { UESPolicyListUpdateMutation } from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'
import { useSnackbar } from '@ues/behaviours'

import { TRANSLATION_NAMESPACES } from '../../config'
import { useGoToPoliciesListCallback } from '../../hooks/use-go-to-policies-list-callback'
import type { PolicyFormValues } from '../../model'
import { policyFormValuesToMutationInput } from '../../utils'

export const useUpdatePolicyHandler = () => {
  const { enqueueMessage } = useSnackbar()
  const { t } = useTranslation(TRANSLATION_NAMESPACES)
  const goToPoliciesList = useGoToPoliciesListCallback()

  const onCompleted = useCallback(() => {
    enqueueMessage(t('bis/ues:policies.snackbars.successfulUpdate'), 'success')
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

  const [updatePolicy, { loading: pending }] = useStatefulApolloMutation(UESPolicyListUpdateMutation, {
    onCompleted,
    onError,
  })

  const updatePolicyHandler = useCallback(
    async (policyId: string, formValues: PolicyFormValues) => {
      updatePolicy({
        variables: {
          id: policyId,
          input: policyFormValuesToMutationInput(formValues),
        },
      })
    },
    [updatePolicy],
  )

  return { updatePolicyHandler, pending }
}
