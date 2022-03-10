/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { MenuItem } from '@material-ui/core'

import { GroupBy, QueryStringParamKeys } from '@ues-mtd/alert-types'
import { Select } from '@ues/behaviours'

interface GroupBySelectProps {
  groupBy: GroupBy
}

const GroupBySelect: React.FC<GroupBySelectProps> = ({ groupBy }) => {
  const { t } = useTranslation(['mtd/common'])
  const navigate = useNavigate()
  return (
    <Select
      displayEmpty={false}
      value={groupBy ?? GroupBy.none}
      size="small"
      variant="filled"
      onChange={event => navigate(`?${QueryStringParamKeys.GROUP_BY}=${event.target.value as GroupBy}`)}
      title={t('mobileAlert.groupByLabel')}
    >
      {Object.keys(GroupBy).map(key => {
        return (
          <MenuItem value={key} key={key}>
            {t(`mobileAlert.groupBy.${key}`)}
          </MenuItem>
        )
      })}
    </Select>
  )
}

export default GroupBySelect
