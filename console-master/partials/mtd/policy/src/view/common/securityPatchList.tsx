import moment from 'moment'
import React, { useCallback, useState } from 'react'

import DateFnsUtils from '@date-io/moment'

import type { TableCellProps } from '@material-ui/core'
import { IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

import { getI18DeviceMetadata, getI18VendorName } from '@ues-mtd/shared'
import { BasicAddRound, BasicDelete, dateFormats, I18nFormatCodes, I18nFormats } from '@ues/assets'
import type { TableSortDirection, UseControlledDialogProps } from '@ues/behaviours'
import { BasicTable, TableProvider, useClientSort, useControlledDialog, useSort } from '@ues/behaviours'

import AddSecurityPatchDialog from './addSecurityPatchDialog'
import { getI18Name, useTranslation } from './i18n'
import { useReference } from './reference'
import { FORM_REFS } from './settings'
import useStyles from './styles'

const DEFAULT_DATE = { year: 2020, month: 1, day: 1 }

const useBorderError = makeStyles(theme => ({
  gridError: {
    borderColor: theme.palette.error.main,
  },
  standard: {
    color: theme.palette.background.default,
  },
}))

type SecurityPatchListProps = {
  name: string
  handleChange: () => void
  values: any
  errors: any
  disabled: boolean
}

type SecurityPatch = {
  date: any
  vendor?: string
  brand?: string
}

type SecurityPatchRow = {
  date: any
  vendor?: string
  vendorValue: string
  brand?: string
  brandValue: string
}

const SecurityPatchList = React.memo(({ name, handleChange, values, errors, disabled }: SecurityPatchListProps) => {
  const { t } = useTranslation()

  const align: TableCellProps['align'] = 'right'
  const { getRef } = useReference()
  const classes = useStyles()
  const borderError = useBorderError()
  const format = I18nFormats['DateShort']
  const sortProps = useSort('vendor', 'asc')
  const { sort: sortBy, sortDirection: sortDir } = sortProps
  const [tableData, setTableData] = useState(values[name] ? initTable(t, values[name]) : [])
  const sortedData = useClientSort<SecurityPatchRow>({
    data: tableData,
    sort: { sortBy: sortBy, sortDir: sortDir as TableSortDirection },
  })

  const [addSecurityPatchDialogStateId, setAddSecurityPatchDialogStateId] = useState<UseControlledDialogProps['dialogId']>()

  const { open: openAddSecurityPatch, onClose: onCloseAddSecurityPatch } = useControlledDialog({
    dialogId: addSecurityPatchDialogStateId,
    onClose: useCallback(reason => {
      setAddSecurityPatchDialogStateId(undefined)
    }, []),
  })

  const updatePolicy = (name, data) => {
    const policyData = []
    data.map(row => {
      const policyRow: SecurityPatch = { date: row.date }
      if (row.vendorValue) {
        policyRow.vendor = row.vendorValue
      }
      if (row.brandValue) {
        policyRow.brand = row.brandValue
      }
      policyData.push(policyRow)
    })
    getRef(FORM_REFS.FORMIK_BAG).setFieldValue(name, policyData, true)
  }

  const onAddSecurityPatch = selectedSecurityPatch => {
    const newList = [...tableData]
    selectedSecurityPatch.map(securityPatch => {
      securityPatch.date = DEFAULT_DATE
      newList.push(securityPatch)
    })
    setTableData(newList)
    updatePolicy(name, newList)
    setAddSecurityPatchDialogStateId(undefined)
  }

  const handleDelete = (vendorValue, brandValue) => {
    const newList = tableData.filter((row: SecurityPatchRow) => !(row.vendorValue === vendorValue && row.brandValue === brandValue))
    setTableData(newList)
    updatePolicy(name, newList)
  }

  const handleDateChange = (date, vendorValue, brandValue) => {
    const newList = tableData.map(item => {
      if (item.vendorValue === vendorValue && item.brandValue === brandValue) {
        return {
          ...item,
          date: {
            year: date?.year(),
            month: date?.month() + 1,
            day: date?.date(),
          },
        }
      }
      return item
    })
    setTableData(newList)
    updatePolicy(name, newList)
  }

  const COLUMNS = [
    {
      dataKey: 'vendor',
      label: t(getI18Name('androidHwAttestationSecurityPatchVendor')),
      width: 300,
      sortable: true,
      renderCell: (rowData: any, rowDataIndex: number) => {
        return rowData.vendor
      },
    },
    {
      dataKey: 'brand',
      label: t(getI18Name('androidHwAttestationSecurityPatchBrand')),
      sortable: true,
      width: 300,
      renderCell: (rowData: any, rowDataIndex: number) => {
        return rowData.brand
      },
    },
    {
      dataKey: 'date',
      label: t(getI18Name('androidHwAttestationSecurityPatchDate')),
      sortable: false,
      renderCell: (rowData: any, rowDataIndex: number) => {
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              style={{ marginBottom: 0 }}
              className="no-label"
              disabled={disabled}
              disableToolbar
              variant="inline"
              format={dateFormats.DateShort}
              placeholder={dateFormats.DateShort}
              size="small"
              id="date-picker-inline"
              value={new Date(rowData.date.year, rowData.date.month - 1, rowData.date.day)}
              onChange={e => handleDateChange(e, rowData.vendorValue, rowData.brandValue)}
              invalidDateMessage={t('general/form:validationErrors.invalidDateFormat')}
              KeyboardButtonProps={{
                'aria-label': t(getI18Name('androidHwAttestationSecurityPatchDate')),
              }}
            />
          </MuiPickersUtilsProvider>
        )
      },
    },
    {
      dataKey: 'action',
      icon: true,
      label: 'Action',
      align: align,
      renderCell: (rowData: any, rowDataIndex: number) => {
        if (rowData['icon'] === -1) return undefined
        return (
          <IconButton
            size="small"
            aria-label={t('common.delete')}
            disabled={disabled}
            onClick={event => handleDelete(rowData.vendorValue, rowData.brandValue)}
          >
            <BasicDelete />
          </IconButton>
        )
      },
      renderLabel: () => (
        <IconButton
          aria-label={t('common.add')}
          size="small"
          disabled={disabled}
          onClick={event => {
            setAddSecurityPatchDialogStateId(Symbol('addNewSecurityPatch'))
          }}
        >
          <BasicAddRound />
        </IconButton>
      ),
    },
  ]

  const idFunction = row => '|' + row.vendorValue + '|' + row.brandValue
  const basicProps = {
    columns: COLUMNS,
    idFunction,
    embedded: true,
  }

  return (
    <div className={`${classes.separator} ${classes.separatorTop}`}>
      <TableProvider basicProps={basicProps} sortingProps={sortProps}>
        <BasicTable
          data={sortedData ?? []}
          noDataPlaceholder={t('general/form:commonLabels.noData')}
          title={t(getI18Name('androidHwAttestationSecurityPatchEnabled'))}
        />
      </TableProvider>
      <AddSecurityPatchDialog
        key="addNewSecurityPatch"
        open={openAddSecurityPatch}
        onClose={onCloseAddSecurityPatch}
        onAdd={onAddSecurityPatch}
        existingSelectedIds={tableData}
      />
    </div>
  )
})

function initTable(t, policyData) {
  const rowData = []
  policyData.map(record => {
    rowData.push({
      vendor: getVendorDisplay(t, record.vendor),
      vendorValue: record.vendor,
      brand: record.brand ? record.brand : t(getI18DeviceMetadata('allBrands')),
      brandValue: record.brand,
      date: record.date,
    })
  })
  return rowData
}

export function getVendorDisplay(t, vendor) {
  if (!vendor) {
    return t(getI18DeviceMetadata('allVendors'))
  }
  const vendorKey = getI18VendorName(vendor)
  return vendorKey ? t(vendorKey) : vendor
}

export default SecurityPatchList
