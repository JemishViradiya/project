import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { deleteUsersMutation, UsersApi } from '@ues-data/platform'
import { usePrevious, useStatefulApolloMutation, useStatefulReduxQuery } from '@ues-data/shared'
import {
  ColumnPicker,
  ConfirmationState,
  OPERATOR_VALUES,
  useColumnPicker,
  useConfirmation,
  useFilter,
  useSelected,
  useSnackbar,
  useSort,
} from '@ues/behaviours'

const resolveEnum = rawValue => {
  return `=${rawValue.value}`
}

const resolveString = rawValue => {
  const { operator, value } = rawValue
  switch (operator) {
    case OPERATOR_VALUES.CONTAINS:
      return `=*${value}*`
    case OPERATOR_VALUES.STARTS_WITH:
      return `=${value}*`
    case OPERATOR_VALUES.ENDS_WITH:
      return `=*${value}`
    default:
      return null
  }
}

const resolveNumber = rawValue => {
  const { operator, value } = rawValue
  switch (operator) {
    case OPERATOR_VALUES.GREATER_OR_EQUAL:
      return `>=${value}`
    case OPERATOR_VALUES.GREATER:
      return `>${value}`
    case OPERATOR_VALUES.LESS_OR_EQUAL:
      return `<=${value}`
    case OPERATOR_VALUES.LESS:
      return `<${value}`
    case OPERATOR_VALUES.EQUAL:
      return `=${value}`
    default:
      return null
  }
}

export const resolveFilter = (type, value) => {
  switch (type) {
    case 'enum':
      return resolveEnum(value)
    case 'string':
      return resolveString(value)
    case 'number':
      return resolveNumber(value)
    default:
      return null
  }
}

const TABLE_NAME = 'usersTable'
const QUERY_SEPARATOR = ','
const idFunction = (rowData: any) => rowData.id

export const useUserTable = ({ columns }) => {
  const mounted = React.useRef(true)
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const snackbar = useSnackbar()
  const confirmation = useConfirmation()

  const sortingProps = useSort('displayName', 'asc')
  const { sort, sortDirection } = sortingProps

  const filterProps = useFilter({})

  const selectedProps = useSelected('id')

  const usersVars = useMemo(() => {
    let query = 'isAdminOnly=false'
    Object.entries(filterProps.activeFilters).forEach(filter => {
      if (query !== '') query += QUERY_SEPARATOR
      const key = filter[0]
      switch (key) {
        case 'displayName':
        case 'emailAddress':
          query += key + resolveFilter('string', filter[1])
          break
        case 'dataSource': {
          query += key + resolveFilter('enum', filter[1])
          break
        }
      }
    })
    return { sortBy: `${sort} ${sortDirection?.toUpperCase()}`, query, max: 500 }
  }, [sort, sortDirection, filterProps.activeFilters])

  const { data, loading, error, refetch, fetchMore } = useStatefulReduxQuery(UsersApi.queryUsers, {
    variables: usersVars,
  })

  useEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    if (error) {
      snackbar.enqueueMessage(t('users.message.error.fetch'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, t])

  const handleOnRowsScrollEnd = useCallback(
    async params => {
      const nextOffset = data?.elements?.length ?? 0
      if (!data || data?.elements?.length === data?.totals?.elements) return

      await fetchMore({ ...usersVars, offset: nextOffset })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, fetchMore],
  )

  const { displayedColumns, columnPickerProps } = useColumnPicker({
    columns,
    title: t('groups.table.columnPickerTitle'),
    tableName: TABLE_NAME,
  })
  columnPickerProps.tableCell = false

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
      idFunction,
      loading,
    }),

    [displayedColumns, loading, columnPickerProps],
  )

  const [deleteUsersFn, deleteUsersResponse] = useStatefulApolloMutation(deleteUsersMutation, {
    variables: { userIds: [] },
  })

  const deleteResponsePrev = usePrevious(deleteUsersResponse)

  const deleteUsers = useCallback(() => {
    deleteUsersFn({ variables: { userIds: [...selectedProps.selected] } })
  }, [deleteUsersFn, selectedProps.selected])

  useEffect(() => {
    if (deleteUsersResponse.error) {
      snackbar.enqueueMessage(t('users.message.error.delete'), 'error')
    } else if (!deleteUsersResponse.loading && deleteResponsePrev.loading) {
      refetchUsersAndShowSuccessMessage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteUsersResponse])

  const handleDelete = useCallback(async () => {
    const confirmationState = await confirmation({
      title: t('users.actions.delete'),
      description: t('users.actions.deleteUserDescription', { userCount: selectedProps.selected.length }),
      cancelButtonLabel: t('general/form:commonLabels.cancel'),
      confirmButtonLabel: t('general/form:commonLabels.delete'),
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      deleteUsers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProps?.selected])

  const refetchUsersAndShowSuccessMessage = () => {
    const successMessage =
      selectedProps?.selected?.length > 1 ? t('users.message.success.deletePlural') : t('users.message.success.delete')
    refetch(usersVars)
    selectedProps.resetSelectedItems()
    snackbar.enqueueMessage(successMessage, 'success')
  }

  return {
    providerProps: { basicProps, sortingProps, filterProps, selectedProps, data: data?.elements ?? [] },
    filterPanelProps: { ...filterProps },
    onDelete: handleDelete,
    showLoading: deleteUsersResponse?.loading,
    tableProps: {
      rows: data?.elements ?? [],
      loading,
      onRowsScrollEnd: handleOnRowsScrollEnd,
      checkboxSelection: true,
      tableName: TABLE_NAME,
    },
    totalCount: data?.totals?.elements ?? 0,
  }
}
