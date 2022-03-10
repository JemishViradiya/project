/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'

import { MenuItem } from '@material-ui/core'

import { Select } from '@ues/behaviours'

import { getI18EnumName, getI18LabelName, useTranslation } from './i18n'

export default function PolicyRadio({ name, value, disabled, handleChange, radioEnum, errors }) {
  const { t } = useTranslation()
  return (
    <Select
      displayEmpty={false}
      onChange={handleChange}
      value={value ?? ''}
      label={t(getI18LabelName(name))}
      disabled={disabled}
      error={errors[name]}
      name={name}
      id={name}
      size="small"
      variant="filled"
      title={t(getI18LabelName(name))}
    >
      {Object.keys(radioEnum).map(key => {
        return (
          <MenuItem value={key} key={name.concat('.').concat(key)}>
            {t(getI18EnumName(name, key))}
          </MenuItem>
        )
      })}
    </Select>
  )
}
