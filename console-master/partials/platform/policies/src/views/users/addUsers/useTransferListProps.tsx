import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const useTransferListProps = ({
  setAssignedGroups,
  selectedUser,
  dataGroups,
  resetGroup,
  loadGroupsError,
  handleError,
  newUser,
}) => {
  const { t } = useTranslation(['platform/common'])
  const listLabel = t('users.add.groups.subHeading')
  const rightLabel = t('users.add.groups.selectedGroups')
  const leftLabel = t('users.add.groups.available')
  const [allValues, setAllValues] = useState([])
  const [rightVallues, setRightVallues] = useState([])

  const resetValues = useCallback(() => {
    setAllValues(dataGroups?.map(({ name }) => name))
    setRightVallues([])
  }, [dataGroups])
  useEffect(() => {
    resetValues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser, dataGroups, newUser, resetGroup])

  useEffect(() => {
    if (loadGroupsError) handleError()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadGroupsError])

  const handleChange = (left, right) => {
    setAssignedGroups(dataGroups?.filter(({ name }) => right.includes(name)))
  }

  return {
    allValues,
    rightVallues,
    disabled: false,
    allowLeftEmpty: true,
    allowRightEmpty: true,
    listLabel,
    rightLabel,
    leftLabel,
    onChange: handleChange,
    sortFunction: () => ({}),
  }
}
