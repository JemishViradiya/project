import PropTypes from 'prop-types'
import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'

import { useStatefulApolloMutation, useStatefulApolloQuery } from '@ues-data/shared'

import GeozoneIcon from '../../components/icons/GeozoneIcon'
import useHeaderState from '../../list/useHeaderState'
import useResetScroll from '../../list/useResetScroll'
import { getGeozoneListColumns, updateGeozoneListColumnsMutation } from '../../localState/GeozoneListColumns'
import { useGeozoneListContext } from '../../providers/GeozoneListProvider'
import { InfiniteList, throwServerError } from '../../shared'
import styles from './GeozoneList.module.less'

const GEOZONE_SECTION = 'geozones.geozone'

const headers = [
  t => ({
    section: GEOZONE_SECTION,
    columnName: 'common.riskLevel',
    dataKey: 'risk',
    cellDataGetter: zone => zone,
    cellRenderer: ({ data }) => (
      <div className={styles.riskLevel}>
        <GeozoneIcon level={data.risk} />
        <span className={styles.riskLevelLabel}>{t(`risk.level.${data.risk}`)}</span>
      </div>
    ),
    width: 95,
    visible: true,
    defaultVisible: true,
    disabled: true,
  }),
  t => ({
    section: GEOZONE_SECTION,
    columnName: 'geozones.geozoneName',
    dataKey: 'name',
    dataFormatter: data => data,
    width: 180,
    visible: true,
    defaultVisible: true,
  }),
  t => ({
    section: GEOZONE_SECTION,
    columnName: 'common.location',
    dataKey: 'location',
    disableSort: true,
    dataFormatter: data => data,
    width: 180,
    visible: true,
    defaultVisible: true,
  }),
  /* // Removed for 2.0. Future consideration in SIS-2227
  t => ({
    columnName: t('Country'),
    dataKey: 'country',
    dataFormatter: data => data,
    width: 120,
    visible: false,
    defaultVisible: false,
  }),
  t => ({
    columnName: t('Size'),
    dataKey: 'size',
    dataFormatter: data => data,
    width: 60,
    visible: false,
    defaultVisible: false,
  }),
  t => ({
    columnName: t('Distance'),
    dataKey: 'distance',
    dataFormatter: data => data,
    width: 60,
    visible: false,
    defaultVisible: false,
  }), */
]

const GeozoneList = memo(props => {
  const { reset, total, data, error } = useGeozoneListContext()

  const { t } = useTranslation()
  const listRef = useResetScroll(reset)
  const theme = useTheme()

  const {
    data: { geozoneListColumns },
  } = useStatefulApolloQuery(getGeozoneListColumns)
  const [updateEventListColumns] = useStatefulApolloMutation(updateGeozoneListColumnsMutation)

  const { state, onMenuAllSelection, onMenuCheckbox, onMenuReset, saveHeaderVisibility } = useHeaderState(
    headers,
    geozoneListColumns,
    updateEventListColumns,
  )

  const { onRowSelected, onHighlightChanged, ...rest } = props

  const onRowClick = useCallback(
    ({ rowData }) => {
      onRowSelected(rowData.id)
    },
    [onRowSelected],
  )

  const onRowMouseOver = useCallback(
    ({ index }) => {
      if (data[index]) {
        onHighlightChanged(data[index].id)
      }
    },
    [data, onHighlightChanged],
  )

  if (error) {
    throwServerError(error)
  }
  if (!data) {
    return null
  }

  return (
    <InfiniteList
      {...rest}
      t={t}
      onRowClick={onRowClick}
      onRowMouseOver={onRowMouseOver}
      onRowMouseOut={onRowMouseOver}
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

GeozoneList.propTypes = {
  onSort: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  onLoadMoreRows: PropTypes.func.isRequired,
  highlightId: PropTypes.string,
  onRowSelected: PropTypes.func.isRequired,
  singleSelectId: PropTypes.string,
  selectionState: PropTypes.object.isRequired,
  onSelected: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  selectedAll: PropTypes.bool.isRequired,
}

export default GeozoneList
