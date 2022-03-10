import React, { memo, useCallback, useMemo } from 'react'
import type { TFunction } from 'react-i18next'
import { useTranslation } from 'react-i18next'

import { Button, IconButton, Link, makeStyles, Typography } from '@material-ui/core'
import Icon from '@material-ui/core/SvgIcon'

import { IpAddressSettingsQuery } from '@ues-data/bis'
import { Permission, usePermissions, useStatefulApolloQuery } from '@ues-data/shared'
import { BasicAdd, BasicDelete } from '@ues/assets'
import type { TableColumn } from '@ues/behaviours'
import {
  AppliedFilterPanel,
  BasicTable,
  FILTER_TYPES,
  Loading,
  OPERATOR_VALUES,
  QuickSearchFilter,
  TableProvider,
  TableSortDirection,
  TableToolbar,
  useClientFilter,
  useClientSort,
  useFilter,
  useFilterLabels,
  useQuickSearchFilter,
  useSelected,
  useSort,
  useTableFilter,
} from '@ues/behaviours'

import { TRANSLATIONS_NAMESPACES } from '../config'
import type { IpAddressEntry } from '../model'

interface IpAddressListProps {
  handleDeletion: (entries: IpAddressEntry[], onComplete: () => void) => void
  variables: { offset: number; sortBy: string; isBlacklist: boolean; sortDirection: string }
  onEntryClick: (entry: IpAddressEntry) => void
  onAddButtonClick: () => void
}

interface RemoveRowIconProps {
  deleteItemTitle: string
  handleDeletion: (entries: IpAddressEntry[]) => void
  id: string
  name: string
}

interface DeleteSelectedIconProps {
  data: {
    id: string
    name: string
    ipAddresses: string[]
    isBlacklist: boolean
    listType: string
    vendorUrl: string
  }[]
  handleDeletion: (entries: IpAddressEntry[]) => void
  selected: IpAddressEntry[]
  t: TFunction
}
enum IpAddressListHeaders {
  NAME = 'name',
  IPADDRESS = 'ipAddresses',
}

const IpAddressListlimit = 2

const RemoveRowIcon = memo(({ deleteItemTitle, handleDeletion, id, name }: RemoveRowIconProps) => {
  const handleClick = useCallback(() => handleDeletion([{ id, name }]), [handleDeletion, id, name])

  return (
    <IconButton size="small" title={deleteItemTitle} onClick={handleClick}>
      <Icon component={BasicDelete} />
    </IconButton>
  )
})

const DeleteSelectedIcon = memo(({ handleDeletion, selected, t }: DeleteSelectedIconProps) => {
  const handleClick = useCallback(() => handleDeletion(selected), [handleDeletion, selected])

  return (
    <Button startIcon={<BasicDelete />} variant="contained" color="primary" onClick={handleClick}>
      {t('bis/ues:settings.ipaddresses.delete')}
    </Button>
  )
})

const NameFilterComponent: React.FC = () => {
  const { t } = useTranslation(TRANSLATIONS_NAMESPACES)
  const filterProps = useTableFilter()
  const props = useQuickSearchFilter({ filterProps, key: IpAddressListHeaders.NAME, defaultOperator: OPERATOR_VALUES.CONTAINS })

  return useMemo(() => <QuickSearchFilter label={t('bis/ues:settings.ipaddresses.name')} operators={null} {...props} />, [props, t])
}

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
}))

const idFunction = row => row.id
const columnIdentifier = IpAddressListHeaders.NAME

const IpAddressList = memo(({ handleDeletion, onAddButtonClick, onEntryClick, variables }: IpAddressListProps) => {
  const { t } = useTranslation(TRANSLATIONS_NAMESPACES)
  const { hasPermission } = usePermissions()

  const canCreate = hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_CREATE)
  const canDelete = hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_DELETE)

  const { loading, data = { ipAddressSettings: [] } } = useStatefulApolloQuery(IpAddressSettingsQuery, {
    variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })

  const { ipAddressSettings } = data
  const filterProps = useFilter()
  const selectionProps = useSelected('id')
  const { selected } = selectionProps
  const styles = useStyles()

  const selectedEntries = useMemo(() => {
    const idsSet = new Set(selected)

    return ipAddressSettings.filter(entry => idsSet.has(entry.id))
  }, [ipAddressSettings, selected])

  const onDelete = useCallback(
    (entries: IpAddressEntry[]) => {
      const onDeletionCompleted = () => {
        const idsSet = new Set(entries.map(item => item.id))
        selectionProps.setSelected(selected => selected.filter(id => !idsSet.has(id)))
      }

      handleDeletion(entries, onDeletionCompleted)
    },
    [handleDeletion, selectionProps],
  )

  const columns = useMemo(
    (): TableColumn[] => [
      {
        dataKey: IpAddressListHeaders.NAME,
        label: t('bis/ues:settings.ipaddresses.name'),
        persistent: true,
        width: 400,
        sortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <NameFilterComponent />,
        renderCell: (entry: IpAddressEntry) => <Link onClick={() => onEntryClick(entry)}>{entry.name}</Link>,
      },
      {
        dataKey: IpAddressListHeaders.IPADDRESS,
        label: t('bis/ues:settings.ipaddresses.ipaddress'),
        persistent: true,
        width: 400,
        renderCell: (entry: IpAddressEntry) => {
          if (entry.ipAddresses.length > 2) {
            const twoElements = entry.ipAddresses.slice(0, IpAddressListlimit)
            return (
              <div>
                {twoElements.map(el => (
                  <div>{el}</div>
                ))}
                <Link onClick={() => onEntryClick(entry)}>
                  {t('bis/ues:settings.ipaddresses.more', { count: entry.ipAddresses.length - IpAddressListlimit })}
                </Link>
              </div>
            )
          }
          return (
            <div>
              {entry.ipAddresses.map(el => (
                <div>{el}</div>
              ))}
            </div>
          )
        },
      },
      {
        dataKey: 'id',
        icon: true,
        renderCell: (rowData: IpAddressEntry) => (
          <RemoveRowIcon
            deleteItemTitle={t('bis/ues:settings.ipaddresses.deleteItem')}
            handleDeletion={onDelete}
            id={rowData.id}
            name={rowData.name}
          />
        ),
        hidden: !canDelete,
      },
    ],
    [canDelete, onDelete, onEntryClick, t],
  )

  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const leftTableBar = (
    <>
      {selected.length > 0 && (
        <Typography variant="body2">{t('bis/ues:settings.ipaddresses.selectedItemsCount', { count: selected.length })}</Typography>
      )}
      {canCreate ? (
        <Button startIcon={<BasicAdd />} variant="contained" color="secondary" onClick={onAddButtonClick}>
          {t('bis/ues:settings.ipaddresses.addNew')}
        </Button>
      ) : null}
      {selected.length > 0 && (
        <DeleteSelectedIcon handleDeletion={onDelete} selected={selectedEntries} data={ipAddressSettings} t={t} />
      )}
    </>
  )

  const basicProps = useMemo(() => ({ columns, idFunction, columnIdentifier }), [columns])

  const sortProps = useSort(IpAddressListHeaders.NAME, TableSortDirection.Asc)
  const { sort, sortDirection } = sortProps

  const sortedData = useClientSort({
    data: ipAddressSettings ?? [],
    sort: { sortBy: sort, sortDir: sortDirection as TableSortDirection },
  })

  const filteredData = useClientFilter({ data: sortedData, activeFilters: filterProps.activeFilters, filterProps: columns })

  const rightTableBar = filteredData.length ? (
    <span>{t('bis/ues:settings.ipaddresses.results', { count: filteredData.length })}</span>
  ) : null

  if (loading) {
    return <Loading />
  }

  return (
    <div className={styles.container}>
      <TableToolbar
        begin={leftTableBar}
        end={rightTableBar}
        bottom={<AppliedFilterPanel {...filterProps} {...filterLabelProps} />}
      />
      <TableProvider
        basicProps={basicProps}
        sortingProps={sortProps}
        selectedProps={canDelete ? selectionProps : undefined}
        filterProps={filterProps}
      >
        <BasicTable data={filteredData} noDataPlaceholder={t('bis/ues:settings.ipaddresses.noData')} />
      </TableProvider>
    </div>
  )
})

export default IpAddressList
