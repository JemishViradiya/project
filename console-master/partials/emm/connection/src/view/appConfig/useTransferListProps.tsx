import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Group } from '@ues-data/emm'

export const useTransferListProps = ({ setAssignedGroups, groupList, assignedList, groupsError, handleError }) => {
  const { t } = useTranslation(['emm/connection'])
  const listLabel = ''
  const rightLabel = t('emm.appConfig.groupRightList')
  const leftLabel = t('emm.appConfig.groupLeftList')
  const [allValues, setAllValues] = useState([])
  const [rightValues, setRightValues] = useState([])

  const resetValues = useCallback(() => {
    const leftValues = groupList?.map((group: Group) => group.displayName)
    setAllValues(leftValues)
    setRightValues(assignedList)
  }, [groupList, assignedList])

  useEffect(() => {
    resetValues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupList, assignedList])

  useEffect(() => {
    if (groupsError) handleError()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupsError])

  const handleChange = (left, right) => {
    setAssignedGroups(right)
  }

  const alphaAscendingSort = (item1: string, item2: string) => {
    if (item1 > item2) {
      return 1
    }
    if (item2 > item1) {
      return -1
    }
    return 0
  }

  return {
    disabled: false,
    allValues,
    rightValues,
    allowLeftEmpty: true,
    allowRightEmpty: true,
    listLabel,
    rightLabel,
    leftLabel,
    onChange: handleChange,
    sortFunction: alphaAscendingSort,
  }
}
