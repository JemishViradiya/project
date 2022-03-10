import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MenuItem } from '@material-ui/core'

import type { PolicyRules } from '@ues-data/dlp'
import { Select } from '@ues/behaviours'

import { usePoliciesPermissions } from '../usePoliciesPermission'

interface SelectProps {
  defaultValue?: string
  onChange: (rule: any) => void
  policyRule: PolicyRules
}

const ActionSelect: React.FC<SelectProps> = ({ onChange, policyRule }) => {
  const [value, setValue] = useState('')
  const { t } = useTranslation('dlp/policy')
  const { activity: label, action: actionValue, osType: actionOsType } = policyRule
  const { canUpdate } = usePoliciesPermissions()

  useEffect(() => setValue(actionValue), [actionValue])

  const handleActionSelect = e => {
    const action = {
      activity: e.target.name,
      action: e.target.value,
      osType: actionOsType,
    }
    setValue(e.target.value)
    onChange(action)
  }

  return (
    <Select
      label={t(`policy.sections.actions.policyRules.${label}`)}
      name={label}
      size="small"
      variant="filled"
      onChange={handleActionSelect}
      value={value}
      disabled={!canUpdate}
    >
      <MenuItem aria-label="action-type-alert" value="ACTION_TYPE_ALERT">
        {t(`policy.sections.actions.policyRules.ACTION_TYPE_ALERT`)}
      </MenuItem>
      <MenuItem aria-label="action-type-none" value="ACTION_TYPE_NONE">
        {t('policy.sections.actions.policyRules.ACTION_TYPE_NONE')}
      </MenuItem>
    </Select>
  )
}

export default ActionSelect
