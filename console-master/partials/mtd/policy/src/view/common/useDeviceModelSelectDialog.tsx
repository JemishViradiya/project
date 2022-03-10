/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { DialogProps } from '@material-ui/core'

import { getI18VendorName } from '@ues-mtd/shared'
import { useControlledDialog } from '@ues/behaviours'

import { TreeSelectDialogContent } from './TreeSelectDialogContent'
import type { TreeSelectItem } from './TreeSelectRow'

interface DeviceVendor {
  name: string
  brands?: DeviceBrand[]
}

interface DeviceBrand {
  name: string
  models?: string[]
}

type DeviceModelTreeSelectDialogInput = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  loading?: boolean
  handleSearch?: (str: string) => void
  submitAssignment?: (assignments: DeviceVendor[]) => void
  selected: DeviceVendor[]
  readOnly?: boolean
}

type DeviceModelTreeSelectDialogReturn = {
  dialogOptions: DialogProps
  setDialogId: (s: symbol) => void
}

export const useDeviceModelSelectDialog = ({
  data,
  loading = false,
  handleSearch,
  submitAssignment,
  selected,
  readOnly = false,
}: DeviceModelTreeSelectDialogInput): DeviceModelTreeSelectDialogReturn => {
  const { t } = useTranslation(['mtd/common', 'general/form'])

  const [dialogId, setDialogId] = useState(null)
  const { open, onClose } = useControlledDialog({
    dialogId: dialogId,
    onClose: () => {
      // todo
    },
  })

  const selectedIds = []
  selected.forEach(vendor => {
    if (vendor.brands) {
      vendor.brands.forEach(brand => {
        if (brand.models) {
          brand.models.forEach(model => {
            selectedIds.push(vendor.name + '||' + brand.name + '||' + model)
          })
        } else {
          selectedIds.push(vendor.name + '||' + brand.name)
        }
      })
    } else {
      selectedIds.push(vendor.name)
    }
  })
  const selectedTreeItems = {}
  const modifyData = (rawData: any[]): TreeSelectItem[] => {
    // console.log('modifyData: ', { selected })
    const checkboxTree = []
    const flattened = []
    rawData.forEach(d => {
      flattened.push({ name: d.name, brand: d.brand.name, vendor: d.brand.vendor.name })
    })
    const vendorTree = groupByAsMap(flattened, flat => flat.vendor)
    for (const [vendor, brands] of vendorTree.entries()) {
      const vendorKey = getI18VendorName(vendor.toLowerCase())
      const vendorNode: TreeSelectItem = {
        id: vendor,
        name: vendorKey ? t(vendorKey, vendor) : vendor,
        value: { vendor: vendor },
      }
      if (selectedIds.includes(vendorNode.id)) {
        selectedTreeItems[vendorNode.id] = vendorNode
      }
      const brandCheckboxTree = []
      const brandTree = groupByAsMap(brands, brand => brand.brand)
      for (const [brand, models] of brandTree.entries()) {
        const brandNodeId = vendor + '||' + brand
        const brandNode: TreeSelectItem = {
          id: brandNodeId,
          value: { vendor: vendor, brand: brand },
          name: brand,
          parent: vendorNode,
        }
        if (selectedIds.includes(vendorNode.id) || selectedIds.includes(brandNode.id)) {
          selectedTreeItems[brandNode.id] = brandNode
        }
        const modelCheckboxTree = []
        models.forEach(model => {
          const modelNodeId = brandNodeId + '||' + model.name
          const modelNode: TreeSelectItem = {
            id: modelNodeId,
            name: model.name,
            value: { vendor: vendor, brand: brand, model: model.name },
            parent: brandNode,
          }
          modelCheckboxTree.push(modelNode)
          if (selectedIds.includes(vendorNode.id) || selectedIds.includes(brandNode.id) || selectedIds.includes(modelNode.id)) {
            selectedTreeItems[modelNode.id] = modelNode
          }
        })
        brandNode.children = sortByKey(modelCheckboxTree, 'name')
        brandCheckboxTree.push(brandNode)
      }
      vendorNode.children = sortByKey(brandCheckboxTree, 'name')
      checkboxTree.push(vendorNode)
    }
    return sortByKey(checkboxTree, 'name')
  }
  // console.log('selected: ', { selectedTreeItems })

  const handleSearchChange = (search: string) => {
    handleSearch(search)
  }

  const editLabels = {
    title: t('policy.selectDeviceModelDialog.title'),
    description: t('policy.selectDeviceModelDialog.description'),
    searchText: t('policy.selectDeviceModelDialog.searchText'),
    cancel: t('common.cancel'),
    submit: t('common.save'),
    searchCancel: t('general/form:commonLabels.clear'),
  }

  const viewLabels = {
    title: t('policy.viewDeviceModelDialog.title'),
    close: t('common.close'),
    submit: t('common.save'),
    noModels: t('policy.viewDeviceModelDialog.noData'),
  }

  const getByVendorAndBrand = (deviceVendors, vendorName, brandName) => {
    let brandResult = undefined
    let vendorResult = undefined
    deviceVendors.forEach(vendor => {
      if (vendor.name === vendorName) {
        vendorResult = vendor
      }
      if (brandName && vendor.brands) {
        brandResult = vendor.brands.map(brand => {
          if (brand.name === brandName) {
            return brand
          }
        })
      }
    })
    return { vendorResult, brandResult }
  }

  const onSubmitAssignment = (selected: TreeSelectItem[]) => {
    if (selected && selected.length > 0) {
      const deviceModels: DeviceVendor[] = []
      selected.forEach(item => {
        const { vendorResult: existingVendor, brandResult: existingBrand } = getByVendorAndBrand(
          deviceModels,
          item.value.vendor,
          item.value.brand,
        )
        // items are added in tree order: selected vendors first, then vendor's brands, then brand's models
        // if a parent is fully selected in the tree, then children are actually ignored and not added to the policy
        if (item.value.model) {
          // existing brand with models, add ours
          if (existingBrand && existingBrand.models) {
            existingBrand.models.push(item.value.model)
          } else if (existingVendor && existingVendor.brands) {
            // existing vendor with brands, add this brand and model
            existingVendor.brands.push({ name: item.value.brand, models: [item.value.model] })
          } else if (existingVendor === undefined) {
            // make sure parent vendor isn't already included, in which case we skip
            deviceModels.push({ name: item.value.vendor, brands: [{ name: item.value.brand, models: [item.value.model] }] })
          }
          // else, do not add this model, as it's covered by a parent vendor or brand already
        } else if (item.value.brand) {
          // look for existing vendor with brands
          if (existingVendor && existingVendor.brands) {
            existingVendor.brands.push({ name: item.value.brand })
          } else if (existingVendor === undefined) {
            deviceModels.push({ name: item.value.vendor, brands: [{ name: item.value.brand }] })
          }
          // else, do not add this brand, as it's covered by a parent vendor already
        } else {
          // look for existing vendor or add it
          if (existingVendor === undefined) {
            deviceModels.push({ name: item.value.vendor })
          }
        }
      })
      //console.log('onSubmit final: ', { deviceModels })
      submitAssignment(deviceModels)
    }
    onClose()
    handleSearch('')
  }

  const closeHandler = () => {
    onClose()
    if (!readOnly) {
      handleSearch('')
    }
  }

  const getContent = () => {
    return (
      <TreeSelectDialogContent
        variants={modifyData(data)}
        loading={loading}
        labels={readOnly ? viewLabels : editLabels}
        handleSearchChange={handleSearchChange}
        closeHandler={closeHandler}
        submitHandler={onSubmitAssignment}
        selected={selectedTreeItems}
        allowEmpty={false}
        readOnly={readOnly}
      />
    )
  }

  return { dialogOptions: { open, onClose, children: getContent(), maxWidth: 'sm', fullWidth: true }, setDialogId }
}

function groupByAsMap(list, keyGetter) {
  const map = new Map()
  list.forEach(item => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}

function sortByKey(array, key) {
  return array.sort(function (a, b) {
    const x = a[key]
    const y = b[key]
    return x < y ? -1 : x > y ? 1 : 0
  })
}

function countTreeNodes(checkboxTree) {
  let count = 0
  checkboxTree.forEach(node => {
    if (node.children) {
      count += countTreeNodes(node.children)
    }
    count++
  })
  return count
}

function moveOrCopyNodes(source, destination, checked) {
  const checkedNodes = [...source].filter(getCheckedNodes, checked)
  const sourceNew = source.filter(e => getCheckedNodes(e), checked)
  const destinationNew = checkedNodes
  return { sourceNew, destinationNew }
}

function getCheckedNodes(node) {
  if (this.includes(node.value)) {
    return true
  } else if (node.children) {
    node.children = node.children.filter(getCheckedNodes, this)
    return node.children.length > 0
  }
  return false
}

function getPolicyPayload(nodes, checked) {
  const policyPayload = []
  nodes.map(vendor => {
    if (checked.includes(vendor.value)) {
      policyPayload.push({ vendor: vendor.vendor })
    } else if (vendor.children) {
      const brands = []
      vendor.children.map(brand => {
        if (checked.includes(brand.value)) {
          brands.push({ brandName: brand.brand })
        } else if (brand.children) {
          const models = []
          brand.children.map(model => {
            if (checked.includes(model.value)) {
              models.push(model.model)
            }
          })
          if (models.length > 0) {
            brands.push({ brandName: brand.brand, models: models })
          }
        }
      })
      if (brands.length > 0) {
        policyPayload.push({ vendorName: vendor.vendor, brands: brands })
      }
    }
  })
  return policyPayload
}
