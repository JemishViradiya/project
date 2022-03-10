import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { POLICY_TYPE } from '@ues-data/dlp'
import { ConfirmationState, useConfirmation } from '@ues/behaviours'

import { PolicyInfoTabIdParam } from '../common/types/routing'

const POLICY_CREATE_CONFIRMATION_TITLE_LOCALIZATION_KEY = {
  [POLICY_TYPE.CONTENT.toLowerCase()]: 'policy.createContentPolicyConfirmationTitle',
  [POLICY_TYPE.MOBILE.toLowerCase()]: 'policy.createMobilePolicyConfirmationTitle',
}

export const usePolicyConfirmationDialog = (isAddMode: boolean, policyType: string, task?: any) => {
  const { t } = useTranslation('dlp/policy')
  const navigate = useNavigate()
  const confirmation = useConfirmation()
  const showConfirmationDialog = async () => {
    const confirmationState = await confirmation({
      title: isAddMode
        ? t(POLICY_CREATE_CONFIRMATION_TITLE_LOCALIZATION_KEY[policyType])
        : t('policy.updatePolicyConfirmationTitle'),
      description: isAddMode ? t('policy.createPolicyConfirmationDescription') : t('policy.updatePolicyConfirmationDescription'),
      cancelButtonLabel: isAddMode ? t('policy.buttons.rejectConfirm') : t('policy.buttons.cancelResendMail'),
      confirmButtonLabel: isAddMode ? t('policy.buttons.confirm') : t('policy.buttons.resendMail'),
    })
    if (isAddMode && confirmationState === ConfirmationState.Confirmed) {
      navigate(`../update/${task?.data?.policyId}?tabId=${PolicyInfoTabIdParam.UsersAndGroups}`)
    } else if (isAddMode && confirmationState === ConfirmationState.Canceled) {
      navigate(`../../policies/${policyType}`)
    } else {
      navigate(`../../../policies/${policyType}`)
    }
  }

  return {
    showConfirmationDialog,
  }
}
