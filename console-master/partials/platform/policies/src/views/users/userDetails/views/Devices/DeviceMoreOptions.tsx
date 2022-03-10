/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton, Menu, MenuItem } from '@material-ui/core'

import { BasicMoreVert } from '@ues/assets'
import { usePopover } from '@ues/behaviours'

export const DeviceMoreOptions = ({ endpointIds, onDeviceDeactivation }) => {
  const { t } = useTranslation(['platform/common'])
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const handleDeviceRemove = () => {
    handlePopoverClose()
    onDeviceDeactivation(endpointIds)
  }

  return (
    <>
      <IconButton onClick={handlePopoverClick}>
        <BasicMoreVert />
      </IconButton>
      <Menu anchorEl={popoverAnchorEl} getContentAnchorEl={null} open={popoverIsOpen} onClose={handlePopoverClose}>
        <MenuItem onClick={() => handleDeviceRemove()}>{t('users.details.devices.actions.remove')}</MenuItem>
      </Menu>
    </>
  )
}
