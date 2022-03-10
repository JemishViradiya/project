/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useCallback, useEffect, useState } from 'react'

import { Button, Dialog, makeStyles, Paper } from '@material-ui/core'

import { queryDeviceBrands } from '@ues-data/mtd'
import { useStatefulApolloQuery } from '@ues-data/shared'
import { getI18DeviceMetadata, getI18VendorName, useSecurityPatchSelect, useSecurityPatchToolbar } from '@ues-mtd/shared'
import { DialogChildren, InfiniteTable, InfiniteTableProvider, TableToolbar, useSnackbar } from '@ues/behaviours'

import { getI18LabelName, getI18Name, useTranslation } from './i18n'
import { sortByKey } from './reference'
import { OS_FAMILY } from './settings'
import { useFormValidation } from './validate'

const useStyles = makeStyles(theme => ({
  list: {
    display: 'flex',
    flexDirection: 'column',
    height: '400px',
    flexGrow: 1,
  },
}))

type AddSecurityPatchDialogProps = {
  open: boolean
  onClose: () => void
  onAdd: (selectedSecurityPatch: any) => void
  existingSelectedIds: any
}

export const AddSecurityPatchDialog = memo(({ open, onClose, onAdd, existingSelectedIds }: AddSecurityPatchDialogProps) => {
  const { t } = useTranslation()
  const snackbar = useSnackbar()
  const classes = useStyles()

  const notification = useCallback((message, variant) => snackbar.enqueueMessage(t(message), variant), [snackbar, t])

  const {
    securityPatchData,
    unfilteredSecurityPatchData,
    securityPatchDataLoading,
    fetchMore,
    setSortBy,
    setSortDir,
    setSearch,
  } = useSecurityPatchData(notification, existingSelectedIds)

  const { tableProps, providerProps, getSelected } = useSecurityPatchSelect({
    data: securityPatchData?.deviceBrands,
    unfilteredData: unfilteredSecurityPatchData?.deviceBrands,
    fetchMore,
  })

  useEffect(() => {
    setSortBy(providerProps?.sortingProps.sort)
    setSortDir(providerProps?.sortingProps.sortDirection)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerProps?.sortingProps])

  const toolbarProps = useSecurityPatchToolbar({
    t,
    selectedIds: providerProps?.selectedProps.selected,
    items: securityPatchData?.deviceBrands?.count?.total ?? 0,
    onSearch: setSearch,
    loading: securityPatchDataLoading,
  })

  const formProps = {
    component: 'form' as React.ElementType<React.HTMLAttributes<HTMLElement>>,
    onSubmit: useCallback(event => {
      event.preventDefault()
      event.stopPropagation()
      const formData = [...event.target.elements].reduce(
        (agg, item) => (item.id ? Object.assign(agg, { [item.id]: item.value }) : agg),
        {},
      )
    }, []),
  }

  const cleanup = () => {
    setSearch('')
    providerProps?.selectedProps.resetSelectedItems()
    onClose()
  }

  const onAddCallback = useCallback(() => {
    onAdd(getSelected())
  }, [getSelected, onAdd])

  return (
    <Dialog PaperProps={formProps} disableBackdropClick open={open} onExit={cleanup} onClose={cleanup}>
      <DialogChildren
        title={t(getI18Name('androidHwAttestationSecurityPatchList'))}
        onClose={cleanup}
        description={t(getI18LabelName('androidHwAttestationSecurityPatchList'))}
        content={
          <Paper className={classes.list}>
            <TableToolbar {...toolbarProps} />
            <InfiniteTableProvider {...providerProps}>
              <InfiniteTable {...tableProps} />
            </InfiniteTableProvider>
          </Paper>
        }
        actions={
          <>
            <Button variant="outlined" onClick={cleanup}>
              {t(getI18Name('create.cancelButtonLabel'))}
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={onAddCallback}
              disabled={providerProps?.selectedProps.selected.length === 0}
            >
              {t(getI18Name('create.addButtonLabel'))}
            </Button>
          </>
        }
      />
    </Dialog>
  )
})

export const useSecurityPatchData = (notify: (message: string, type: string) => void, existingSelectedIds) => {
  const { t } = useTranslation()
  const formValidation = useFormValidation()
  const [sortBy, setSortBy] = useState('vendor')
  const [sortDir, setSortDir] = useState('asc')
  const [search, setSearch] = useState('')
  const { data, error, loading, fetchMore, refetch } = useStatefulApolloQuery(queryDeviceBrands, {
    variables: { osFamily: OS_FAMILY.ANDROID },
  })

  useEffect(() => {
    formValidation.validateApolloQuery(loading, error, data?.deviceBrands, 'deviceHardwareLoadingErrorMessage')
  }, [data, error, loading, formValidation])

  const initElements = (deviceBrands, sortBy, sortDir, search, existingSelectedBrands) => {
    const result = []
    const searchFor = search?.toLowerCase()
    const filteredIds = []
    existingSelectedBrands.map(brand => {
      filteredIds.push(brand.vendor + ' ' + brand.brand)
    })

    // console.log('initElements: ', { search, searchFor })

    const createBrand = (vendor, brand) => {
      const vendorKey = vendor ? getI18VendorName(vendor) : getI18DeviceMetadata('allVendors')
      return {
        vendor: vendorKey ? t(vendorKey) : vendor,
        vendorValue: vendor,
        brand: brand ? brand : t(getI18DeviceMetadata('allBrands')),
        brandValue: brand,
      }
    }

    // add row for "All Vendor"
    const allVendors = createBrand(null, null)
    if (includeBrand(allVendors.vendor, allVendors.brand, searchFor, filteredIds)) {
      result.push(allVendors)
    }

    const addedVendors = []
    deviceBrands.map(brand => {
      // add "All Brands" for this vendor, not already added
      const allBrands = createBrand(brand.vendor.name, null)
      if (
        !addedVendors.includes(allBrands.vendorValue) &&
        includeBrand(allBrands.vendor, allBrands.brand, searchFor, filteredIds)
      ) {
        result.push(allBrands)
        addedVendors.push(allBrands.vendorValue)
      }

      const thisBrand = createBrand(brand.vendor.name, brand.name)
      if (includeBrand(thisBrand.vendor, thisBrand.brand, searchFor, filteredIds)) {
        result.push(thisBrand)
      }
    })

    return sortByKey(result, { sortBy: sortBy, sortDir: sortDir })
  }

  return {
    securityPatchData: {
      deviceBrands: {
        totals: { pages: 1, elements: data?.deviceBrands?.length },
        count: data?.deviceBrands?.length,
        elements: initElements(data?.deviceBrands ?? [], sortBy, sortDir, search, existingSelectedIds),
      },
    },
    unfilteredSecurityPatchData: {
      deviceBrands: {
        totals: { pages: 1, elements: data?.deviceBrands?.length },
        count: data?.deviceBrands?.length,
        elements: initElements(data?.deviceBrands ?? [], sortBy, sortDir, null, existingSelectedIds),
      },
    },
    securityPatchDataLoading: loading,
    fetchMore,
    setSortBy,
    setSortDir,
    setSearch,
    refetchSecurityPatch: refetch,
  }
}

function includeBrand(vendor, brand, searchString, excludedStrings) {
  return (
    !excludedStrings.includes(vendor + ' ' + brand) &&
    (!searchString ||
      searchString.length === 0 ||
      vendor.toLowerCase().includes(searchString) ||
      brand.toLowerCase().includes(searchString))
  )
}

export default AddSecurityPatchDialog
