/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { FC } from 'react'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { ChipSelect, useChipSelect } from './widgets/ChipSelect'
import { MenuListItem } from './widgets/MenuListItem'

const groupByHours = {
  1: 'byHour',
  3: 'by3Hours',
  6: 'by6Hours',
  12: 'by12Hours',
  24: 'byDay',
  168: 'byWeek',
  720: 'byMonth',
}

type GroupBySelectProps = {
  groupBy: string
  setGroupBy: (string) => void
  testid?: string
}

export const GroupBySelect: FC<GroupBySelectProps> = memo(props => {
  const { t } = useTranslation(['dashboard'])
  const { testid, groupBy, setGroupBy } = props
  const chipSelectProps = useChipSelect()

  const handleSelection = newValue => {
    setGroupBy(newValue)
    chipSelectProps.setOpen(false)
  }

  const renderMenuItems = () => {
    const items = []
    for (const id in groupByHours) {
      items.push(
        <MenuListItem
          key={id}
          value={id}
          data-testid={testid + '_' + id}
          onClick={() => handleSelection(id)}
          selected={id === groupBy}
        >
          {t(groupByHours[id])}
        </MenuListItem>,
      )
    }
    return items
  }

  return (
    <ChipSelect label={t(groupByHours[groupBy])} {...chipSelectProps}>
      {renderMenuItems()}
    </ChipSelect>
  )
})
