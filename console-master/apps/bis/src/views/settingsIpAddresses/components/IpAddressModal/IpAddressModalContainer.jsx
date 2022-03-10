import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo } from 'react'

import { Context } from '../../../../providers/IpAddressListProvider'
import IpAddressModal from './IpAddressModal'
import { getIpAddressesString, getRequestData } from './utils'

const USER_LIST_TYPE = 'user'
const EMPTY_STRING = ''
const IpAddressModalContainer = memo(
  ({ dialogId, canEdit, onClose, isBlacklist, handleAddIpAddressList, handleUpdateIpAddressList, isEditMode }) => {
    const { data = {}, loading } = useContext(Context)
    const hiddenFormValues = useMemo(
      () => ({
        isBlacklist: isBlacklist,
        listType: USER_LIST_TYPE,
      }),
      [isBlacklist],
    )
    const defaultValues = useMemo(
      () => ({
        name: isEditMode && data.name ? data.name : EMPTY_STRING,
        ipAddresses: getIpAddressesString((isEditMode && data.ipAddresses) || []),
      }),
      [data.ipAddresses, data.name, isEditMode],
    )

    const onAddIpAddressList = useCallback(props => handleAddIpAddressList(getRequestData(hiddenFormValues, props)), [
      hiddenFormValues,
      handleAddIpAddressList,
    ])

    const onUpdateIpAddressList = useCallback(
      async props => {
        const oldData = { ...data }
        await handleUpdateIpAddressList(getRequestData(oldData, props, true))
      },
      [handleUpdateIpAddressList, data],
    )

    const onSave = useCallback(
      async props => {
        if (isEditMode) return await onUpdateIpAddressList(props)
        await onAddIpAddressList(props)
      },
      [onAddIpAddressList, onUpdateIpAddressList, isEditMode],
    )

    return (
      !loading && (
        <IpAddressModal
          dialogId={dialogId}
          onSave={onSave}
          canEdit={canEdit}
          onClose={onClose}
          isBlacklist={isBlacklist}
          defaultValues={defaultValues}
        />
      )
    )
  },
)

IpAddressModalContainer.displayName = 'IpAddressModalContainer'

IpAddressModalContainer.propTypes = {
  dialogId: PropTypes.string,
  canEdit: PropTypes.bool,
  onClose: PropTypes.func,
  isEditMode: PropTypes.bool,
  isBlacklist: PropTypes.bool,
  handleAddIpAddressList: PropTypes.func,
  handleUpdateIpAddressList: PropTypes.func,
}

export default IpAddressModalContainer
