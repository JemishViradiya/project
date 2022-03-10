import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'

import { useStatefulApolloMutation, useStatefulApolloQuery } from '@ues-data/shared'
import { BasicClose } from '@ues/assets'

import { getAppliedListColumns, updateAppliedListColumnsMutation } from '../../localState/AppliedListColumns'
import { Context as AppliedProviderContext } from '../../providers/AppliedListProvider'
import { DirectoryGroup, DirectoryUserName, IconButton, InfiniteList } from '../../shared'
import styles from './AppliedList.module.less'

const ROW_STYLES = { paddingRight: '40px' }

const RemoveRowIcon = memo(({ t, onClick, id, name }) => {
  const handleClick = useCallback(() => onClick(id, name), [onClick, id, name])
  const title = t('common.deleteItem')

  return (
    <IconButton size="small" className={styles.removeRowIcon} title={title} aria-label={title} onClick={handleClick}>
      <BasicClose />
    </IconButton>
  )
})

const NameItem = memo(({ onDeleteRow, t, data: { id, __typename: type, info, name }, editable }) => (
  <>
    {type === 'BIS_DirectoryGroup' ? <DirectoryGroup {...info} /> : <DirectoryUserName {...info} />}
    {editable && <RemoveRowIcon t={t} onClick={onDeleteRow} id={id} name={name} />}
  </>
))

const initHeaders = (t, onDeleteRow, editable) => ({
  displayName: {
    section: 'policies.details.appliedList',
    columnName: 'common.name',
    dataKey: 'displayName',
    width: 180,
    visible: true,
    defaultVisible: true,
    disabled: true,
    disableSort: true,
    cellDataGetter: data => data,
    cellRenderer: ({ data }) => <NameItem data={data} onDeleteRow={onDeleteRow} t={t} editable={editable} />,
  },
  primaryEmail: {
    section: 'policies.details.appliedList',
    columnName: 'common.email',
    dataKey: 'primaryEmail',
    width: 200,
    visible: true,
    defaultVisible: true,
    disableSort: true,
    cellDataGetter: data => data.info.primaryEmail,
  },
})

const loadHeaderVisibility = (headers, headerKeys) => {
  Object.keys(headers).forEach(key => {
    if (headerKeys.includes(key)) {
      headers[key].visible = true
    } else {
      // Disabled headers are always visible
      headers[key].visible = !!headers[key].disabled
    }
  })
}

const BoundList = memo(props => {
  const { data, total } = useContext(AppliedProviderContext)
  if (!data) {
    return null
  }
  return <InfiniteList data={data} total={total} {...props} />
})

const onSort = () => {}

const AppliedList = memo(
  ({ onLoadMoreRows, singleSelectId, selectionState, onSelected, onSelectAll, selectedAll, onDeleteRow, editable }) => {
    const { t } = useTranslation()
    const theme = useTheme()
    const headers = useRef()

    const { data: { appliedListColumns } = {} } = useStatefulApolloQuery(getAppliedListColumns, {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      partialRefetch: true,
    })
    const [updateAppliedListColumns] = useStatefulApolloMutation(updateAppliedListColumnsMutation)

    if (!headers.current) {
      headers.current = initHeaders(t, onDeleteRow, editable)
      if (appliedListColumns && appliedListColumns.columns) {
        loadHeaderVisibility(headers.current, appliedListColumns.columns)
      }
    }

    const saveHeaderVisibility = useCallback(() => {
      const headerKeys = []
      Object.keys(headers.current).forEach(key => {
        const header = headers.current[key]
        if (header.visible && !header.disabled) {
          headerKeys.push(key)
        }
      })
      updateAppliedListColumns({
        variables: {
          columns: headerKeys,
        },
      })
    }, [updateAppliedListColumns])

    const onMenuReset = useCallback(() => {
      const newHeaders = { ...headers.current }
      Object.keys(newHeaders).forEach(key => {
        newHeaders[key].visible = newHeaders[key].defaultVisible
      })
      headers.current = newHeaders
      saveHeaderVisibility()
    }, [saveHeaderVisibility])

    const onMenuCheckbox = useCallback(
      key => {
        const newHeaders = { ...headers.current }
        newHeaders[key].visible = !newHeaders[key].visible
        headers.current = newHeaders
        saveHeaderVisibility()
      },
      [saveHeaderVisibility],
    )

    const onMenuAllSelection = useCallback(
      select => {
        const newHeaders = { ...headers.current }
        Object.keys(newHeaders).forEach(key => {
          if (!newHeaders[key].disabled) {
            newHeaders[key].visible = select
          }
        })
        headers.current = newHeaders
        saveHeaderVisibility()
      },
      [saveHeaderVisibility],
    )

    return (
      <BoundList
        t={t}
        sortBy="info.displayName"
        sortDirection="ASC"
        onLoadMoreRows={onLoadMoreRows}
        highlightId={undefined}
        headers={headers.current}
        singleSelectId={singleSelectId}
        selectionState={selectionState}
        onSelected={onSelected}
        onSelectAll={onSelectAll}
        selectedAll={selectedAll}
        onSort={onSort}
        onMenuAllSelection={onMenuAllSelection}
        saveHeaders={saveHeaderVisibility}
        onMenuCheckbox={onMenuCheckbox}
        onMenuReset={onMenuReset}
        listMargin={0}
        noCounter
        rowStyle={ROW_STYLES}
        moreColumnsStyle={styles.moreColumnsCustom}
        moreColumnsOffsetLarge
        theme={theme}
      />
    )
  },
)

AppliedList.propTypes = {
  onLoadMoreRows: PropTypes.func.isRequired,
  singleSelectId: PropTypes.string,
  selectionState: PropTypes.object.isRequired,
  onSelected: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  selectedAll: PropTypes.bool.isRequired,
  onDeleteRow: PropTypes.func.isRequired,
  editable: PropTypes.bool,
}

AppliedList.defaultValue = {
  editable: true,
}

export default AppliedList
