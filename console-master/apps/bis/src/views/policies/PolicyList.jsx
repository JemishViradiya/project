import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useTheme } from '@material-ui/core/styles'

import { useStatefulApolloMutation, useStatefulApolloQuery } from '@ues-data/shared'

import useSelectionCount from '../../list/useSelectionCount'
import { getPolicyListColumns, updatePolicyListColumnsMutation } from '../../localState/PolicyListColumns'
import { Context as PolicyListContext } from '../../providers/PolicyListProvider'
import { InfiniteList, throwServerError } from '../../shared'
import styles from './PolicyList.module.less'

const POLICIES_SECTION = 'policies.section'

const PolicyLink = memo(({ id, name, toApplied, filter }) => {
  const subPath = toApplied ? '/applied' : ''
  const onTo = useMemo(
    () => ({
      pathname: `./${id}${subPath}`,
      search: filter ? `?${filter}` : '',
      state: { goBack: true },
    }),
    [filter, id, subPath],
  )
  return (
    <Link to={`${onTo.pathname}${onTo.search}`} state={onTo.state} className={styles.policyLink}>
      {name}
    </Link>
  )
})

const initHeaders = t => ({
  name: {
    section: POLICIES_SECTION,
    columnName: 'policies.columns.name',
    dataKey: 'name',
    width: 420,
    visible: true,
    defaultVisible: true,
    disabled: true,
    cellDataGetter: data => data,
    cellRenderer: ({ data: { name, id } }) => <PolicyLink id={id} name={name} />,
  },
  rank: {
    section: POLICIES_SECTION,
    columnName: 'policies.columns.rank',
    dataKey: 'rank',
    dataFormatter: data => data,
    width: 120,
    visible: true,
    defaultVisible: true,
  },
  appliedUsers: {
    section: POLICIES_SECTION,
    columnName: 'policies.columns.appliedUsers',
    dataKey: 'appliedUsers',
    width: 120,
    visible: true,
    defaultVisible: true,
    cellDataGetter: data => data,
    cellRenderer: ({ data: { appliedUsers: count, id } }) => <PolicyLink id={id} name={count} toApplied />,
  },
  appliedGroups: {
    section: POLICIES_SECTION,
    columnName: 'policies.columns.appliedGroups',
    dataKey: 'appliedGroups',
    width: 120,
    visible: true,
    defaultVisible: true,
    cellDataGetter: data => data,
    cellRenderer: ({ data: { appliedGroups: count, id } }) => <PolicyLink id={id} name={count} toApplied />,
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

export const PolicyList = memo(
  ({
    onSort,
    sortBy,
    sortDirection,
    onLoadMoreRows,
    onRowSelected,
    singleSelectId,
    selectionState,
    onSelected,
    onSelectAll,
    selectedAll,
    canEdit,
    selectedCount,
    deselectedCount,
    validateSelection,
  }) => {
    const { data: { policyListColumns } = {} } = useStatefulApolloQuery(getPolicyListColumns, {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      partialRefetch: true,
    })
    const [updatePolicyListColumns] = useStatefulApolloMutation(updatePolicyListColumnsMutation)
    const { t } = useTranslation()
    const theme = useTheme()
    const headers = useRef()
    const listRef = useRef()
    if (!headers.current) {
      headers.current = initHeaders(t)
      if (policyListColumns && policyListColumns.columns) {
        loadHeaderVisibility(headers.current, policyListColumns.columns)
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
      updatePolicyListColumns({
        variables: {
          columns: headerKeys,
        },
      })
    }, [updatePolicyListColumns])

    const onRowClick = useCallback(
      ({ rowData }) => {
        onRowSelected(rowData.id)
      },
      [onRowSelected],
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

    const { loading, total, data, error } = useContext(PolicyListContext)
    const count = useSelectionCount({ selectedAll, selectedCount, deselectedCount }, total)
    useEffect(() => {
      if (!loading && count > 0) {
        validateSelection(data)
      }
    }, [count, data, loading, validateSelection])
    if (error) {
      throwServerError(error)
    }
    if (!data) {
      return null
    }

    return (
      <InfiniteList
        t={t}
        onSort={onSort}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onLoadMoreRows={onLoadMoreRows}
        onRowClick={onRowClick}
        highlightId={undefined}
        data={data}
        total={total}
        headers={headers.current}
        ref={listRef}
        singleSelectId={singleSelectId}
        selectionState={selectionState}
        onSelected={onSelected}
        onSelectAll={onSelectAll}
        selectedAll={selectedAll}
        onMenuAllSelection={onMenuAllSelection}
        onMenuReset={onMenuReset}
        onMenuCheckbox={onMenuCheckbox}
        saveHeaders={saveHeaderVisibility}
        theme={theme}
      />
    )
  },
)

PolicyList.propTypes = {
  onSort: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  onLoadMoreRows: PropTypes.func.isRequired,
  onRowSelected: PropTypes.func.isRequired,
  singleSelectId: PropTypes.string,
  selectionState: PropTypes.object.isRequired,
  onSelected: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  selectedAll: PropTypes.bool.isRequired,
}

export default PolicyList
