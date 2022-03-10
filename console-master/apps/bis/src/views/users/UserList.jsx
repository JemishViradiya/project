import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'

import { useStatefulApolloMutation, useStatefulApolloQuery } from '@ues-data/shared'

import useHeaderState from '../../list/useHeaderState'
import useResetScroll from '../../list/useResetScroll'
import { getUserListColumns, updateUserListColumnsMutation } from '../../localState/UserListColumns'
import { useUserListContext } from '../../providers/UserListProvider'
import { InfiniteList } from '../../shared'
import useUserHeadersSequence from './hooks/useUserHeadersSequence'

export const UserList = memo(props => {
  const { reset, total, data, variables: { sortBy, sortDirection } = {}, loadMoreRows } = useUserListContext()
  const headers = useUserHeadersSequence()

  const { t } = useTranslation()
  const listRef = useResetScroll(reset)
  const theme = useTheme()

  const {
    data: { userListColumns },
  } = useStatefulApolloQuery(getUserListColumns)
  const [updateUserListColumns] = useStatefulApolloMutation(updateUserListColumnsMutation)

  const { state, onMenuAllSelection, onMenuCheckbox, onMenuReset, saveHeaderVisibility } = useHeaderState(
    headers,
    userListColumns,
    updateUserListColumns,
  )

  if (!data) {
    return null
  }

  return (
    <InfiniteList
      {...props}
      t={t}
      minimumBatchSize={50}
      sortBy={sortBy}
      sortDirection={sortDirection}
      onLoadMoreRows={loadMoreRows}
      data={data}
      total={total}
      headers={state.headers}
      ref={listRef}
      onMenuAllSelection={onMenuAllSelection}
      onMenuReset={onMenuReset}
      onMenuCheckbox={onMenuCheckbox}
      saveHeaders={saveHeaderVisibility}
      theme={theme}
    />
  )
})

UserList.propTypes = {
  onSort: PropTypes.func.isRequired,
  onSelected: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  selectedAll: PropTypes.bool.isRequired,
  onRowClick: PropTypes.func,
  selectionState: PropTypes.object.isRequired,
}

export default UserList
