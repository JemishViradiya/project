import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ActionChipProps } from '@ues-bis/shared'
import { ActionChip } from '@ues-bis/shared'
import { ActionError, ActionType } from '@ues-data/bis/model'

type ActionAttributes = { entityId: string }

interface NetworkAccessOption {
  label: string
  value: string
}

interface ActionProps extends ActionChipProps {
  actionType: ActionType
  actionAttributes: ActionAttributes
  actionError: ActionError
  networkAccessOptions: NetworkAccessOption[]
}

const Action = memo(({ actionType, actionAttributes, actionError, networkAccessOptions, ...restProps }: ActionProps) => {
  const { t } = useTranslation('bis/ues')
  let label
  let icon
  let errorText
  if (actionError === ActionError.NetworkAccessPolicyDoesntExist) {
    errorText = t('actions.selected.networkAccessPolicy.errorChip')
  }
  if (actionType === ActionType.OverrideNetworkAccessControlPolicy) {
    const relatedPolicy = networkAccessOptions?.find(option => option.value === actionAttributes.entityId)
    if (relatedPolicy) {
      label = t('actions.selected.networkAccessPolicy.chip', { name: relatedPolicy.label })
    } else {
      label = t('actions.selected.networkAccessPolicy.chipPolicyMissing')
    }
  }
  if (!label) {
    return null // any other action is not supported
  }

  return <ActionChip label={label} icon={icon} error={errorText} {...restProps} />
})

export default Action
