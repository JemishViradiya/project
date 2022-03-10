import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'

import { useStatefulApolloMutation, useStatefulApolloQuery } from '@ues-data/shared'

import useHeaderState from '../../list/useHeaderState'
import useResetScroll from '../../list/useResetScroll'
import { getEventListColumns, updateEventListColumnsMutation } from '../../localState/EventListColumns'
import { useEventListContext } from '../../providers/EventListProvider'
import { InfiniteList } from '../../shared'
import useEventHeadersSequence from './hooks/useEventHeadersSequence'

const EventList = memo(props => {
  const { reset, total, data, variables: { sortBy, sortDirection } = {}, loadMoreRows } = useEventListContext()
  const headers = useEventHeadersSequence()

  const { t } = useTranslation()
  const listRef = useResetScroll(reset)
  const theme = useTheme()

  const { data: { eventListColumns } = {} } = useStatefulApolloQuery(getEventListColumns)
  const [updateEventListColumns] = useStatefulApolloMutation(updateEventListColumnsMutation)

  const { state, onMenuAllSelection, onMenuCheckbox, onMenuReset, saveHeaderVisibility } = useHeaderState(
    headers,
    eventListColumns,
    updateEventListColumns,
  )

  if (!data) {
    return null
  }

  return (
    <InfiniteList
      t={t}
      {...props}
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

EventList.propTypes = {
  onSort: PropTypes.func.isRequired,
  selectionState: PropTypes.object,
  onSelected: PropTypes.func,
  onSelectAll: PropTypes.func,
  selectedAll: PropTypes.bool,
  onRowClick: PropTypes.func,
  noCounter: PropTypes.bool,
  className: PropTypes.string,
}

export default EventList
