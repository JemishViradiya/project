import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { IpAddressSettingsQuery } from '@ues-data/bis'
import { BasicDelete } from '@ues/assets'

import { hasEmptySelection, Icon, IconButton, useQueryCallback } from '../../../../shared'

const getSelectedIpAddresses = (ipAddressSettings, selectionState, searchText) => {
  const selected = Object.keys(selectionState.selected)
  const deselected = Object.keys(selectionState.deselected)

  return ipAddressSettings.filter(ipAddressSetting => {
    let allow = true
    if (selectionState.selectMode) {
      if (selected.length > 0) {
        allow = allow && selected.includes(ipAddressSetting.id)
      }
      allow = allow && selected.includes(ipAddressSetting.id)
    } else {
      allow = allow && !deselected.includes(ipAddressSetting.id)
    }

    if (searchText.length >= 3) {
      allow = allow && ipAddressSetting.name.toLowerCase().includes(searchText.toLowerCase())
    }
    return allow
  })
}

const DeleteButton = memo(({ selectionState, openDeleteDialog, variables }) => {
  const { t } = useTranslation()
  const emptySelection = hasEmptySelection(selectionState)

  const deleteSelected = useQueryCallback(
    IpAddressSettingsQuery,
    { fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first', variables: { ...variables, limit: 10000, offset: 0 } },
    result => {
      const selection = getSelectedIpAddresses(result?.ipAddressSettings || [], selectionState, variables.searchText)
      if (selection.length > 0) {
        openDeleteDialog(selection)
      }
    },
  )

  return (
    !emptySelection && (
      <IconButton onClick={deleteSelected} title={t('common.delete')}>
        <Icon icon={BasicDelete} />
      </IconButton>
    )
  )
})

DeleteButton.displayName = 'DeleteButton'

DeleteButton.protoTypes = {
  selectionState: PropTypes.object.isRequired,
  openDeleteDialog: PropTypes.func.isRequired,
  variables: PropTypes.object.isRequired,
}

export default DeleteButton
