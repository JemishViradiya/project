import { ConfirmationState } from '@ues/behaviours'

const cancelNavigation = async (isChanged, confirmation, navigate, t, policyType) => {
  if (isChanged) {
    const confirmationState = await confirmation({
      title: t('policy.modifiedPolicyConfirmationDialogTitle'),
      description: t('policy.modifiedPolicyConfirmationDialogDesc'),
      cancelButtonLabel: t('policy.buttons.cancel'),
      confirmButtonLabel: t('policy.buttons.leavePage'),
    })
    if (confirmationState === ConfirmationState.Confirmed) {
      navigate(`/policies/${policyType}`)
    }
  } else {
    navigate(`/policies/${policyType}`)
  }
}

export default cancelNavigation
